namespace Server.Data.Entities
{
    public class Photo
    {
        public long PhotoId { get; set; }
        public long RequestId { get; set; }
        public string PhotoURL { get; set; }
    }
}