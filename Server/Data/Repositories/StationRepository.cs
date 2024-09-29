using Server.Data.Entities;
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

        public async Task<Station?> GetStation(string username, string password)
        {
            var station = _context.Station.SingleOrDefault(s => s.Username == username && s.Password == password);
            return station;
        }
    }
}