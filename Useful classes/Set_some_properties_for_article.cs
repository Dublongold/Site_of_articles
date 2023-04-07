using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using Dublongold_site.Generated_regexs;
namespace Dublongold_site.Useful_classes
{
    public class Set_some_properties_for_article
    {
        public static async Task<List<string>> Set_async(Article article, Database_context db_context, System.Security.Claims.ClaimsPrincipal User, string co_authors)
        {
            List<string> errors_list = new();
            if (co_authors is not null && co_authors.Replace(" ", "").Length > 0)
            {
                article.Authors = new() { await db_context.User_accounts.FirstAsync(u => u.Login == User.Identity!.Name) };
                string[] authors_list = co_authors.Replace(" ", "").Split(",");
                foreach (string author_name in authors_list)
                {
                    if (db_context.User_accounts.Any(u => u.Login == author_name) && article.Authors.Any(u => u.Login != author_name))
                        article.Authors.Add(await db_context.User_accounts.FirstAsync(u => u.Login == author_name));
                }
                if (article.Authors.Count == 0)
                    errors_list.Add("Please, enter the correct logins of the co_authors.");
            }
            else
                article.Authors = new() { await db_context.User_accounts.FirstAsync(u => u.Login == User.Identity!.Name) };
            End_set(errors_list, article);
            return errors_list;
        }
        public static List<string> Set(Article article, Database_context db_context, System.Security.Claims.ClaimsPrincipal User, string co_authors)
        {
            List<string> errors_list = new();
            if (co_authors is not null && co_authors.Replace(" ", "").Length > 0)
            {
                article.Authors = new() { db_context.User_accounts.First(u => u.Login == User.Identity!.Name) };
                string[] authors_list = co_authors.Replace(" ", "").Split(",");
                foreach (string author_name in authors_list)
                {
                    if (db_context.User_accounts.Any(u => u.Login == author_name) && article.Authors.Any(u => u.Login != author_name))
                        article.Authors.Add(db_context.User_accounts.First(u => u.Login == author_name));
                }
                if (article.Authors.Count == 0)
                    errors_list.Add("Please, enter the correct logins of the co_authors.");
            }
            else
                article.Authors = new() { db_context.User_accounts.First(u => u.Login == User.Identity!.Name) };
            End_set(errors_list, article);
            return errors_list;
        }
        private static void End_set(List<string> errors_list, Article article)
        {
            if (string.IsNullOrEmpty(article.Description))
            {
                if (article.Content is not null)
                {
                    string article_content_replaced = Collection_of_generated_regexs.Find_img().Replace(article.Content, "(зображення)");
                    article.Description  = article_content_replaced.Length > 99?article_content_replaced[..97] + "...":article_content_replaced;
                }
                else
                    article.Description = "";
                if (article.Content?.StartsWith(article.Description) ?? false)
                {
                    if (article.Content != article.Description) 
                        article.Description += "...";
                }
            }
            if (string.IsNullOrEmpty(article.Tags))
                article.Tags = "";
            else
            {
                foreach (char symbol in article.Tags)
                {
                    if (!(char.IsLetter(symbol) || char.IsNumber(symbol) || symbol == '_' || symbol == ','))
                    {
                        errors_list.Add("Please, enter the correct a tags of article.");
                        break;
                    }
                }
            }
        }
    }
}
