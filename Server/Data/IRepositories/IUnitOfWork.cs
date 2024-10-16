namespace Server.Data.IRepositories
{
    public interface IUnitOfWork
    {
        IStationRepository StationRepository { get; }
        ICameraRepository CameraRepository { get; }
        IRequestRepository RequestRepository { get; }
        Task<bool> Complete();
        bool HasChange();
    }
}