using Dublongold_site.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Dublongold_site.Filters
{
    public class Session_resources_filter : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            if (context.HttpContext.Session.GetString("search_options") is null)
            {
                context.HttpContext.Session.SetString("search_options", "true;true;true;true;true;true");
            }
        }
        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            
        }
    }
}
