using Microsoft.EntityFrameworkCore;
using Server.Data.DTOs;
using Server.Data.Entities;
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

        public async Task<Camera?> GetCameraByName(string cameraName)
        {
            var camera = await _context.Camera.SingleOrDefaultAsync(x => x.CameraName == cameraName && x.IsActive == true);
            return camera;
        }

        public async Task<Camera?> GetCameraToChangeStatus(string name)
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
    }
}