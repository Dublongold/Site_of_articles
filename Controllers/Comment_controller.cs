using Dublongold_site.Filters;
using Dublongold_site.Models;
using Dublongold_site.Useful_classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dublongold_site.Controllers
{
    [Route("comment")]
    [Authenticated_user_filter]
    [Authenticated_deleted_user_filter]
    public class Comment_control:Controller
    {
        private readonly Database_context db_context;
        private static object for_lock = new();
        public Comment_control(Database_context new_db_context)
        {
            db_context = new_db_context;
        }
        [HttpGet]
        [Route("load_more")]
        public IActionResult Load_more_comments(int last_comment_id, DateTime open_at)
        {
            using (db_context)
            {

            }
            return BadRequest();
        }
        [HttpPost]
        [Route("create/{article_id:int}")]
        public IActionResult Create_comment(int article_id, string comment_content, int reply_level, int comment_id)
        {
            lock (for_lock)
            {
                using (db_context)
                {
                    int free_comment_id = Find_free_id_of_comments.Get_free_id(db_context.Article_comments.Where(c => c.Article_id == article_id).Select(c => c.Id).ToList());
                    Article_comment comment = new()
                    {
                        Id = free_comment_id,
                        Article_id = article_id,
                        Content = comment_content,
                        Author = db_context.User_accounts.First(u => u.Login == User.Identity!.Name),
                        Reply_level = reply_level
                    };
                    if (reply_level > 0)
                    {
                        int replies_count = db_context.Article_comments.Where(c => c.Id == comment_id && c.Article_id == article_id).Include(c => c.Replying_comments).FirstOrDefault()?.Replying_comments.Count() ?? 0;
                        HttpContext.Response.Headers.Add("replies-count", (replies_count + 1).ToString());
                        comment.Reply_to_comment_id = comment_id;
                        comment.Reply_to_comment_id_of_article = article_id;
                    }
                    else
                    {
                        HttpContext.Response.Headers.Add("comment-id", free_comment_id.ToString());
                    }
                    HttpContext.Response.Headers.Add("reply_level", reply_level.ToString());
                    db_context.Add(comment);
                    db_context.SaveChanges();
                    comment = db_context.Article_comments.First(c => c.Id == free_comment_id && c.Article_id == article_id);
                    HttpContext.Response.Headers.Add("reply-comment-id", free_comment_id.ToString());
                    db_context.Entry(comment).Reference(c => c.Author).Load();
                    db_context.Entry(comment).Reference(c => c.Reply_to_comment).Load();
                    return View("/Views/Comments/Comment_builder.cshtml", comment);
                }
            }
        }
        [HttpPut]
        [Route("edit/{comment_id:int}/{article_id:int}")]
        public IActionResult Edit_comment(int comment_id, int article_id, string new_content)
        {
            lock (for_lock)
            {
                using (db_context)
                {
                    Article_comment? comment = db_context.Article_comments.FirstOrDefault(c => c.Id == comment_id && c.Article_id == article_id);
                    if (comment is not null)
                    {
                        comment.Content = new_content;
                        comment.Edited_date = DateTime.Now;
                        comment.Who_edit = db_context.User_accounts.First(u => u.Login == User.Identity!.Name);
                        db_context.Article_comments.Update(comment);
                        db_context.SaveChanges();
                        return Ok();
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
        }
        [HttpDelete]
        [Route("delete/{comment_id:int}/{article_id:int}")]
        public IActionResult Delete_comment(int comment_id, int article_id)
        {
            lock (for_lock)
            {
                using (db_context)
                {
                    Article_comment? comment = db_context.Article_comments.Where(c => c.Id == comment_id && c.Article_id == article_id).Include(c => c.Author).FirstOrDefault();
                    // Якщо коментар не пустий і якщо або користувач, що видаляє статтю - авторизований користувач, або автор коментаря - авторизований користувач.
                    if (comment is not null)
                    {
                        if ((db_context.Articles.Where(art => art.Id == article_id).Include(art => art.Authors).Any(art => art.Authors.Any(u => u.Login == User.Identity!.Name))
                        || comment.Author.Login == User.Identity!.Name))
                        {
                            Delete_comment_with_replies.Delete(comment, db_context);
                            db_context.SaveChanges();
                            int main_comment_id = comment.Reply_to_comment_id ?? -1;
                            if (main_comment_id != -1 && main_comment_id != 0)
                            {
                                HttpContext.Response.Headers.Add("replies-count",
                                    db_context.Article_comments.Where(c => c.Id == main_comment_id && c.Article_id == article_id)
                                                    .Include(c => c.Replying_comments)
                                                        .FirstOrDefault()?.Replying_comments.Count.ToString() ?? "0");
                            }
                            return Ok(db_context.Article_comments.Where(c => c.Article_id == article_id).Count());
                        }
                        else
                        {
                            return StatusCode(403);
                        }
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
        }
        [HttpPost]
        [Route("build_comments/{comment_id:int}/{article_id:int}")]
        public async Task<IActionResult> Build_replies_comments(int comment_id, int article_id)
        {
            using (db_context)
            {
                Article_comment? comment = await db_context.Article_comments
                    .FirstOrDefaultAsync(c => c.Id == comment_id && c.Article_id == article_id);
                if (comment is not null)
                {
                    await db_context.Entry(comment).Collection(c => c.Replying_comments).LoadAsync();
                    foreach (Article_comment reply_comment in comment.Replying_comments)
                    {
                        await db_context.Entry(reply_comment).Reference(c => c.Author).LoadAsync();
                        await db_context.Entry(reply_comment).Collection(c => c.Replying_comments).LoadAsync();
                        await db_context.Entry(reply_comment).Collection(c => c.Users_who_liked).LoadAsync();
                        await db_context.Entry(reply_comment).Collection(c => c.Users_who_disliked).LoadAsync();
                    }

                    ViewData["Main_comment"] = comment;
                    HttpContext.Response.Headers.Add("replies-count", comment.Replying_comments.Count.ToString());

                    List<Article_comment> comments = comment.Replying_comments.OrderBy(c => c.Users_who_liked.Count - c.Users_who_disliked.Count).ThenByDescending(c => c.Created).ThenBy(c => c.Id).Take(10).ToList();
                    if (comment.Replying_comments.Count > 10)
                        ViewData["last-comment-id"] = comment.Replying_comments[10].Id;
                    return View("/Views/Comments/Comments_builder.cshtml", comments);
                }
                else
                {
                    return NotFound();
                }
            }
        }
        [HttpPost]
        [Route("reaction/{comment_id:int}/{article_id:int}")]
        public IActionResult Reaction_to_comment(int comment_id, int article_id, string reaction_type)
        {
            if (reaction_type != "like" && reaction_type != "dislike")
            {
                return BadRequest();
            }
            lock (for_lock)
            {
                using (db_context)
                {
                    Article_comment? comment = db_context.Article_comments
                        .Where(c => c.Id == comment_id && c.Article_id == article_id)
                            .Include(c => c.Users_who_liked).Include(c => c.Users_who_disliked)
                                .FirstOrDefault();
                    if (comment is not null)
                    {
                        (string, Article_comment) reaction_result = ((string, Article_comment))Reaction_controller.Set_like_or_dislike(db_context, User, HttpContext, comment, reaction_type);
                        return reaction_result.Item1 switch
                        {
                            "a" or "c" or "r" => Reaction_result_return(comment, reaction_result.Item1, db_context),
                            "NotFound" => NotFound(),
                            _ => BadRequest(),
                        };
                    }
                    return NotFound();
                }
            }
        }
        [NonAction]
        private IActionResult Reaction_result_return(Article_comment comment, string reaction_result, Database_context db_context)
        {
            switch(reaction_result)
            {
                case "a" or "r" or "c":
                    db_context.Article_comments.Update(comment);
                    db_context.SaveChanges();
                    return Content(reaction_result);
                case "n":
                    return NotFound();
                default:
                    return BadRequest();

            }                
        }
    }
}
