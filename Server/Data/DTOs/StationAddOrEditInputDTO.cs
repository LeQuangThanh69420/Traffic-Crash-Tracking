namespace Server.Data.DTOs
{
    public class StationAddOrEditInputDTO
    {
        public long StationId { get; set; }
        public string StationName { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
}