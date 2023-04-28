using Dublongold_site.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Dublongold_site.Useful_classes
{
    public class Reaction_controller
    {
        public static string React<T>(IReact_object<T> react_object, User_account user_who_react, HttpContext http_context, int reaction_type) where T : IReaction_container
        {
            if (react_object is not null)
            {
                Console.WriteLine(reaction_type);
                Console.WriteLine(user_who_react.Id);
                Console.WriteLine(react_object.Users_who_react.Count);
                byte create_and_add = 0;
                string result_str = string.Empty;
                if (react_object.Users_who_react.Any(r => r.Who_react_id == user_who_react.Id && r.Reaction_type == reaction_type) || reaction_type == 0)
                {
                    react_object.Users_who_react.RemoveAll(r => r.Who_react_id == user_who_react.Id);
                    result_str = "r";
                }
                else if (react_object.Users_who_react.All(r => r.Who_react_id != user_who_react.Id))
                {
                    create_and_add = 1;
                    result_str = "a";
                }
                else
                {
                    react_object.Users_who_react.First(r => r.Who_react_id == user_who_react.Id).Reaction_type = reaction_type;
                    result_str = "c";
                }
                if (create_and_add > 0)
                {
                    if (react_object is Article article)
                    {
                        article.Users_who_react.Add(new() { Who_react_id = user_who_react.Id, Reaction_type = reaction_type });
                    }
                    else if (react_object is Article_comment comment)
                    {
                        comment.Users_who_react.Add(new() { Who_react_id = user_who_react.Id, Reaction_type = reaction_type });
                    }
                    else if (react_object is User_account account)
                    {
                        account.Users_who_react.Add(new() { Who_react_id = user_who_react.Id, Reaction_type = reaction_type });
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(result_str))
                    {
                        result_str = "b";
                    }
                }
                if (result_str != "b")
                {
                    http_context.Response.Headers.Add("like-count", react_object.Users_who_react.Where(ur => ur.Reaction_type == 1).Count().ToString());
                    http_context.Response.Headers.Add("dislike-count", react_object.Users_who_react.Where(ur => ur.Reaction_type == 2).Count().ToString());
                }
                Console.WriteLine("Result: " + result_str);
                return result_str;
            }
            else
            {
                return "n";
            }
        }
        public static (string, IReact_object<T>) Set_like_or_dislike<T>(Database_context db_context, ClaimsPrincipal User, HttpContext HttpContext, IReact_object<T> can_like_and_dislike_object, int reaction_type) where T : IReaction_container
        {
            User_account? account = db_context.User_accounts.FirstOrDefault(u => u.Login == User.Identity!.Name);
            if (account is not null)
            {
                string? reaction_result = reaction_type switch
                {
                    1 or 2 => React(can_like_and_dislike_object, account, HttpContext, reaction_type),
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
