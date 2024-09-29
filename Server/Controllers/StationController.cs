using Microsoft.AspNetCore.Mvc;
using Server.Data.IRepositories;
using Server.Services;

namespace Server.Controllers
{
    public class StationController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _token;
        public StationController(IUnitOfWork uow, ITokenService token)
        {
            _uow = uow;
            _token = token;
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] string username, [FromBody] string password)
        {
            var station = await _uow.StationRepository.GetStation(username, password);
            if (station == null) {
                return NotFound(new { message = "Wrong username or password" } );
            }
            if (station.IsActive == false) {
                return NotFound(new { message = "Your account's unactive" } );
            }
            else {
                var token = _token.CreateToken(station.StationId, station.StationName, station.Role);
                return Ok(new { token = "Bearer " + token } );
            }
        }
    }
}