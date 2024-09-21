using Server.Data.IRepositories;

namespace Server.Controllers
{
    public class StationController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public StationController(IUnitOfWork uow)
        {
            _uow = uow;
        }
    }
}