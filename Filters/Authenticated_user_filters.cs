using Dublongold_site.Models;
using Dublongold_site.Useful_classes;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Dublongold_site.Filters
{
    /// <summary>
    /// Не дає допуск до потрібних сторінок. Також якщо користувач зареєструвався, його ім'я не пусте і його немає в базі даних (видалили наприклад), то вийти з його аккаунту.
    /// </summary>
    [AttributeUsage(AttributeTargets.All)]
    public class Authenticated_user_filter : Attribute, IAuthorizationFilter
    {
        public async void OnAuthorization(AuthorizationFilterContext context)
        {
            using Database_context db_context = new();
            if (context.HttpContext.User.Identity is not null && context.HttpContext.User.Identity.Name is not null && db_context.User_accounts.Any(u => u.Login == context.HttpContext.User.Identity.Name) == false)
            {
                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            if (await Checking_authentic_user_or_not.Check(context.HttpContext.User, db_context) == false)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
    /// <summary>
    /// Якщо користувач зареєструвався, його ім'я не пусте і його немає в базі даних (видалили наприклад), то вийти з його аккаунту.
    /// </summary>
    [AttributeUsage(AttributeTargets.All)]
    public class Authenticated_deleted_user_filter : Attribute, IAuthorizationFilter
    {
        public async void OnAuthorization(AuthorizationFilterContext context)
        {
            using Database_context db_context = new();
            // Якщо користувач зареєструвався, його ім'я не пусте і його немає в базі даних (видалили наприклад), то вийти з його аккаунту.
            if (context.HttpContext.User.Identity is not null && context.HttpContext.User.Identity.Name is not null && db_context.User_accounts.Any(u => u.Login == context.HttpContext.User.Identity.Name) == false)
            {
                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
        }
    }
}
