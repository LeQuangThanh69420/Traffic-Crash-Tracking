using Server.Data.IRepositories;

namespace Server.Data.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;

        public PhotoRepository(DataContext context)
        {
            _context = context;
        }
    }
}