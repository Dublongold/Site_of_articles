using Microsoft.AspNetCore.Mvc;
using Dublongold_site.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Dublongold_site.Filters;
using Dublongold_site.Useful_classes;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Xml.Linq;
using System.Runtime.CompilerServices;

namespace Dublongold_site.Controllers
{
    [Route("account")]
    [Session_resources_filter]
    [Authenticated_deleted_user_filter]
    public class Account_control : Controller
    {
        private readonly Database_context db_context;
        private readonly object for_lock = new();
        public Account_control(Database_context new_db_context)
        {
            db_context = new_db_context;
        }
        [HttpGet]
        [Route("get_login_data")]
        public IActionResult Get_login_data()
        {
            return View("Login_path");
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(string Login, string Password)
        {
            using (db_context)
            {
                User_account? user = await db_context.User_accounts.Where(u => u.Login == Login).FirstOrDefaultAsync();
                if (user is not null)
                {
                    await db_context.Entry(user).Collection(u => u.Articles).LoadAsync();
                }
                if (user == null)
                {
                    return NotFound("invalid_login");
                }
                else if (user.Password != Password)
                {
                    return BadRequest("invalid_password");
                }
                else
                {
                    string auth_sheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    List<Claim> claims = new() { new Claim(ClaimTypes.Name, user.Login) };
                    ClaimsIdentity claim_identity = new(claims, auth_sheme);
                    await HttpContext.SignInAsync(auth_sheme, new ClaimsPrincipal(claim_identity));
                    return Ok();
                }
            }
        }

        [HttpGet]
        [Route("register")]
        public IActionResult Register()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("register-referrer")))
            {
                HttpContext.Session.SetString("register-referrer", HttpContext.Request.Headers["Referer"].ToString());
            }

            if (HttpContext.User.Identity is not null && HttpContext.User.Identity.IsAuthenticated)
            {
                string? referrer = HttpContext.Session.GetString("register-referrer");
                if (referrer is not null && !referrer.Contains("/account/register"))
                {
                    HttpContext.Session.Remove("register-referrer");
                    return Redirect(referrer);
                }
                else
                {
                    return Redirect("/");
                }
            }
            return View();
        }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register_create(User_account user_account)
        {
            if (!ModelState.IsValid) 
                return View("Register", "Виникла помилка з даними, які ви відправили.");
            using (db_context)
            {
                lock (for_lock)
                {
                    db_context.User_accounts.Add(user_account);
                    db_context.SaveChanges();
                }
            }
            List<Claim> claims = new() { new Claim(ClaimTypes.Name, user_account.Login) };
            ClaimsIdentity claim_identity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claim_identity));
            string register_referrer = HttpContext.Session.GetString("register-refferer") ?? "/";
            return Redirect(register_referrer);
        }
        [HttpGet]
        [Route("register/check")]
        public IActionResult Check_user_data()
        {
            using (db_context)
            {
                string? user_login = Request.Headers["user-login"];
                if (user_login is null)
                {
                    return BadRequest("login null");
                }
                if (db_context.User_accounts.Any(u => u.Login == user_login))
                {
                    return BadRequest("exists");
                }
                return Ok();
            }
        }
        [HttpPost]
        [Route("logout")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
        [HttpGet]
        [Route("login/authorized")]
        [Authenticated_user_filter]
        public IActionResult Is_authenticated()
        {
            return Ok();
        }

        [Route("profile/{user_login}")]
        public async Task<IActionResult> User_profile(string user_login)
        {
            using (db_context)
            {
                User_account? user_account = await db_context.User_accounts.FirstOrDefaultAsync(u => u.Login == user_login);
                if (user_account is not null)
                {
                    await db_context.Entry(user_account).Collection(u => u.Articles).LoadAsync();
                    await db_context.Entry(user_account).Collection(u => u.Users_who_liked).LoadAsync();
                    await db_context.Entry(user_account).Collection(u => u.Users_who_disliked).LoadAsync();
                    foreach (Article article in user_account.Articles)
                    {
                        await db_context.Entry(article).Collection(art => art.Authors).LoadAsync();
                        await db_context.Entry(article).Collection(art => art.Users_who_liked).LoadAsync();
                        await db_context.Entry(article).Collection(art => art.Users_who_disliked).LoadAsync();
                        await db_context.Entry(article).Collection(art => art.Users_who_have_read).LoadAsync();
                        await db_context.Entry(article).Collection(art => art.Comments).LoadAsync();
                    }
                    return View("User_profile", model: user_account);
                }
            }
            return BadRequest("Not implement");
        }

        [HttpGet]
        [Route("articles")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Articles()
        {
            using (db_context)
            {
                User_account? user_account = await db_context.User_accounts.FirstOrDefaultAsync(u => u.Login == User.Identity!.Name);

                if (user_account is not null)
                {
                    return View(await db_context.Articles.Where(art => art.Authors.Contains(user_account))
                        .Include(art => art.Authors)
                        .Include(art => art.Users_who_liked)
                        .Include(art => art.Users_who_disliked)
                        .Include(art => art.Users_who_have_read)
                        .Include(art => art.Comments)
                        .ToListAsync()
                        );
                }
                else
                {
                    return NotFound();
                }
            }
        }
        /// <summary>
        /// Дія, яка буде редагувати деякі дані користувача, коли він їх редагує в профілі. Тут можна редагувати на данний момент повне ім'я, про себе та фото.
        /// <br/>
        /// Яке саме редагування повинне виконуватися зараз, визначається заголовком "operation-with-data". Він має значення такі, як:
        /// <para />
        /// • full-name 
        /// <br/>
        /// • about
        /// <br/>
        /// • photo
        /// </summary>
        /// <param name="user_login">Потрібен, щоб знати кому редагувати дані</param>
        /// <param name="user_data_1">Зазвичай, це або ім'я, або текст про себе, або фото (у вигляді коду)</param>
        /// <param name="user_data_2">Зазвичай, це прізвище</param>
        /// <returns></returns>
        [HttpPut]
        [Route("edit/{user_login}/{user_data_1?}/{user_data_2?}")]
        [Authenticated_user_filter]
        public async Task<IActionResult> Edit_user_account_data(string user_login, string? user_data_1, string? user_data_2)
        {
            if (user_login != User.Identity!.Name)
                return StatusCode(403);
            
            string? user_photo = Request.HasJsonContentType() ? await Request.ReadFromJsonAsync<string>() : "";
            lock (for_lock)
            {
                using (db_context)
                {
                    User_account? user_account = db_context.User_accounts.FirstOrDefault(u => u.Login == user_login && u.Login == User.Identity!.Name);
                    if (user_account is not null)
                    {
                        if(user_data_1 is not null)
                            user_data_1 = Uri.UnescapeDataString(user_data_1);
                        if (user_data_2 is not null)
                            user_data_2 = Uri.UnescapeDataString(user_data_2);
                        string? request_header = Request.Headers["operation-with-data"];
                        if (request_header is not null)
                        {
                            if (request_header == "full-name" && user_data_1 is not null && user_data_2 is not null)
                            {
                                user_account.Name = user_data_1;
                                user_account.Surname = user_data_2;
                                Response.Headers.Add("user-name", Uri.EscapeDataString(user_data_1));
                                Response.Headers.Add("user-surname", Uri.EscapeDataString(user_data_2));
                            }
                            else if (request_header == "about" && user_data_1 is not null)
                            {
                                user_account.About = user_data_1;
                                Response.Headers.Add("user-about", Uri.EscapeDataString(user_data_1));
                            }
                            else if (request_header == "photo" && user_photo != "")
                            {
                                user_account.Photo = user_photo;
                            }
                        }
                        db_context.User_accounts.Update(user_account);
                        db_context.SaveChanges();
                        Response.Headers.ContentType = "text/plain; charset=utf-8";
                        return Ok();
                    }
                    else
                    {
                        if(db_context.User_accounts.Any(u => u.Login == User.Identity!.Name))
                            return NotFound();
                        else
                            return StatusCode(403);
                    }
                }
            }
        }
        [HttpPost]
        [Route("reaction/{user_login}")]
        [Authenticated_user_filter]
        public IActionResult Reaction_to_user_account(string user_login, string reaction_type)
        {
            if (User.Identity!.Name == user_login)
                return StatusCode(403);
            if (reaction_type != "like" && reaction_type != "dislike")
                return BadRequest();
            lock (for_lock)
            {
                using (db_context)
                {
                    Console.WriteLine("Teoretic user login: " + user_login);
                    User_account? user_account = db_context.User_accounts
                        .Where(c => c.Login == user_login)
                            .Include(c => c.Users_who_liked).Include(c => c.Users_who_disliked)
                                .FirstOrDefault();
                    if (user_account is not null)
                    {
                        (string, User_account) reaction_result = ((string, User_account))Reaction_controller.Set_like_or_dislike(db_context, User, HttpContext, user_account, reaction_type);
                        return reaction_result.Item1 switch
                        {
                            "a" or "c" or "r" => Reaction_result_return(user_account, reaction_result.Item1, db_context),
                            "NotFound" => NotFound(),
                            _ => BadRequest(),
                        };
                    }
                    return NotFound();
                }
            }
        }
        [NonAction]
        private IActionResult Reaction_result_return(User_account user_account, string reaction_result, Database_context db_context)
        {
            switch (reaction_result)
            {
                case "a" or "r" or "c":
                    db_context.User_accounts.Update(user_account);
                    db_context.SaveChanges();
                    return Content(reaction_result);
                case "n":
                    return NotFound();
                default:
                    return BadRequest();

            }
        }
    }
}
