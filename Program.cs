using Microsoft.EntityFrameworkCore;
using Dublongold_site.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Dublongold_site.Useful_classes;
using Dublongold_site.Hubs;

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
            using (FileStream file = new(Directory.GetCurrentDirectory() + "/Db_log.txt", FileMode.Create))
            {

            }
            builder.Services.AddDbContext<Database_context>(options =>
            {
                options.UseMySql(connection_string, new MySqlServerVersion(new Version(8, 0, 32)));
                options.UseLoggerFactory(LoggerFactory.Create(
                    configure => configure.AddProvider(new FileLoggerProvider(Directory.GetCurrentDirectory() + "/Db_log.txt"))));
            });

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
            builder.Services.AddControllersWithViews(options => options.ModelBinderProviders.Insert(0, new Register_user_binding_provider()));
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession();
            builder.Services.AddSignalR();
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

            app.MapHub<Actions_with_comments_hub>("/actions_with_comments");

            app.Run();
        }
    }
    public class FileLogger : ILogger, IDisposable
    {
        string filePath;
        static object _lock = new object();
        public FileLogger(string path)
        {
            filePath = path;
        }
        public IDisposable BeginScope<TState>(TState state) where TState : notnull
        {
            return this;
        }

        public void Dispose() 
        {
            using FileStream file = new(Directory.GetCurrentDirectory() + "/Db_log.txt", FileMode.Append);
            using StreamWriter write = new(file);
            write.WriteLine("\nEnd actions with database.");
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            //return logLevel == LogLevel.Trace;
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId,
                    TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            lock (_lock)
            {
                File.AppendAllText(filePath, formatter(state, exception) + Environment.NewLine);
            }
        }
    }
    public class FileLoggerProvider : ILoggerProvider
    {
        string path;
        public FileLoggerProvider(string path)
        {
            this.path = path;
        }
        public ILogger CreateLogger(string categoryName)
        {
            return new FileLogger(path);
        }

        public void Dispose() { }
    }
}