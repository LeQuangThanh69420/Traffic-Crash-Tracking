using Server.Data.DTOs;
using Server.Data.Entities;

namespace Server.Data.IRepositories
{
    public interface ICameraRepository
    {
        Task<Camera?> GetCameraByName(string cameraName);
        Task<List<CameraGetCamerasOutputDTO>> GetCameras();
    }
}