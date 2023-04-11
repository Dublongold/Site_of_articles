using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Dublongold_site.Useful_classes
{
    public class Sort_sequence_by
    {
        public static IEnumerable<TSort_object> Sort_by<TSort_object>(Database_context db_context, IEnumerable<TSort_object> list_for_sort, string? sort_by) where TSort_object:ISort_object
        {

            List<Object_for_sort> objs_for_sort = db_context.Articles.Select(art => new Object_for_sort(art.Id, art.Created, art.Users_who_liked.Count, art.Users_who_disliked.Count)).ToList();
            objs_for_sort = sort_by switch
            {
                "date" => objs_for_sort.OrderBy(li => li.Created).ToList(),
                "rating" => objs_for_sort.OrderByDescending(li => li.Users_who_liked_count - li.Users_who_disliked_count).ThenBy(li => li.Created).ToList(),
                _ => objs_for_sort.OrderBy(li => li.Created).ToList()
            };
            IEnumerable<TSort_object> sorted_list = list_for_sort.OrderBy(li => objs_for_sort.FindIndex(obj => obj.Id == li.Id));
            return sorted_list;
        }
    }
    public interface ISort_object : ICan_like_and_dislike
    {
        public int Id { get; set; }
        public DateTime Created { get; init; }
    }
    public struct Object_for_sort
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public int Users_who_liked_count { get; set; }
        public int Users_who_disliked_count { get; set; }
        public Object_for_sort(int id, DateTime created, int users_who_liked_count, int users_who_disliked_count)
        {
            Id = id;
            Created = created;
            Users_who_liked_count = users_who_liked_count;
            Users_who_disliked_count = users_who_disliked_count;
        }
    }

}
