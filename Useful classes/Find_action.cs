using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Dublongold_site.Useful_classes
{
    public class Find_action
    {
        public static async Task<List<Article>> Find(Database_context db_context, Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary ViewData, HttpContext HttpContext, string? name_or_text_of_article, string? sort_by)
        {
            name_or_text_of_article ??= "";

            if (name_or_text_of_article == "")
                return new();

            ViewData["Find_text"] = name_or_text_of_article;

            name_or_text_of_article = name_or_text_of_article.ToLower();

            List<bool> session_search_options_to_list = HttpContext.Session
                                                            .GetString("search_options")
                                                            ?.Split(";")
                                                            .Select(s => s.Equals("True") || s.Equals("true")).ToList() ?? new() { true, true, true, true, true, true };

            bool find_theme = session_search_options_to_list[0], find_tags = session_search_options_to_list[1],
                find_description = session_search_options_to_list[2], find_content = session_search_options_to_list[3],
                find_authors = session_search_options_to_list[4], find_id = session_search_options_to_list[5];


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
                        || (find_authors && a.Authors.Count > 0 && a.Authors
                            .Select(u => u.Name + " " + u.Surname + " " + u.Login)
                            .Aggregate((u1, u2) => u1 + " " + u2)
                            .ToLower()
                            .Contains(name_or_text_of_article)
                        )
                        || (find_id && a.Id.ToString().ToLower().Contains(name_or_text_of_article)) );
                Console.WriteLine(article_sequence.Count());
                articles = await Helper_for_work_with_articles.Get_article_with_load_and_sort(db_context, article_sequence, sort_by);
                return articles;
            }
        }
    }
}
