using Microsoft.EntityFrameworkCore;
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
    }
}