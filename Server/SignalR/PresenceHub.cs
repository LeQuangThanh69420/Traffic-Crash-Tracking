using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.Data.IRepositories;
using Server.Extensions;

namespace Server.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        private readonly IUnitOfWork _uow;
        public PresenceHub(PresenceTracker tracker, IUnitOfWork uow)
        {
            _tracker = tracker;
            _uow = uow;
        }

        public override async Task OnConnectedAsync()
        {
            if(Context.User.GetRole() == Roles.Camera) {
                var success = await _tracker.CameraConnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.CamerasConnected, Context.User.GetName());
                }
                else {
                    Context.Abort();
                    return;
                }
            }
            else {
                var success = await _tracker.StationConnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Groups.AddToGroupAsync(Context.ConnectionId, ChannelsGroups.Station);
                    await Clients.OthersInGroup(ChannelsGroups.Station).SendAsync(Channels.StationConnected, Context.User.GetName());
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
                    await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.CamerasDisconnected, Context.User.GetName());
                }
            }
            else {
                var success = await _tracker.StationDisconnected(Context.User.GetName(), Context.ConnectionId);
                if(success) {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, ChannelsGroups.Station);
                    await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.StationDisconnected, Context.User.GetName());
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendFrame(string frameBase64)
        {
            await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.ReceiveFrameBase64, new { 
                cameraName = Context.User.GetName(),
                frameBase64 = frameBase64
            });
        }

        public async Task ChangeStatus(string obj, string name)
        {
            if (obj == "Camera") {
                var camera = await _uow.CameraRepository.GetCameraToChangeStatus(name);
                if(camera != null) {
                    camera.IsActive = !camera.IsActive;
                    if(await _uow.Complete()) {
                        await Clients.Client(PresenceTracker.OnlineCameras[name]).SendAsync(Channels.ForcedDisconnect);
                        await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.ChangeStatus, new {
                            obj = obj,
                            name = camera.CameraName,
                        });
                    }
                }
                return;
            }
            if (obj == "Station") {
                var station = await _uow.StationRepository.GetStationToChangeStatus(name);
                if(station != null) {
                    station.IsActive = !station.IsActive;
                    if(await _uow.Complete()) {
                        await Clients.Client(PresenceTracker.OnlineStations[name]).SendAsync(Channels.ForcedDisconnect);
                        await Clients.Group(ChannelsGroups.Station).SendAsync(Channels.ChangeStatus, new {
                            obj = obj,
                            name = station.StationName,
                        });
                    }
                }
                return;
            }
        }
    }
}