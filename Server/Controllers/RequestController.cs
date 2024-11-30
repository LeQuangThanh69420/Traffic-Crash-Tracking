using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Data.IRepositories;
using Server.Extensions;

namespace Server.Controllers
{
    public class RequestController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public RequestController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [Authorize(Policy = Policies.Station)]
        [HttpGet("GetRequestsByCamera")]
        public async Task<ActionResult> GetRequestsByCamera([FromQuery] string cameraName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try 
            {
                var camera = await _uow.CameraRepository.GetCameraByNameAndActive(cameraName);
                if (camera == null) {
                    return NotFound(new { message = "Camera not found or it's unactive" } );
                }
                return Ok(await _uow.RequestRepository.GetRequestsByCamera(camera.CameraId));
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}