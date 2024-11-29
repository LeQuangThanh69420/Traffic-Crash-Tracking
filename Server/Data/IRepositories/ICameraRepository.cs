using Server.Data.DTOs;
using Server.Data.Entities;

namespace Server.Data.IRepositories
{
    public interface ICameraRepository
    {
        Task<Camera?> GetCameraByNameAndActive(string cameraName);
        Task<Camera?> GetCameraByName(string name);
        Task<List<CameraGetCamerasOutputDTO>> GetCameras();
    }
}