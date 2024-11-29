using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Server.Data.DTOs;
using Server.Data.Entities;
using Server.Data.IRepositories;

namespace Server.Data.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly DataContext _context;
        public RequestRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> AddRequest(long cameraId, double cameraLongitude, double cameraLatitude, string detail, string photoURL)
        {
            var searchPoint = new Point(cameraLongitude, cameraLatitude) { SRID = 4326 };
            var nearStation = await _context.Station
                .OrderBy(c => c.Location.Distance(searchPoint))
                .FirstOrDefaultAsync();
            var request = new Request {
                CameraId = cameraId,
                RecommendStationId = nearStation.StationId,
                StationId = null,
                CreatedDate = DateTime.UtcNow,
                Detail = detail,
                PhotoURL = photoURL,
                Checked = false,
                CheckedDate = null,
                Description = null,
            };
            _context.Request.Add(request);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}