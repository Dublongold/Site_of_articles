using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Dublongold_site.Useful_classes
{
    public class Sort_sequence_by
    {
        public static IEnumerable<TSort_object> Sort_by<TSort_object>(Database_context db_context, IEnumerable<TSort_object> list_for_sort, string? sort_by) where TSort_object:ISort_object
        {
            List<Object_for_sort> objs_for_sort;
            if (list_for_sort is IEnumerable<Article>)
                objs_for_sort = db_context.Articles.Select(
                    art => new Object_for_sort(
                        art.Id,
                        art.Id,
                        art.Created,
                        art.Users_who_react.Where(ur => ur.Reaction_type == 1).Count(),
                        art.Users_who_react.Where(ur => ur.Reaction_type == 2).Count()))
                    .ToList();
            else if (list_for_sort is IEnumerable<Article_comment>)
                objs_for_sort = db_context.Article_comments.Select(
                    c => new Object_for_sort(
                        c.Id,
                        c.Article_id,
                        c.Created,
                        c.Users_who_react.Where(ur => ur.Reaction_type == 1).Count(),
                        c.Users_who_react.Where(ur => ur.Reaction_type == 2).Count()))
                    .ToList();
            else
                return list_for_sort;
            objs_for_sort = sort_by switch
            {
                
                "rating" => objs_for_sort.OrderByDescending(li => li.Users_who_liked_count - li.Users_who_disliked_count).ThenBy(li => li.Created).ToList(),
                "date" or _ => objs_for_sort.OrderBy(li => li.Created).ToList()
            };
            IEnumerable<TSort_object> sorted_list;
            if (list_for_sort is IEnumerable<Article>)
                sorted_list = list_for_sort.OrderBy(li => objs_for_sort.FindIndex(obj => obj.Id == li.Id));
            else if (list_for_sort is IEnumerable<Article_comment> comments_for_sort)
                sorted_list = (comments_for_sort.OrderBy(li => objs_for_sort.FindIndex(obj => obj.Id == li.Id && obj.Article_id == li.Article_id)) as IEnumerable<TSort_object>)!;
            else
                return list_for_sort;

            return sorted_list;
        }
    }
    public struct Object_for_sort
    {
        public int Id { get; set; }
        public int Article_id { get; set; }
        public DateTime Created { get; set; }
        public int Users_who_liked_count { get; set; }
        public int Users_who_disliked_count { get; set; }
        public Object_for_sort(int id, int article_id, DateTime created, int users_who_liked_count, int users_who_disliked_count)
        {
            Id = id;
            Article_id = article_id;
            Created = created;
            Users_who_liked_count = users_who_liked_count;
            Users_who_disliked_count = users_who_disliked_count;
        }
    }

}
