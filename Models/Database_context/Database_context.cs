using Microsoft.EntityFrameworkCore;

namespace Dublongold_site.Models
{
    /// <summary>
    /// Контекст базы даных. Предназначен для хранения аккаунтов, статьей, комментариев и изображений.
    /// </summary>
    public class Database_context:DbContext
    {

        public DbSet<User_account> User_accounts { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public DbSet<Article_comment> Article_comments { get; set; } = null!;
        public static string? Connection_string { get; set; }
        public Database_context() : this((new DbContextOptionsBuilder<Database_context>()).UseMySql(Connection_string, new MySqlServerVersion(new Version(8,0,32))).Options)
        {

        }
        public Database_context(DbContextOptions<Database_context> options) : base(options)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Article>().ToTable("Articles");
            builder.Entity<Article>()
                .HasMany(art => art.Users_who_liked)
                    .WithMany(u => u.Articles_which_liked);
            builder.Entity<Article>()
                .HasMany(art => art.Users_who_disliked)
                    .WithMany(u => u.Articles_which_disliked);
            builder.Entity<Article>()
                .HasMany(art => art.Users_who_have_read)
                    .WithMany(u => u.Articles_which_been_read);

            builder.Entity<Article_comment>().ToTable("Comments");
            builder.Entity<Article_comment>().HasKey(c=> new {c.Id, c.Article_id});
            builder.Entity<Article_comment>()
                .HasOne(c => c.Author)
                    .WithMany(a => a.Comments)
                        .HasForeignKey(c => c.Author_id);
            builder.Entity<Article_comment>()
                .HasOne(c => c.Article)
                    .WithMany(a => a.Comments)
                        .HasForeignKey(c => c.Article_id);
            builder.Entity<Article_comment>()
                .HasOne(c => c.Reply_to_comment)
                    .WithMany(c => c.Replying_comments)
                        .HasForeignKey(c => new { c.Reply_to_comment_id, c.Reply_to_comment_id_of_article });
            builder.Entity<Article_comment>()
                .HasMany(c => c.Users_who_liked)
                    .WithMany();
            builder.Entity<Article_comment>()
                .HasMany(c => c.Users_who_disliked)
                    .WithMany();
            builder.Entity<Article_comment>()
                .HasOne(c => c.Who_edit)
                    .WithMany()
                        .HasForeignKey(c => c.Who_edit_id);
            builder.Entity<User_account>().ToTable("Accounts");
            builder.Entity<User_account>()
                .HasMany(x => x.Articles)
                    .WithMany(x => x.Authors)
                        .UsingEntity(e => e.ToTable("Article-authors"));
            builder.Entity<User_account>()
                .HasMany(x => x.Comments)
                    .WithOne(x => x.Author);
            builder.Entity<User_account>()
                .HasIndex(x => x.Login)
                    .IsUnique();
            builder.Entity<User_account>()
                .OwnsOne(x => x.Status);
        }
    }
}
