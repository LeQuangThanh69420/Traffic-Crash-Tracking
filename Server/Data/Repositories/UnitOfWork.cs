using Server.Data.IRepositories;

namespace Server.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        public UnitOfWork(DataContext context)
        {
            _context = context;
        }

        public IStationRepository StationRepository => new StationRepository(_context);
        public ICameraRepository CameraRepository => new CameraRepository(_context);
        public IRequestRepository RequestRepository => new RequestRepository(_context);
        public IPhotoRepository PhotoRepository => new PhotoRepository(_context);
        
        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        
        public bool HasChange()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}