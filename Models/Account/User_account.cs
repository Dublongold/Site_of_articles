using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dublongold_site.Models
{
    public class User_account : IReact_object<User_account_reaction>
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required(ErrorMessage = "Введіть логін.")]
        public string Login { get; set; } = "";
        [Required(ErrorMessage = "Введіть пароль.")]
        public string Password { get; set; } = "";
        [Required(ErrorMessage = "Введіть ім'я.")]
        public string Name { get; set; } = "";
        [Required(ErrorMessage = "Введіть прізвище.")]
        public string Surname { get; set; } = "";
        [Required(ErrorMessage = "Введіть пошту.")]
        public string Email { get; set; } = "";
        public string Secret_code { get; set; } = "";
        public string About { get; set; } = "";
        public string? Photo { get; set; }
        public string Get_photo
        {
            get
            {
                return Photo is not null ? Photo : "/Default_user_photo.png";
            }
        }
        public User_rank Rank 
        {
            get
            {
                if (Articles_which_been_read.Count < 10 && Articles.Count < 3)
                {
                    return User_rank.Newbie;
                }
                else if (Articles_which_been_read.Count < 100 && Articles.Count < 30)
                {
                    return User_rank.Novice_reader;
                }
                else if (Articles_which_been_read.Count < 500 && Articles.Count < 166)
                {
                    return User_rank.Reader;
                }
                else if (Articles_which_been_read.Count < 1000 && Articles.Count < 300)
                {
                    return User_rank.Active_reader;
                }
                else if (Articles_which_been_read.Count < 2000 && Articles.Count < 600)
                {
                    return User_rank.Expert;
                }
                else
                {
                    return User_rank.Enlightened;
                }
            }
        }
        public DateTime Created { get; init; } = DateTime.Now;
        public List<Article> Articles { get; set; } = new();
        public List<Article> Articles_which_been_read { get; set; } = new();
        public List<User_account_reaction> Users_who_react { get; set; } = new();
        public List<Article_comment> Comments { get; set; } = new();
        // public List<Article_comment> Comments_which_liked { get; set; } = new();
        // public List<Article_comment> Comments_which_disliked { get; set; } = new();
        /// <summary>
        /// Викликає перевантажений метод, який приймає в параметрі ранг користувача.
        /// </summary>
        /// <returns>Результат виконання перевантаженого методу.</returns>
        public string Get_user_rank_as_string()
        {
            return Get_user_rank_as_string(Rank);
        }
        /// <summary>
        /// Виводить користувачу його ранг з перекладом на українську.
        /// </summary>
        /// <param name="user_rank">Ранг користувача.</param>
        /// <returns>Перекладений на українську ранг користувача.</returns>
        public string Get_user_rank_as_string(User_rank user_rank)
        {
            return user_rank switch
            {
                User_rank.Newbie => "Новенький",
                User_rank.Novice_reader => "Початківець",
                User_rank.Reader => "Читач",
                User_rank.Active_reader => "Активний читач",
                User_rank.Expert => "Експерт",
                User_rank.Enlightened => "Просвітлений",
                _ => "Невідомий"
            };
        }
    }
    public enum User_rank
    {
        Newbie, // Новичёк
        Novice_reader, // Читатель-новичёк
        Reader, // Читатель
        Active_reader, // Активный читатель
        Expert, // Эксперт
        Enlightened // Просвещённый
    }
    public class User_account_reaction : IReaction_container
    {
        public int Id { get; set; }
        public int? User_account_id { get; set; }
        public User_account? User_account { get; set; }
        public int? Who_react_id { get; set; }
        public User_account? Who_react { get; set; }
        // 0 = ніяка, таку краще видалити. 1 = сподобалось. 2 = не сподобалось.
        public int Reaction_type { get; set; }
    }
}
