using Dublongold_site.Useful_classes;

namespace Dublongold_site.Models
{
    public class Article_comment : ICan_like_and_dislike
    {
        public int Id { get; set; }
        public int Article_id { get; set; }
        public Article Article { get; set; } = null!;
        public int Author_id { get; set; }
        public User_account Author { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime Created_date { get; set; } = DateTime.Now;
        public List<Article_comment> Replying_comments { get; set; } = new();
        public DateTime Edited_date { get; set; }
        public int? Who_edit_id { get; set; }
        public User_account? Who_edit { get; set; }
        public int Reply_level { get; set; } = 0;
        public int? Reply_to_comment_id { get; set; }
        public int? Reply_to_comment_id_of_article { get; set; }
        public Article_comment? Reply_to_comment { get; set; }
        /// <summary>
        /// Список пользователей, которые поставили лайк.
        /// </summary>
        public List<User_account> Users_who_liked { get; set; } = new();
        /// <summary>
        /// Список пользователей, которые поставили дислайк.
        /// </summary>
        public List<User_account> Users_who_disliked { get; set; } = new();
    }
}
