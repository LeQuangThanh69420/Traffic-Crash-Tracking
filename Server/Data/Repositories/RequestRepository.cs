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

        public async Task<List<object>> GetRequestsByCamera(long cameraId)
        {
            Console.WriteLine(cameraId);
            var request = from Request in _context.Request
                join Camera in _context.Camera on Request.CameraId equals Camera.CameraId
                join Station in _context.Station on Request.StationId equals Station.StationId into ps_jointable
                from p in ps_jointable.DefaultIfEmpty()
                join RecStation in _context.Station on Request.RecommendStationId equals RecStation.StationId
                orderby Request.CreatedDate descending
                where Request.CameraId == cameraId
                select new {
                    RequestId = Request.RequestId,
                    CameraId = Request.CameraId,
                    CameraName = Camera.CameraName,
                    CameraLongitude = Camera.Location.Coordinate.X,
                    CameraLatitude = Camera.Location.Coordinate.Y,
                    RecStationId = Request.RecommendStationId,
                    RecStationName = RecStation.StationName,
                    RecStationLongitude = RecStation.Location.Coordinate.X,
                    RecStationLatitude = RecStation.Location.Coordinate.Y,
                    StationId = Request.StationId,
                    CreatedDate = Request.CreatedDate,
                    Detail = Request.Detail,
                    PhotoURL = Request.PhotoURL,
                    Checked = Request.Checked,
                    CheckedDate = Request.CheckedDate,
                    Description = Request.Description
                };
            return await request.ToListAsync<object>();
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
                Checked = null,
                CheckedDate = null,
                Description = null,
            };
            _context.Request.Add(request);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}