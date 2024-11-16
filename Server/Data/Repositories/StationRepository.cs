using Microsoft.EntityFrameworkCore;
using Server.Data.DTOs;
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

        public async Task<Station?> GetStationByName(string username)
        {
            var station = _context.Station.SingleOrDefault(s => s.Username == username);
            return station;
        }

        public async Task<Station?> GetStationToChangeStatus(string name)
        {
            var station = _context.Station.SingleOrDefault(s => s.StationName == name);
            return station;
        }

        public async Task<List<StationGetStationsOutputDTO>> GetStations()
        {
            return await _context.Station
                .Select(s => new StationGetStationsOutputDTO() {
                    StationId = s.StationId,
                    StationName = s.StationName,
                    Role = s.Role,
                    Address = s.Address,
                    Longitude = s.Location.Coordinate.X,
                    Latitude = s.Location.Coordinate.Y,
                    IsActive = s.IsActive,
                })
                .ToListAsync();
        }
    }
}