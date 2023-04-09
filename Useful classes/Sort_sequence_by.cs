using Dublongold_site.Models;

namespace Dublongold_site.Useful_classes
{
    public class Sort_sequence_by
    {
        public static IEnumerable<ISort_object> Sort_by(IEnumerable<ISort_object> list_for_sort, string? sort_by)
        {
            return sort_by switch
            {
                "date" => list_for_sort.OrderBy(li => li.Created),
                "rating" => list_for_sort.OrderBy(li => li.Users_who_liked.Count - li.Users_who_disliked.Count()).ThenBy(li => li.Created),
                _ => list_for_sort.OrderBy(li => li.Created)
            };
        }
        public static IEnumerable<Article> Sort_article_by(IEnumerable<Article> list_for_sort, string? sort_by)
        {
            return Sort_by(list_for_sort, sort_by) as IEnumerable<Article> ?? list_for_sort.OrderBy(art => art.Created);
        }
        public static IEnumerable<Article_comment> Sort_comment_by(IEnumerable<Article_comment> list_for_sort, string? sort_by)
        {
            return Sort_by(list_for_sort, sort_by) as IEnumerable<Article_comment> ?? list_for_sort.OrderBy(art => art.Created);
        }
    }
    public interface ISort_object : ICan_like_and_dislike
    {
        public DateTime Created { get; init; }
    }
}
