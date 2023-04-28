using Dublongold_site.Useful_classes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Dublongold_site.Models
{
    public class Article : IValidatableObject, IReact_object<Article_reaction>, ISort_object
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Theme { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Tags { get; set; } = "";
        public string Title_image { get; set; } = "/Default_article_photo.png";
        public DateTime Created { get; init; } = DateTime.Now;
        public List<Article_reaction> Users_who_react { get; set; } = new();
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
    public class Article_reaction : IReaction_container
    {
        public int Id { get; set; }
        public int? Article_id { get; set; }
        public Article? Article { get; set; }
        public int? Who_react_id { get; set; }
        public User_account? Who_react { get; set; }
        // 0 = ніяка, таку краще видалити. 1 = сподобалось. 2 = не сподобалось.
        public int Reaction_type { get; set; }
    }
}
