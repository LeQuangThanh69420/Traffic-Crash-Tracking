using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Data.DTOs;
using Server.Data.IRepositories;
using Server.Services;
using Server.SignalR;

namespace Server.Controllers
{
    public class StationController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _token;
        private readonly PresenceTracker _tracker;
        public StationController(IUnitOfWork uow, ITokenService token, PresenceTracker tracker)
        {
            _uow = uow;
            _token = token;
            _tracker = tracker;
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
                if ((await _tracker.GetOnlineStations()).Contains(station.StationName)) {
                    return NotFound(new { message = "Your account's logged in another device" } );
                }
                else {
                    var token = _token.CreateToken(station.StationId, station.StationName, station.Role);
                    return Ok(new StationLoginOutputDTO() { 
                            Token = token, 
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

        [Authorize(Policy = Policies.Admin)]
        [HttpPost("AddOrEdit")]
        public async Task<ActionResult> AddOrEdit(StationAddOrEditInputDTO input)
        {
            try 
            {
                if (string.IsNullOrWhiteSpace(input.StationName) || string.IsNullOrWhiteSpace(input.Address)) return BadRequest(new { message = "Input invalid"});
                if (input.Username.Length < 8 || input.Username.Length > 16 || input.Password.Length < 8 || input.Password.Length > 16) return BadRequest(new { message = "Username or Password invalid"});
                if (input.Longitude < -180 || input.Longitude > 180 || input.Latitude < -90 || input.Latitude > 90) return BadRequest(new { message = "Input invalid"});
                if (await _uow.StationRepository.StationNameExists(input.StationName)) return BadRequest(new { message = "Station Name already exists"});
                if (await _uow.StationRepository.UsernameExists(input.Username)) return BadRequest(new { message = "Username already exists"});
                return Ok(await _uow.StationRepository.AddOrEdit(input));
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}