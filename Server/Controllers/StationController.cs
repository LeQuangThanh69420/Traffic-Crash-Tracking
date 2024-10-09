using Microsoft.AspNetCore.Mvc;
using Server.Data.DTOs;
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

        [HttpGet("GetStations")]
        public async Task<ActionResult> GetStations()
        {
            return Ok(await _uow.StationRepository.GetStations());
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] StationLoginInputDTO input)
        {
            var station = await _uow.StationRepository.GetStation(input.Username, input.Password);
            if (station == null) {
                return NotFound(new { message = "Wrong username or password" } );
            }
            if (station.IsActive == false) {
                return NotFound(new { message = "Your account's unactive" } );
            }
            else {
                var token = _token.CreateToken(station.StationId, station.Username, station.Role);
                return Ok(new StationLoginOutputDTO() { 
                        Token = "Bearer " + token, 
                        StationName = station.StationName, 
                        Role = station.Role 
                    } 
                );
            }
        }
    }
}