using Microsoft.EntityFrameworkCore;
using Dublongold_site.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Dublongold_site.Useful_classes;

namespace Dublongold_site
{
    public class Main_class
    {
        public static string? connection_string;
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder();

            string connection_string = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
            Database_context.Connection_string = connection_string;

            // Призначенний для створення початкових елементів в бази даних.
            // Якщо потрібно, щоб дані зберігалися і не оновлювалися, то просто прибери його.
            Create_start_data_of_database.Create();

            builder.Services.AddDbContext<Database_context>(options =>
            {
                options.UseMySql(connection_string, new MySqlServerVersion(new Version(8, 0, 32)));
            });

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
            builder.Services.AddControllersWithViews(options => options.ModelBinderProviders.Insert(0, new Register_user_binding_provider()));
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession();
            var app = builder.Build();

            app.UseStatusCodePagesWithReExecute("/error");
            app.UseSession();
            app.UseAuthentication();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                    ctx.Context.Response.Headers["Expires"] = "-1";
                }
            });
            app.MapControllers();

            app.Run();
        }
    }
}