using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Data.DTOs;
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
                var camera = await _uow.CameraRepository.GetCameraByNameAndActive(cameraName);
                if (camera == null) {
                    return NotFound(new { message = "Camera not found or it's unactive" } );
                }
                else {
                    var token = _token.CreateToken(camera.CameraId, camera.CameraName, Roles.Camera);
                    return Ok(new { token = token } );
                }
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [Authorize(Policy = Policies.Station)]
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

        [Authorize(Policy = Policies.Admin)]
        [HttpPost("AddOrEdit")]
        public async Task<ActionResult> AddOrEdit(CameraAddOrEditInputDTO input)
        {
            try 
            {
                if (string.IsNullOrWhiteSpace(input.CameraName)) return BadRequest(new { message = "Input invalid"});
                if (input.Longitude < -180 || input.Longitude > 180 || input.Latitude < -90 || input.Latitude > 90) return BadRequest(new { message = "Input invalid"});
                if (input.CameraId == 0) {
                    if (await _uow.CameraRepository.CameraNameExists(input.CameraName)) return BadRequest(new { message = "Camera Name already exists"});
                }
                return Ok(new { success = await _uow.CameraRepository.AddOrEdit(input) });
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}