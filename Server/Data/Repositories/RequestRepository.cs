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
            var requests = from Request in _context.Request
                join Camera in _context.Camera on Request.CameraId equals Camera.CameraId
                join Station in _context.Station on Request.StationId equals Station.StationId into ps_jointable
                from Station in ps_jointable.DefaultIfEmpty()
                join RecStation in _context.Station on Request.RecommendStationId equals RecStation.StationId
                orderby Request.CreatedDate descending
                where Request.CameraId == cameraId
                select new {
                    RequestId = Request.RequestId,
                    CameraId = Request.CameraId,
                    CameraName = Camera.CameraName,
                    RecStationId = Request.RecommendStationId,
                    RecStationName = RecStation.StationName,
                    StationId = Request.StationId,
                    StationName = Station.StationName,
                    CreatedDate = Request.CreatedDate,
                    Detail = Request.Detail,
                    PhotoURL = Request.PhotoURL,
                    Checked = Request.Checked,
                    CheckedDate = Request.CheckedDate,
                    Description = Request.Description
                };
            return await requests.ToListAsync<object>();
        }

        public async Task<List<object>> GetRequestsLocation()
        {
            var rqls = (await _context.Request
                .Join(_context.Camera, Request => Request.CameraId, Camera => Camera.CameraId, (Request, Camera) => new { Request, Camera })
                .Join(_context.Station, rc => rc.Request.RecommendStationId, Station => Station.StationId, (rc, Station) => new { rc.Request, rc.Camera, Station })
                .Where(x => x.Request.Checked == null)
                .ToListAsync())
                .GroupBy(x => new
                {
                    CameraLongitude = x.Camera.Location.Coordinate.X,
                    CameraLatitude = x.Camera.Location.Coordinate.Y,
                    RecStationLongitude = x.Station.Location.Coordinate.X,
                    RecStationLatitude = x.Station.Location.Coordinate.Y
                })
                .Select(g => new
                {
                    Count = g.Count(),
                    x1 = g.Key.CameraLongitude,
                    y1 = g.Key.CameraLatitude,
                    x2 = g.Key.RecStationLongitude,
                    y2 = g.Key.RecStationLatitude
                })
                .ToList();
            return rqls.Cast<object>().ToList();
        }

        public async Task<object> AddRequest(long cameraId, double cameraLongitude, double cameraLatitude, string detail, string photoURL)
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
            return new {
                success = await _context.SaveChangesAsync() > 0,
                x1 = cameraLongitude,
                y1 = cameraLatitude,
                x2 = nearStation.Location.Coordinate.X,
                y2 = nearStation.Location.Coordinate.Y,
            };
        }

        public async Task<bool> CheckRequest()
        {
            return false;
        }
    }
}