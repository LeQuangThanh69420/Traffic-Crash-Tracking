namespace Server.Data.IRepositories
{
    public interface IRequestRepository
    {
        Task<bool> AddRequest(long cameraId, double cameraLongitude, double cameraLatitude,string detail, string photoURL);
    }
}