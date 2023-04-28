using Dublongold_site.Models;

namespace Dublongold_site
{
    public interface IReaction_container
    {
        public int? Who_react_id { get; set; }
        public User_account? Who_react { get; set; }
        // 0 = ніяка, таку краще видалити. 1 = сподобалось. 2 = не сподобалось.
        public int Reaction_type { get; set; }
    }

    public interface IReact_object<T>
    {
        public List<T> Users_who_react { get; set; }
    }
    public interface ISort_object
    {
        public int Id { get; set; }
        public DateTime Created { get; init; }
    }
}
