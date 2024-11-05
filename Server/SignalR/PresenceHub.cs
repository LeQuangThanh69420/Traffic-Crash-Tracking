using System.Threading.Channels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.Extensions;

namespace Server.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            if(Context.User.GetRole() == Roles.Camera) {
                var success = await _tracker.CameraConnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Clients.Others.SendAsync(Channels.CamerasConnected, Context.User.GetName());
                }
                else {
                    Context.Abort();
                    return;
                }
            }
            else {
                var success = await _tracker.StationConnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Clients.Others.SendAsync(Channels.StationConnected, Context.User.GetName());
                    await Clients.Caller.SendAsync(Channels.GetOnlineStations, await _tracker.GetOnlineStations());
                    await Clients.Caller.SendAsync(Channels.GetOnlineCameras, await _tracker.GetOnlineCameras());
                }
                else {
                    Context.Abort();
                    return;
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if(Context.User.GetRole() == Roles.Camera) {
                var success = await _tracker.CameraDisconnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Clients.Others.SendAsync(Channels.CamerasDisconnected, Context.User.GetName());
                }
            }
            else {
                var success = await _tracker.StationDisconnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Clients.Others.SendAsync(Channels.StationDisconnected, Context.User.GetName());
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendFrame(string frameBase64)
        {
            await Clients.Others.SendAsync(Channels.ReceiveFrameBase64, new { 
                cameraName = Context.User.GetName(),
                frameBase64 = frameBase64
            });
        }
    }
}