using Microsoft.EntityFrameworkCore;
using Server.Data.DTOs;
using Server.Data.Entities;
using Server.Data.IRepositories;
using NetTopologySuite.Geometries;

namespace Server.Data.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly DataContext _context;
        public StationRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> StationNameExists(string stationName)
        {
            return await _context.Station.AnyAsync(x => x.StationName == stationName);
        }

        public async Task<bool> UsernameExists(string username)
        {
            return await _context.Station.AnyAsync(x => x.Username == username);
        }

        public async Task<Station?> GetStation(string username, string password)
        {
            var station = _context.Station.SingleOrDefault(s => s.Username == username && s.Password == password);
            return station;
        }

        public async Task<Station?> GetStationByStationName(string name)
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

        public async Task<bool> AddOrEdit(StationAddOrEditInputDTO input)
        {
            if (input.StationId == 0) {
                var station = new Station {
                    StationName = input.StationName,
                    Username = input.Username,
                    Password = input.Password,
                    Role = Roles.Member,
                    Address = input.Address,
                    Location = new Point(input.Longitude, input.Latitude) { SRID = 4326 },
                    IsActive = true,
                };
                _context.Station.Add(station);
                return await _context.SaveChangesAsync() > 0;
            }
            else {
                var station = await _context.Station.FirstOrDefaultAsync(s => s.StationId == input.StationId);
                if (station != null) {
                    station.Password = input.Password;
                    station.Address = input.Address;
                    station.Location.Coordinate.X = input.Longitude;
                    station.Location.Coordinate.Y = input.Latitude;
                    return await _context.SaveChangesAsync() > 0;
                }
                else return false;
            }
        }
    }
}