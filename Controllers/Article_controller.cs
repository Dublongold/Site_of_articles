using Microsoft.EntityFrameworkCore;
using Dublongold_site.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Dublongold_site.Filters;
using Dublongold_site.Generated_regexs;
using Dublongold_site.Useful_classes;

namespace Dublongold_site.Controllers
{
    [Route("article")]
    [Authenticated_deleted_user_filter]
    public class Article_control : Controller
    {
        private readonly Database_context db_context;
        private object for_lock = new();

        public Article_control(Database_context new_db_context)
        {
            db_context = new_db_context;
        }

        [HttpGet]
        [Route("read/{id:int}")]
        public async Task<IActionResult> Read(int id)
        {
            using (db_context)
            {
                if (!db_context.Articles.Any(art => art.Id == id))
                    return NotFound();
                Article article = await db_context.Articles.Where(art => art.Id == id)
                                                .Include(art => art.Authors)
                                                .Include(art => art.Comments)
                                                .Include(art => art.Users_who_liked)
                                                .Include(art => art.Users_who_disliked)
                                                .Include(art => art.Users_who_have_read)
                                                .FirstAsync();
                article.Comments = await Helper_for_work_with_articles.Get_elements_with_load_and_sort(
                    db_context,
                    article.Comments.Where(c => c.Reply_to_comment_id == null),
                    Response.Headers);
                return View(article);
            }
        }
        [HttpGet]
        [Route("create")]

        [Authenticated_user_filter]
        public IActionResult Create_article()
        {
            return View("Article_editor");
        }
        [HttpPost]
        [Route("create")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Create_article(Article article, string co_authors)
        {
            using(db_context)
            {
                ValidationContext validation_context = new(article);
                List<ValidationResult> validation_results = new();
                if (Validator.TryValidateObject(article, validation_context, validation_results, true))
                {
                    List<string> errors = await Helper_for_work_with_articles.Set_async(article, db_context, User, co_authors);
                    if (errors.Count == 0)
                    {

                        await db_context.Articles.AddAsync(article);
                        await db_context.SaveChangesAsync();
                        return RedirectPermanent($"/article/read/{article.Id}");
                    }
                    else
                    {
                        TempData["create_article_errors"] = errors;
                        return View("Article_editor", model:article);
                    }
                }
                else
                {
                    TempData["create_article_errors"] = validation_results.Select(vr => vr.ErrorMessage).ToList();
                    return View("Article_editor", model: article);
                }
            }
        }
        [HttpPost]
        [Route("preview")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Create_preview_article(Article article, string co_authors)
        {
            using (db_context)
            {
                ValidationContext validation_context = new(article);
                List<ValidationResult> validation_results = new();
                if (Validator.TryValidateObject(article, validation_context, validation_results, true))
                {
                    List<string> errors = await Helper_for_work_with_articles.Set_async(article, db_context, User, co_authors);
                    if (errors.Count == 0)
                    {
                        TempData["without_comments"] = true;
                        return View("Read", article);
                    }
                    else
                    {
                        TempData["create_article_errors"] = errors;
                        return View("Article_editor", article);
                    }
                }
                else
                {
                    TempData["create_article_errors"] = validation_results.Select(vr => vr.ErrorMessage).ToList();
                    return View("Article_editor", article);
                }
            }
        }
        [HttpGet]
        [Route("edit/{id:int}")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Edit(int id)
        {
            using (db_context)
            {
                ViewData["edit-article"] = true;
                return View("Article_editor", model:await db_context.Articles
                                            .Where(art => art.Id == id)
                                            .Include(art => art.Authors).FirstOrDefaultAsync());
            }
        }
        [HttpPost]
        [Route("edit/{id:int}")]
        [Authenticated_user_filter]
        public IActionResult Edit(Article article, string co_authors, int id)
        {
            lock (for_lock)
            {
                using (db_context)
                {
                    ValidationContext validation_context = new(article);
                    List<ValidationResult> validation_results = new();
                    if (Validator.TryValidateObject(article, validation_context, validation_results, true))
                    {
                        List<string> errors = Helper_for_work_with_articles.Set(article, db_context, User, co_authors);
                        if (errors.Count == 0)
                        {
                            Article? old_article = db_context.Articles.FirstOrDefault(art => art.Id == id);
                            if (old_article is not null)
                            {
                                old_article.Title_image = article.Title_image;
                                old_article.Theme = article.Theme;
                                old_article.Tags = article.Tags;
                                old_article.Description = article.Description;
                                old_article.Content = article.Content;
                                db_context.Articles.FromSqlInterpolated($"delete from site_of_articles.\"article-authors\" where ArticlesId = {old_article.Id}");
                                old_article.Content = article.Content;
                                db_context.Articles.Update(old_article);
                                db_context.SaveChanges();
                                ViewData["edit-article"] = true;
                                return View("Read", article);
                            }
                            (TempData["create_article_errors"] as List<string>)?.Add("Стаття не знайдена. Можливо, її видалили.");
                            return View("Article_editor", article);
                        }
                        else
                        {
                            TempData["create_article_errors"] = errors;
                            return View("Article_editor", article);
                        }
                    }
                    else
                    {
                        TempData["create_article_errors"] = validation_results.Select(vr => vr.ErrorMessage).ToList();
                        return View("Article_editor", article);
                    }
                }
            }
        }
        [HttpPost]
        [Route("delete/{id:int}")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Delete(int id)
        {
            using (db_context)
            {
                Article? article = await db_context.Articles.FirstOrDefaultAsync(art => art.Id == id);
                if (article is not null)
                {
                    await db_context.Entry(article).Collection(art => art.Comments).LoadAsync();
                    foreach (Article_comment comment in article.Comments)
                        await Delete_comment_with_replies.Delete_async(db_context, comment);
                    db_context.Articles.Remove(article);
                    await db_context.SaveChangesAsync();
                    return Ok();
                }
                else
                    return NotFound();
            }
        }
        [HttpPost]
        [Route("has_been_read/{id:int}")]
        [Authenticated_user_filter]
        public IActionResult Article_has_been_read(int id)
        {
            lock (for_lock)
            {
                using (db_context)
                {
                    Article? article = db_context.Articles.Where(art => art.Id == id).Include(art => art.Users_who_have_read).FirstOrDefault();
                    User_account? user_account = db_context.User_accounts.FirstOrDefault(u => u.Login == User.Identity!.Name);
                    if (article is not null && user_account is not null && article.Users_who_have_read.All(u => u.Login != user_account.Login))
                    {
                        article.Users_who_have_read.Add(user_account);
                        db_context.Articles.Update(article);
                        db_context.SaveChanges();
                        return Ok(article.Users_who_have_read.Count);
                    }
                    return NotFound();
                }
            }
        }
        [HttpGet]
        [Route("load_more/{where_load}/{name_or_text_of_article?}")]
        public async Task<IActionResult> Load_more_articles(string article_ids_str, string where_load, string? name_or_text_of_article)
        {
            using (db_context)
            {

                int[]? article_ids = null;
                int k = 0;
                string[] article_ids_array = article_ids_str.Split(",");
                if (article_ids_array.Length > 0)
                {
                    article_ids = new int[article_ids_array.Length <= 10 ? article_ids_array.Length : 10];
                    foreach (string article_id_str in article_ids_array)
                    {
                        if (!int.TryParse(article_id_str, out article_ids[k]))
                        {
                            article_ids[k] = 0;
                        }
                        k++;
                    }
                }
                string? sort_by = Request.Headers["sort-by"];
                if (article_ids is not null)
                {
                    if (article_ids.Length > 0 && db_context.Articles.Count() - article_ids.Length > 0)
                    {
                        where_load = where_load.ToLower();
                        List<Article> result;
                        if (where_load == "home" || where_load == "user" || where_load == "profile" || where_load == "")
                        {
                            result = await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, db_context.Articles, Response.Headers, sort_by, article_ids);
                        }
                        else
                        {
                            result = await Find_action.Find(db_context, ViewData, HttpContext, name_or_text_of_article, sort_by, article_ids);
                        }
                        return View(result);
                    }
                    else
                    {
                        return NotFound();
                    }
                }
                else
                    return BadRequest();
            }
        }
        [HttpGet]
        [Route("sort_by/{where_sort?}/{name_or_text_of_article?}")]
        public IActionResult Sort_articles_by(string? where_sort, string? name_or_text_of_article)
        {
            using (db_context)
            {
                if(where_sort is not null)
                    where_sort = Uri.UnescapeDataString(where_sort);
                if (string.IsNullOrEmpty(where_sort) || where_sort == "home")
                    return RedirectToAction("Home", "Main_control");
                else if (where_sort.ToLower() == "account/articles")
                    return RedirectToAction("Articles", "Account_control");
                else if (where_sort.ToLower() == "find")
                    return RedirectToAction("Find", "Main_control", new{name_or_text_of_article});
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("reaction/{article_id:int}")]
        [Authenticated_user_filter]
        public IActionResult Reaction_to_article(int article_id, string reaction_type)
        {
            if (reaction_type != "like" && reaction_type != "dislike")
            {
                return BadRequest();
            }
            lock (for_lock)
            {
                using (db_context)
                {
                    Article? article = db_context.Articles
                        .Where(c => c.Id == article_id)
                            .Include(c => c.Users_who_liked).Include(c => c.Users_who_disliked)
                                .FirstOrDefault();
                    if (article is not null)
                    {
                        (string, Article) reaction_result = ((string, Article))Reaction_controller.Set_like_or_dislike(db_context, User, HttpContext, article, reaction_type);
                        return reaction_result.Item1 switch
                        {
                            "a" or "c" or "r" => Reaction_result_return(article, reaction_result.Item1, db_context),
                            "NotFound" => NotFound(),
                            _ => BadRequest(),
                        };
                    }
                    return NotFound();
                }
            }
        }
        [NonAction]
        private IActionResult Reaction_result_return(Article article, string reaction_result, Database_context db_context)
        {
            switch (reaction_result)
            {
                case "a" or "r" or "c":
                    db_context.Articles.Update(article);
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
