using Dublongold_site.Useful_classes;
using System.ComponentModel.DataAnnotations;

namespace Dublongold_site.Models
{
    public class Article : IValidatableObject, ICan_like_and_dislike, ISort_object
    {
        public int Id { get; set; }
        public string Theme { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Tags { get; set; } = "";
        public string Title_image { get; set; } = "/Default_article_photo.png";
        public DateTime Created { get; init; } = DateTime.Now;
        public List<User_account> Users_who_liked { get; set; } = new();
        public List<User_account> Users_who_disliked { get; set; } = new();
        /// <summary>
        /// Список пользователей, которые прочитали данную статью.
        /// </summary>
        public List<User_account> Users_who_have_read { get; set; } = new();
        public int Users_who_have_read_count { get; set; } = 0;
        public List<Article_comment> Comments { get; set; } = new();
        public List<User_account> Authors { get; set; } = new();
        public IEnumerable<ValidationResult> Validate(ValidationContext context)
        {
            List<ValidationResult> results = new();
            if (string.IsNullOrEmpty(Theme) || string.IsNullOrWhiteSpace(Theme))
            {
                results.Add(new("Тема статті обов'язкова."));
            }
            if (string.IsNullOrEmpty(Content) || string.IsNullOrWhiteSpace(Content))
            {
                results.Add(new("Зміст статті обов'язковий."));
            }
            return results;
        }
    }
}
