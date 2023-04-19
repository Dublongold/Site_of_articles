using Dublongold_site.Generated_regexs;
using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace Dublongold_site.Useful_classes
{
    public class Find_action
    {
        public static async Task<List<Article>> Find(Database_context db_context, ViewDataDictionary ViewData, HttpContext HttpContext, string? name_or_text_of_article, string? sort_by, int[]? article_ids = null)
        {
            name_or_text_of_article ??= "";

            if (name_or_text_of_article == "")
                return new();

            ViewData["Find_text"] = name_or_text_of_article;
            name_or_text_of_article = name_or_text_of_article.ToLower();
            string[] name_or_text_of_article_sequence = Get_search_text_sequence(name_or_text_of_article);

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
                    a => (find_theme && a.Theme.ToLower().Contains(name_or_text_of_article_sequence))
                        || (find_tags && a.Tags.ToLower().Contains(name_or_text_of_article_sequence))
                        || (find_description && a.Content.ToLower().Contains(name_or_text_of_article_sequence))
                        || (find_content && a.Description.ToLower().Contains(name_or_text_of_article_sequence))
                        || (find_authors && a.Authors.Count > 0 && a.Authors
                            .Select(u => $"{u.Name} {u.Surname} {u.Login}")
                            .Aggregate((u1, u2) => u1 + " " + u2)
                            .ToLower()
                            .Contains(name_or_text_of_article_sequence)
                        )
                        || (find_id && a.Id.ToString().ToLower().Contains(name_or_text_of_article)) );
                List<Article> result = await Helper_for_work_with_articles.Get_elements_with_load_and_sort(db_context, article_sequence, HttpContext.Response.Headers, sort_by, article_ids);

                return result;
            }
        }
        public static string[] Get_search_text_sequence(string search_text)
        {
            List<string> search_text_in_quotes = Collection_of_generated_regexs.Find_text_in_quotes().Matches(search_text).Select(s => s.Groups[1].Value).ToList();
            string temp_srt = search_text;
            foreach(string temp_stiq in search_text_in_quotes)
            {
                temp_srt = temp_srt.Replace(temp_stiq, "");
            }
            search_text_in_quotes.AddRange(Collection_of_generated_regexs.Find_request_format().Replace(temp_srt, ",").Split(",").Where(x => !string.IsNullOrEmpty(x)));
            return search_text_in_quotes.ToArray();
        }
    }
    public static class Extend_string
    {
        public static bool Contains(this string str, string[] sequence)
        {
            foreach (string temp_str in sequence)
            {
                if (!string.IsNullOrEmpty(temp_str) && str.Contains(temp_str))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
