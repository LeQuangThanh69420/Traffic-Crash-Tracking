namespace Server.Data.IRepositories
{
    public interface IRequestRepository
    {
        Task<List<object>> GetRequestsByCamera(long cameraId);
        Task<List<object>> GetRequestsLocation();
        Task<object> AddRequest(long cameraId, double cameraLongitude, double cameraLatitude,string detail, string photoURL);
    }
}