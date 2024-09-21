using Server.Data.IRepositories;

namespace Server.Data.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly DataContext _context;
        public StationRepository(DataContext context)
        {
            _context = context;
        }
    }
}