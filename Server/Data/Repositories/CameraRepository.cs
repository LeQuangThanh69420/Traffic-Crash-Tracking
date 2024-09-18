using Server.Data.IRepositories;

namespace Server.Data.Repositories
{
    public class CameraRepository : ICameraRepository
    {
        private readonly DataContext _context;

        public CameraRepository(DataContext context)
        {
            _context = context;
        }
    }
}