using Microsoft.AspNetCore.SignalR;

namespace Dublongold_site.Hubs
{
    public class Actions_with_comments_hub : Hub
    {
        [HubMethodName("Read article")]
        public async Task Read_article(string article_id)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Read article " + article_id);
        }
        [HubMethodName("End read article")]
        public async Task End_read_article(string article_id)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Read article " + article_id);
        }
    }
}
