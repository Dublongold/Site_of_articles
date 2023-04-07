using Dublongold_site.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Dublongold_site.Useful_classes
{
    public interface ICan_like_and_dislike
    {
        public List<User_account> Users_who_liked { get; set; }
        public List<User_account> Users_who_disliked { get; set; }
    }
    public class Reaction_controller
    {
        public static string Like(ICan_like_and_dislike? can_like_and_dislike_object, User_account user_who_react, HttpContext http_context)
        {
            if (can_like_and_dislike_object is not null)
            {
                if (can_like_and_dislike_object.Users_who_liked.All(u => u.Login != user_who_react.Login))
                {
                    can_like_and_dislike_object.Users_who_liked.Add(user_who_react);
                    http_context.Response.Headers.Add("like-count", can_like_and_dislike_object.Users_who_liked.Count.ToString());
                    if (can_like_and_dislike_object.Users_who_disliked.Contains(user_who_react))
                    {
                        can_like_and_dislike_object.Users_who_disliked.Remove(user_who_react);
                        http_context.Response.Headers.Add("dislike-count", can_like_and_dislike_object.Users_who_disliked.Count.ToString());
                        return "c";
                    }
                    // Add like.
                    return "a";
                }
                else
                {
                    can_like_and_dislike_object.Users_who_liked.Remove(user_who_react);
                    http_context.Response.Headers.Add("like-count", can_like_and_dislike_object.Users_who_liked.Count.ToString());
                    // Remove like.
                    return "r";
                }
            }
            else
            {
                return "n";
            }
        }
        public static string Dislike(ICan_like_and_dislike? can_like_and_dislike_object, User_account? user_who_react, HttpContext http_context)
        {
            if (can_like_and_dislike_object is not null && user_who_react is not null)
            {
                if (can_like_and_dislike_object.Users_who_disliked.All(u => u.Login != user_who_react.Login))
                {
                    can_like_and_dislike_object.Users_who_disliked.Add(user_who_react);
                    http_context.Response.Headers.Add("dislike-count", can_like_and_dislike_object.Users_who_disliked.Count.ToString());
                    if (can_like_and_dislike_object.Users_who_liked.Contains(user_who_react))
                    {
                        can_like_and_dislike_object.Users_who_liked.Remove(user_who_react);
                        http_context.Response.Headers.Add("like-count", can_like_and_dislike_object.Users_who_liked.Count.ToString());
                        return "c";
                    }
                    // Add like.
                    return "a";
                }
                else
                {
                    can_like_and_dislike_object.Users_who_disliked.Remove(user_who_react);
                    http_context.Response.Headers.Add("dislike-count", can_like_and_dislike_object.Users_who_disliked.Count.ToString());
                    // Remove like.
                    return "r";
                }
            }
            else
            {
                return "n";
            }
        }
        public static (string, ICan_like_and_dislike) Set_like_or_dislike(Database_context db_context, ClaimsPrincipal User, HttpContext HttpContext, ICan_like_and_dislike can_like_and_dislike_object, string reaction_type)
        {
            User_account? account = db_context.User_accounts.FirstOrDefault(u => u.Login == User.Identity!.Name);
            if (account is not null)
            {
                string? reaction_result = reaction_type switch
                {
                    "like" => Like(can_like_and_dislike_object, account, HttpContext),
                    "dislike" => Dislike(can_like_and_dislike_object, account, HttpContext),
                    _ => null
                };
                if (reaction_result is not null)
                {
                    return (reaction_result, can_like_and_dislike_object);
                }
                else
                {
                    return ("BadRequest", can_like_and_dislike_object);
                }
            }
            return ("NotFound", can_like_and_dislike_object);
        }
    }
}
