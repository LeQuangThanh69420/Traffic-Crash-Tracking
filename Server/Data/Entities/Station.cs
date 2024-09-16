using NetTopologySuite.Geometries;

namespace Server.Data.Entities
{
    public class Station
    {
        public long StationId { get; set; }
        public string StationName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public Geometry Location { get; set; }
    }
}