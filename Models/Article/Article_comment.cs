
namespace Dublongold_site.Models
{
    public class Article_comment : IReact_object<Article_comment_reaction>, ISort_object
    {
        public int Id { get; set; }
        public int Article_id { get; set; }
        public Article Article { get; set; } = null!;
        public int Author_id { get; set; }
        public User_account Author { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime Created { get; init; } = DateTime.Now;
        public List<Article_comment> Replying_comments { get; set; } = new();
        public DateTime Edited_date { get; set; }
        public int? Who_edit_id { get; set; }
        public User_account? Who_edit { get; set; }
        public int Reply_level { get; set; } = 0;
        public int? Reply_to_comment_id { get; set; }
        public int? Reply_to_comment_id_of_article { get; set; }
        public Article_comment? Reply_to_comment { get; set; }
        public List<Article_comment_reaction> Users_who_react { get; set; } = new();
    }
    public class Article_comment_reaction : IReaction_container
    {
        public int Id { get; set; }
        public int? Article_id { get; set; }
        public int? Article_comment_id { get; set; }
        public Article_comment? Comment { get; set; }
        public int? Who_react_id { get; set; }
        public User_account? Who_react { get; set; }
        // 0 = ніяка, таку краще видалити. 1 = сподобалось. 2 = не сподобалось.
        public int Reaction_type { get; set; }
    }
}