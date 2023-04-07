
namespace Dublongold_site.Models
{
    public class User_status
    {
        public int Id { get; set; }
        public User_statuses Status { get; set; } = User_statuses.Online;
        public string Status_title { get; set; } = null!;
        public string Status_text { get; set; } = null!;
        public User_status()
        {
            Set_status();
        }
        public User_status(User_statuses user_status)
        {
            Set_status(user_status);
        }
        public User_status(User_statuses user_status, string status_title, string status_text)
        {
            Set_status(user_status, status_title, status_text);
        }

        public bool Set_status()
        {
            return Set_status(User_statuses.Online);
        }
        public bool Set_status(User_statuses user_status)
        {
            switch (user_status)
            {
                case User_statuses.Online:
                    return Set_status(user_status, "Online", "User online");
                case User_statuses.AFK:
                    return Set_status(user_status, "AFK", "User AFK");
                case User_statuses.Do_not_worry:
                    return Set_status(user_status, "Don't worry", "It's better not to disturb this user");
                case User_statuses.Offline:
                    return Set_status(user_status, "Offline", "User offline");
                default:
                    return false;
            }
        }
        public bool Set_status(User_statuses user_status, string status_title, string status_text)
        {
            if (string.IsNullOrEmpty(status_title) || string.IsNullOrEmpty(status_text)) return false;
            Status = user_status;
            Status_title = status_title;
            Status_text = status_text;
            return true;
        }
    }
    public enum User_statuses
    {
        Online,
        AFK,
        Do_not_worry,
        Offline,
        Custom
    }
}
