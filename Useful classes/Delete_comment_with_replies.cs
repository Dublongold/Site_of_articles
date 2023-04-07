using Dublongold_site.Models;

namespace Dublongold_site.Useful_classes
{
    public class Delete_comment_with_replies
    {
        /// <summary>
        /// Видаляє коментар та відповіді на нього.
        /// Метод виконує всередині наступні дії:
        /// <list type="table">
        /// <item>
        /// - перевіряє порожність коментаря, який передається в параметрах(якщо порожній, то метод нічого не робить);
        /// </item>
        /// <item>
        /// - завантажує коментарі-відповіді і, за їх наявності, викликає цю ж функцію, передаючи в параметрах коментар-відповідь та контекст бази даних;
        /// </item>
        /// <item>
        /// - видаляє коментар, якщо він не порожній.
        /// </item>
        /// </list>
        /// </summary>
        /// <param name="main_comment">Коментар, який потрібно видалити разом з, якщо є, відповідями на нього.</param>
        /// <param name="db_context">Контекст бази даних, який буде викорисовуватися при видалені коментаря та, якщо є, відповідей на нього з бази даних.</param>
        public static async Task Delete_async(Article_comment? main_comment, Database_context db_context)
        {
            if (main_comment is not null)
            {
                db_context.Entry(main_comment).Collection(c => c.Replying_comments).Load();
                if (main_comment.Replying_comments.Count > 0)
                {
                    foreach (Article_comment? comment in main_comment.Replying_comments)
                    {
                        await Delete_async(comment, db_context);
                    }
                }
                db_context.Article_comments.Remove(main_comment);
            }
        }
        public static void Delete(Article_comment? main_comment, Database_context db_context)
        {
            if (main_comment is not null)
            {
                db_context.Entry(main_comment).Collection(c => c.Replying_comments).Load();
                if (main_comment.Replying_comments.Count > 0)
                {
                    foreach (Article_comment? comment in main_comment.Replying_comments)
                    {
                        Delete(comment, db_context);
                    }
                }
                db_context.Article_comments.Remove(main_comment);
            }
        }
        public static void Delete(Database_context db_context, Article_comment? main_comment)
        {
            Delete(main_comment, db_context);
        }
        /// <summary>
        /// Видаляє коментар та відповіді на нього. Це перевантаження є простим викликом одноіменного методу, у якому порядок параметрів інший.
        /// Метод виконує всередині наступні дії:
        /// <list type="table">
        /// <item>
        /// - перевіряє порожність коментаря, який передається в параметрах(якщо порожній, то метод нічого не робить);
        /// </item>
        /// <item>
        /// - завантажує коментарі-відповіді і, за їх наявності, викликає цю ж функцію, передаючи в параметрах коментар-відповідь та контекст бази даних;
        /// </item>
        /// <item>
        /// - видаляє коментар, якщо він не порожній.
        /// </item>
        /// </list>
        /// </summary>
        /// <param name="main_comment">Коментар, який потрібно видалити разом з, якщо є, відповідями на нього.</param>
        /// <param name="db_context">Контекст бази даних, який буде викорисовуватися при видалені коментаря та, якщо є, відповідей на нього з бази даних.</param>
        public static async Task Delete_async(Database_context db_context, Article_comment? main_comment)
        {
            await Delete_async(main_comment, db_context);
        }
    }
}
