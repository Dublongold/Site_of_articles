using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using Dublongold_site.Generated_regexs;

namespace Dublongold_site.Useful_classes
{
    public class Helper_for_work_with_articles
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
        public static async Task Load_data(Database_context db_context, Article article)
        {
            var temp_article = await db_context.Articles.Where(art => art.Id == article.Id)
                .Include(art => art.Authors)
                .Include(art => art.Users_who_liked)
                .Include(art => art.Users_who_disliked)
                .Include(art => art.Users_who_have_read)
                .Include(art => art.Comments).FirstOrDefaultAsync();
        }
        public static async Task Load_sequence_data(Database_context db_context, IEnumerable<Article> articles)
        {
            foreach (Article article in articles)
            {
                await Load_data(db_context, article);
            }
        }
        /// <summary>
        /// Виконує сортування та довантеження даних статтей.<br/>
        /// Приймає в параметрах контекст бази даних; послідовність статей; рядок, який вказує на спосіб сортування.
        /// </summary>
        /// <param name="db_context">Контекст бази даних. Якщо що, має виконувати Dispose самотушки.</param>
        /// <param name="articles_sequence">Послідовність статей.</param>
        /// <param name="sort_by">Спосіб сортування. Може бути або "date", або "rating"</param>
        /// <returns>Відсортований список статей, в якому довантажені потрібні елементи.</returns>
        public static async Task<List<Article>> Get_article_with_load_and_sort(Database_context db_context, IEnumerable<Article> articles_sequence, string? sort_by, int last_article_id = -1)
        {
            articles_sequence = Sort_sequence_by.Sort_by(db_context, articles_sequence, sort_by);
            if (last_article_id != -1)
            {
                articles_sequence = articles_sequence.SkipWhile(art => art.Id != last_article_id);
            }
            articles_sequence = articles_sequence.Take(11);
            await Load_sequence_data(db_context, articles_sequence);
            return articles_sequence.ToList();
        }
    }
}
