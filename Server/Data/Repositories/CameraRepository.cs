using Microsoft.EntityFrameworkCore;
using Server.Data.DTOs;
using Server.Data.Entities;
using Server.Data.IRepositories;
using NetTopologySuite.Geometries;

namespace Server.Data.Repositories
{
    public class CameraRepository : ICameraRepository
    {
        private readonly DataContext _context;
        public CameraRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> CameraNameExists(string cameraName)
        {
            return await _context.Camera.AnyAsync(x => x.CameraName == cameraName);
        }

        public async Task<Camera?> GetCameraByNameAndActive(string cameraName)
        {
            var camera = await _context.Camera.SingleOrDefaultAsync(x => x.CameraName == cameraName && x.IsActive == true);
            return camera;
        }

        public async Task<Camera?> GetCameraByName(string name)
        {
            var camera = await _context.Camera.SingleOrDefaultAsync(c => c.CameraName == name);
            return camera;
        }

        public async Task<List<CameraGetCamerasOutputDTO>> GetCameras()
        {
            return await _context.Camera
                .Select(s => new CameraGetCamerasOutputDTO() {
                    CameraId = s.CameraId,
                    CameraName = s.CameraName,
                    Longitude = s.Location.Coordinate.X,
                    Latitude = s.Location.Coordinate.Y,
                    IsActive = s.IsActive,
                })
                .ToListAsync();
        }

        public async Task<bool> AddOrEdit(CameraAddOrEditInputDTO input)
        {
            if (input.CameraId == 0) {
                var camera = new Camera {
                    CameraName = input.CameraName,
                    Location = new Point(input.Longitude, input.Latitude) { SRID = 4326 },
                    IsActive = true,
                };
                _context.Camera.Add(camera);
                return await _context.SaveChangesAsync() > 0;
            }
            else {
                var camera = await _context.Camera.FirstOrDefaultAsync(s => s.CameraId == input.CameraId);
                if (camera != null) {
                    camera.Location.Coordinate.X = input.Longitude;
                    camera.Location.Coordinate.Y = input.Latitude;
                    return await _context.SaveChangesAsync() > 0;
                }
                else return false;
            }
        }
    }
}