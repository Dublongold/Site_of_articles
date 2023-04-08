using Microsoft.EntityFrameworkCore;
using Dublongold_site.Models;
using Microsoft.AspNetCore.Mvc;
using Dublongold_site.Filters;
using System.Collections.Specialized;
using Dublongold_site.Useful_classes;

namespace Dublongold_site.Controllers
{
    [Route("")]
    [Route("Main")]
    [Session_resources_filter]
    [Authenticated_deleted_user_filter]
    public class Main_control : Controller
    {
        private readonly Database_context db_context;

        public Main_control(Database_context new_db_context)
        {
            db_context = new_db_context;
        }

        [Route("test")]
        public IActionResult Test()
        {
            return PhysicalFile("Views/Shared/html.html", "text/html");
        }

        [Route("")]
        [Route("home")]
        public IActionResult Home()
        {
            using (db_context)
            {
                string? sort_by = Request.Headers["sort-by"];
                IQueryable<Article> articles_sequence = db_context.Articles.Include(art => art.Authors)
                                                .Include(art => art.Users_who_liked).Include(art => art.Users_who_disliked)
                                                .OrderBy(art => art.Users_who_liked.Count - art.Users_who_disliked.Count)
                                                .ThenBy(art => art.Created).ThenBy(art => art.Id)
                                                .Include(art => art.Users_who_have_read)
                                                .Include(art => art.Comments);
                List<Article> articles = Sort_sequence_by.Sort_article_by(articles_sequence, sort_by).Take(11).ToList();

                if (articles.Count > 10)
                    ViewData["last-article-id"] = articles.Last().Id;
                return View("Home", articles.Take(10).ToList());
            }
        }
        [HttpGet]
        [Route("find")]
        public async Task<IActionResult> Find(string name_or_text_of_article)
        {
            string? sort_by = Request.Headers["sort-by"];
            name_or_text_of_article ??= "";

            if(name_or_text_of_article == "")
            {
                return RedirectToAction("Home");
            }

            ViewData["Find_text"] = name_or_text_of_article;

            name_or_text_of_article = name_or_text_of_article.ToLower();
            
            List<bool> session_search_options_to_list = HttpContext.Session
                                                            .GetString("search_options")
                                                            ?.Split(";")
                                                            .Select(s => s.Equals("True") || s.Equals("true")).ToList() ?? new() {true,true,true,true,true,true};
            
            bool find_theme = session_search_options_to_list[0],
                find_tags = session_search_options_to_list[1],
                find_description = session_search_options_to_list[2],
                find_content = session_search_options_to_list[3],
                find_authors = session_search_options_to_list[4],
                find_id = session_search_options_to_list[5];


            using (db_context)
            {
                List<Article> articles = await db_context
                    .Articles
                    .Include(a => a.Authors).ToListAsync();
                IEnumerable<Article> article_sequence = articles.Where(
                    a => (find_theme && a.Theme.ToLower().Contains(name_or_text_of_article))
                    || (find_tags && a.Tags.ToLower().Contains(name_or_text_of_article))
                    || (find_description && a.Content.ToLower().Contains(name_or_text_of_article))
                    || (find_content && a.Description.ToLower().Contains(name_or_text_of_article))
                    || (find_authors && (a.Authors
                        .Select(u => u.Name + " " + u.Surname + " " + u.Login)
                        .Aggregate((u1, u2) => u1 + " " + u2)
                        .ToLower()
                        .Contains(name_or_text_of_article)
                                        )
                        )
                    || (find_id && a.Id.ToString().ToLower().Contains(name_or_text_of_article))
                    );
                articles = Sort_sequence_by.Sort_article_by(article_sequence, sort_by).Take(10).ToList();
                foreach (Article article in articles)
                {
                    db_context.Entry(article).Collection(art => art.Users_who_liked).Load();
                    db_context.Entry(article).Collection(art => art.Users_who_disliked).Load();
                    db_context.Entry(article).Collection(art => art.Users_who_have_read).Load();
                    db_context.Entry(article).Collection(art => art.Comments).Load();
                }
                return View(articles);
            }
        }
        [HttpPost]
        [Route("/find/options/{option_name}")]
        public void Set_option_for_search(string option_name, bool option_value)
        {
            List<string> options_array = new(){ "theme", "tags", "description", "content", "authors", "id"};
            if (options_array.Contains(option_name))
            {
                bool option = option_value;
                List<bool>? session_search_options_to_list = HttpContext.Session.GetString("search_options")?.Split(";").Select(s => s.Equals("True") || s.Equals("true")).ToList();
                if (session_search_options_to_list is not null && session_search_options_to_list.Count == options_array.Count)
                {
                    session_search_options_to_list[options_array.IndexOf(option_name)] = option;
                }
                HttpContext.Session.SetString("search_options", session_search_options_to_list?.Select(x => x.ToString()).Aggregate((x, y) => x + ";" + y) ?? "true;true;true;true;true");
            }
        }
        [Route("error")]
        public IActionResult Error()
        {
            return View();
        }
    }
}
