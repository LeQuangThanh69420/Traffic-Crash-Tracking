using NetTopologySuite.Geometries;

namespace Server.Data.Entities
{
    public class Camera
    {
        public long CameraId { get; set; }
        public string CameraName { get; set; }
        public Geometry Location { get; set; }
        public bool IsActive { get; set; }
    }
}