using Microsoft.AspNetCore.SignalR;

namespace Server.SignalR
{
    public class PresenceHub : Hub
    {
        public override async Task OnConnectedAsync()
        {

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}