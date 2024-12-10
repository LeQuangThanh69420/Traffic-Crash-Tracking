namespace Server.Data
{
    public static class Channels
    {
        public const string StationConnected = "StationConnected";
        public const string StationDisconnected = "StationDisconnected";
        public const string GetOnlineStations = "GetOnlineStations";
        public const string CamerasConnected = "CamerasConnected";
        public const string CamerasDisconnected = "CamerasDisconnected";
        public const string GetOnlineCameras = "GetOnlineCameras";
        public const string ReceiveFrameBase64 = "ReceiveFrameBase64";
        public const string ChangeStatus = "ChangeStatus";
        public const string ForcedDisconnect = "ForcedDisconnect";
        public const string RequestAdded = "RequestAdded";
        public const string RequestChecked = "RequestChecked";
    }
}