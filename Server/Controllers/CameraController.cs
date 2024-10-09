using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Data.IRepositories;
using Server.Services;

namespace Server.Controllers
{
    public class CameraController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _token;
        public CameraController(IUnitOfWork uow, ITokenService token)
        {
            _uow = uow;
            _token = token;
        }

        [HttpGet("GetCameraToken")]
        public async Task<ActionResult> GetCameraToken([FromQuery] string cameraName)
        {
            try 
            {
                var camera = await _uow.CameraRepository.GetCameraByName(cameraName);
                if (camera == null) {
                    return NotFound(new { message = "Camera not found or it's unactive" } );
                }
                else {
                    var token = _token.CreateToken(camera.CameraId, camera.CameraName, Roles.Camera);
                    return Ok(new { token = "Bearer " + token } );
                }
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpGet("GetCameras")]
        public async Task<ActionResult> GetCameras()
        {
            try 
            {
                return Ok(await _uow.CameraRepository.GetCameras());
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}