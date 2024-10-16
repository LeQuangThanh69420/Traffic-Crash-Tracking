namespace Server.Data.Entities
{
    public class Request
    {
        public long RequestId { get; set; }
        public long CameraId { get; set; }
        public long StationId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool? Checked { get; set; }
        public DateTime? CheckedDate { get; set; }
        public string? Description { get; set; }
        public string PhotoURL { get; set; }
    }
}