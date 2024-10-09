namespace Server.Data.DTOs
{
    public class CameraGetCamerasOutputDTO
    {
        public long CameraId { get; set; }
        public string CameraName { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public bool IsActive { get; set; }
    }
}