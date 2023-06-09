﻿using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using Dublongold_site.Generated_regexs;
using System.Linq;

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
        public static async Task Load_element_data<TLoad_object>(Database_context db_context, TLoad_object element) where TLoad_object:ISort_object
        {
            if (element is Article)
            {
                var temp_article = await db_context.Articles.Where(art => art.Id == element.Id)
                    .Include(art => art.Authors)
                    .Include(art => art.Users_who_react)
                    .Include(art => art.Users_who_have_read)
                    .Include(art => art.Comments).FirstOrDefaultAsync();
            }
            else if (element is Article_comment comment)
            {
                var temp_comment = await db_context.Article_comments
                    .Where(c => c.Id == comment.Id && c.Article_id == comment.Article_id)
                    .Include(c => c.Author)
                    .Include(c => c.Users_who_react)
                    .Include(c => c.Replying_comments).FirstOrDefaultAsync();
            }
        }
        public static async Task Load_sequence_data<TLoad_object>(Database_context db_context, IEnumerable<TLoad_object> elements) where TLoad_object:ISort_object
        {
            foreach (TLoad_object element in elements)
            {
                await Load_element_data(db_context, element);
            }
        }
        /// <summary>
        /// Виконує сортування та довантеження даних статтей/коментарів.<br/>
        /// Приймає в параметрах контекст бази даних; послідовність статтей або коментарів; рядок, який вказує на спосіб сортування.<br/>
        /// </summary>
        /// <param name="db_context">Контекст бази даних.</param>
        /// <param name="elements_sequence">Послідовність статей/коментарів.</param>
        /// <param name="sort_by">Спосіб сортування. "date" або "rating"</param>
        /// <returns>Відсортований список статей/коментарів, в якому довантажені потрібні елементи.<br/>Якщо передана послідовність елементів не є статтями/коментарями, то повертає її без будь-яких дій</returns>
        public static async Task<List<TLoad_sort_object>> Get_elements_with_load_and_sort<TLoad_sort_object>(Database_context db_context, IEnumerable<TLoad_sort_object> elements_sequence, IHeaderDictionary headers, string? sort_by = null, int[]? last_elements_id = null) where TLoad_sort_object : ISort_object
        {
            if (elements_sequence is IEnumerable<Article> || elements_sequence is IEnumerable<Article_comment>)
            {
                elements_sequence = Sort_sequence_by.Sort_by(db_context, elements_sequence, sort_by);
                if (last_elements_id is not null && last_elements_id.Length > 0 && elements_sequence.Count() - last_elements_id.Length > 0)
                {
                    elements_sequence = elements_sequence.SkipWhile(elem => !last_elements_id.Contains(elem.Id));
                    if (elements_sequence.Count() > last_elements_id.Length)
                    {
                        elements_sequence = elements_sequence.SkipWhile(elem => last_elements_id.Contains(elem.Id));
                    }
                    if (!elements_sequence.Any())
                    {
                        return new();
                    }
                }
                if (elements_sequence.Count() > 10)
                    headers.Add("need-load-more", "1");

                elements_sequence = elements_sequence.Take(10);
                await Load_sequence_data(db_context, elements_sequence);
            }
            return elements_sequence.ToList();
        }
    }
}
