using Server.Data;
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
        
        private bool IsValidRole(string role)
        {
            var validRoles = new List<string> { Roles.Admin, Roles.Moderator, Roles.Member, Roles.Camera };
            return validRoles.Contains(role);
        }
    }
}