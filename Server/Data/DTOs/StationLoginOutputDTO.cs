namespace Server.Data.DTOs
{
    public class StationLoginOutputDTO
    {
        public string Token { get; set; }
        public string StationName { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
}