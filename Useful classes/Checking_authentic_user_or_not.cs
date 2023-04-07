using Dublongold_site.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Dublongold_site.Useful_classes
{
    public static class Checking_authentic_user_or_not
    {
        public static async Task<bool> Check(ClaimsPrincipal user, Database_context db_context)
        {
            return user.Identity is not null && user.Identity.IsAuthenticated && await db_context.User_accounts.AnyAsync(u => u.Login == user.Identity.Name);
        }
    }
}
