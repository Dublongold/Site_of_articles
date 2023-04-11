using Dublongold_site.Models;
using Microsoft.AspNetCore.Mvc;
using Dublongold_site.Filters;
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

        [Route("")]
        [Route("home")]
        public async Task<IActionResult> Home()
        {
            using (db_context)
            {
                string? sort_by = Request.Headers["sort-by"];

                List<Article> articles = await Helper_for_work_with_articles.Get_article_with_load_and_sort(db_context, db_context.Articles.AsEnumerable(), sort_by);

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
            List<Article>? articles = await Find_action.Find(db_context, ViewData, HttpContext, name_or_text_of_article, sort_by);

            if (articles.Count > 10)
                ViewData["last-article-id"] = articles.Last().Id;

            return View(articles.Take(10).ToList());
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
