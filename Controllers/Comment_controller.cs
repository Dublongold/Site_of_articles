using Dublongold_site.Filters;
using Dublongold_site.Hubs;
using Dublongold_site.Models;
using Dublongold_site.Useful_classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Dublongold_site.Controllers
{
    [Route("comment")]
    public class Comment_control:Controller
    {
        private readonly Database_context db_context;
        private readonly IHubContext<Actions_with_comments_hub> actions_with_comments_hub;
        private static object for_lock = new();
        public Comment_control(Database_context new_db_context, IHubContext<Actions_with_comments_hub> new_actions_with_comments_hub)
        {
            db_context = new_db_context;
            actions_with_comments_hub = new_actions_with_comments_hub;
        }
        [HttpGet]
        [Route("sort_by/{article_id:int}")]
        public async Task<IActionResult> Sort_comments_by(int article_id)
        {
            using (db_context)
            {
                string? sort_by = Request.Headers["sort-by"];
                Article? article = await db_context.Articles.Where(art => art.Id == article_id).Include(art => art.Comments).FirstOrDefaultAsync();

                if (article is not null)
                {
                    return View("Comments_builder", await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, article.Comments.Where(c => c.Reply_to_comment_id == null), Response.Headers, sort_by));
                }
                else
                {
                    return NotFound();
                }
            }
        }
        [HttpGet]
        [Route("load_more")]
        public async Task<IActionResult> Load_more_comments(string comment_ids_str, int article_id)
        {
            using (db_context)
            {
                int[]? comment_ids = null;
                int k = 0;
                string[] comment_ids_array = comment_ids_str.Split(",");
                if (comment_ids_array.Length > 0)
                {
                    comment_ids = new int[comment_ids_array.Length <= 10 ? comment_ids_array.Length : 10];
                    foreach (string comment_id_str in comment_ids_array)
                    {
                        if (!int.TryParse(comment_id_str, out comment_ids[k]))
                        {
                            comment_ids[k] = 0;
                        }
                        k++;
                    }
                }
                string? sort_by = Request.Headers["sort-by"];
                if (comment_ids is not null)
                {
                    Article_comment? first_comment;
                    if (comment_ids.Length > 0)
                        first_comment = await db_context.Article_comments.Where(c => c.Article_id == article_id && c.Id == comment_ids[0]).Include(c => c.Reply_to_comment).FirstOrDefaultAsync();
                    else
                        first_comment = await db_context.Article_comments.FirstOrDefaultAsync();
                    List<Article_comment> result;
                    if (first_comment is not null && first_comment.Reply_to_comment is Article_comment main_comment)
                    {
                        ViewData["Main_comment"] = main_comment;
                        await db_context.Entry(main_comment).Collection(c => c.Replying_comments).LoadAsync();
                        Console.WriteLine(main_comment.Replying_comments.Count);
                        result = await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, main_comment.Replying_comments, Response.Headers, sort_by, comment_ids);
                        Console.WriteLine(result.Count);
                    }
                    else
                    {
                        Article? article = await db_context.Articles.Where(art => art.Id == article_id)
                                    .Include(c => c.Comments).FirstOrDefaultAsync();
                        if (article is not null)
                        {
                            result = await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, article.Comments.Where(c => c.Reply_to_comment is null), Response.Headers, sort_by, comment_ids);
                        }
                        else
                            return NotFound();
                    }
                    return View(result);
                }
                else
                    return BadRequest();
            }
        }
        [HttpPost]
        [Route("create/{article_id:int}")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Create_comment(int article_id, string comment_content, int reply_level, int comment_id)
        {
            bool write_non_reply_comment = false;
            Article_comment comment;
            lock (for_lock)
            {
                using (db_context)
                {
                    int free_comment_id = Find_free_id_of_comments.Get_free_id(db_context.Article_comments.Where(c => c.Article_id == article_id).Select(c => c.Id).ToList());
                    comment = new()
                    {
                        Id = free_comment_id,
                        Article_id = article_id,
                        Content = comment_content,
                        Author = db_context.User_accounts.First(u => u.Login == User.Identity!.Name),
                        Reply_level = reply_level
                    };
                    if (reply_level > 0)
                    {
                        int replies_count = db_context.Article_comments.Where(c => c.Id == comment_id && c.Article_id == article_id).Include(c => c.Replying_comments).FirstOrDefault()?.Replying_comments.Count ?? 0;
                        HttpContext.Response.Headers.Add("replies-count", (replies_count + 1).ToString());
                        comment.Reply_to_comment_id = comment_id;
                        comment.Reply_to_comment_id_of_article = article_id;
                    }
                    else
                    {
                        write_non_reply_comment = true;
                        HttpContext.Response.Headers.Add("comment-id", free_comment_id.ToString());
                    }
                    HttpContext.Response.Headers.Add("reply_level", reply_level.ToString());
                    db_context.Add(comment);
                    db_context.SaveChanges();
                    comment = db_context.Article_comments.First(c => c.Id == free_comment_id && c.Article_id == article_id);
                    HttpContext.Response.Headers.Add("reply-comment-id", free_comment_id.ToString());
                    db_context.Entry(comment).Reference(c => c.Author).Load();
                    db_context.Entry(comment).Reference(c => c.Reply_to_comment).Load();
                }
            }
            if (write_non_reply_comment)
            {
                await actions_with_comments_hub.Clients.Group("Read article " + article_id.ToString()).SendAsync("Comment writed");
            }
            return View("/Views/Comment_control/Comment_builder.cshtml", comment);
        }
        [HttpPut]
        [Route("edit/{comment_id:int}/{article_id:int}")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Edit_comment(int comment_id, int article_id, string new_content)
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
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
            await actions_with_comments_hub.Clients.Group("Read article " + article_id.ToString()).SendAsync("Comment edited", comment_id, new_content);
            return Ok();
        }
        [HttpDelete]
        [Route("delete/{comment_id:int}/{article_id:int}")]
        [Authenticated_user_filter]
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
                            actions_with_comments_hub.Clients.Group("Read article " + article_id.ToString()).SendAsync("Comment deleted", comment_id);
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
        public async Task<IActionResult> Comments_builder(int comment_id, int article_id)
        {
            string? sort_by = Request.Headers["sort-by"];
            using (db_context)
            {
                Article_comment? comment = await db_context.Article_comments
                    .FirstOrDefaultAsync(c => c.Id == comment_id && c.Article_id == article_id);
                if (comment is not null)
                {
                    await db_context.Entry(comment).Collection(c => c.Replying_comments).LoadAsync();

                    ViewData["Main_comment"] = comment;
                    HttpContext.Response.Headers.Add("replies-count", comment.Replying_comments.Count.ToString());
                    return View(await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, comment.Replying_comments, Response.Headers, sort_by));
                }
                else
                {
                    return NotFound();
                }
            }
        }
        [HttpPost]
        [Route("reaction/{comment_id:int}/{article_id:int}")]
        [Authenticated_user_filter]
        public IActionResult Reaction_to_comment(int comment_id, int article_id, int reaction_type)
        {
            if (reaction_type != 1 && reaction_type != 2)
            {
                return BadRequest();
            }
            lock (for_lock)
            {
                using (db_context)
                {
                    Article_comment? comment = db_context.Article_comments
                        .Where(c => c.Id == comment_id && c.Article_id == article_id)
                            .Include(c => c.Users_who_react)
                                .FirstOrDefault();
                    if (comment is not null)
                    {
                        (string, Article_comment) reaction_result = ((string, Article_comment))Reaction_controller.Set_like_or_dislike(db_context, User, HttpContext, comment, reaction_type);
                        return reaction_result.Item1 switch
                        {
                            "a" or "c" or "r" => Reaction_result_return(reaction_result.Item2, reaction_result.Item1, db_context),
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
