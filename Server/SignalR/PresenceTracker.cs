namespace Server.SignalR
{
    public class PresenceTracker
    {
        public static readonly Dictionary<string, string> OnlineStations = new Dictionary<string, string>();
        public static readonly Dictionary<string, string> OnlineCameras = new Dictionary<string, string>();

        public Task<bool> StationConnected(string name, string connectionId)
        {
            bool success = false;
            lock(OnlineStations) 
            {
                if(!OnlineStations.ContainsKey(name)) {
                    OnlineStations.Add(name, connectionId);
                    success = true;
                }
            }
            return Task.FromResult(success);
        }

        public Task<bool> StationDisconnected(string name, string connectionId)
        {
            bool success = false;
            lock(OnlineStations) 
            {
                if(OnlineStations.ContainsKey(name)) {
                    if(OnlineStations[name] == connectionId) {
                        OnlineStations.Remove(name);
                        success = true;
                    }
                }
            }
            return Task.FromResult(success);
        }

        public Task<string[]> GetOnlineStations() 
        {
            string[] onlineStations;
            lock(OnlineStations) 
            {
                onlineStations = OnlineStations.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }
            return Task.FromResult(onlineStations);
        }

        public Task<bool> CameraConnected(string name, string connectionId)
        {
            bool success = false;
            lock(OnlineCameras) 
            {
                if(!OnlineCameras.ContainsKey(name)) {
                    OnlineCameras.Add(name, connectionId);
                    success = true;
                }
            }
            return Task.FromResult(success);
        }

        public Task<bool> CameraDisconnected(string name, string connectionId)
        {
            bool success = false;
            lock(OnlineCameras) 
            {
                if(OnlineCameras.ContainsKey(name)) {
                    if(OnlineCameras[name] == connectionId) {
                        OnlineCameras.Remove(name);
                        success = true;
                    }
                }
            }
            return Task.FromResult(success);
        }

        public Task<string[]> GetOnlineCameras() 
        {
            string[] onlineCameras;
            lock(OnlineCameras) 
            {
                onlineCameras = OnlineCameras.OrderBy(k => k.Key).Select(k => k.Key).ToArray();          
            }
            return Task.FromResult(onlineCameras);
        }
    }
}