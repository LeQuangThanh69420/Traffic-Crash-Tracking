namespace Server.Data.DTOs
{
    public class CameraAddOrEditInputDTO
    {
        public long CameraId { get; set; }
        public string CameraName { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
}