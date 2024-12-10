using Server.Data.DTOs;
using Server.Data.Entities;

namespace Server.Data.IRepositories
{
    public interface ICameraRepository
    {
        Task<bool> CameraNameExists(string cameraName);
        Task<Camera?> GetCameraByNameAndActive(string cameraName);
        Task<Camera?> GetCameraByName(string name);
        Task<List<CameraGetCamerasOutputDTO>> GetCameras();
        Task<bool> AddOrEdit(CameraAddOrEditInputDTO input);
    }
}