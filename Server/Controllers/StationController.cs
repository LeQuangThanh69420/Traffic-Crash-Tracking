using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
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

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] StationLoginInputDTO input)
        {
            try 
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
                            Username = station.Username,
                            Role = station.Role, 
                            Address = station.Address,
                            Longitude = station.Location.Coordinate.X,
                            Latitude = station.Location.Coordinate.Y,
                        } 
                    );
                }
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [Authorize(Policy = Policies.Station)]
        [HttpGet("GetStations")]
        public async Task<ActionResult> GetStations()
        {
            try 
            {
                return Ok(await _uow.StationRepository.GetStations());
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}