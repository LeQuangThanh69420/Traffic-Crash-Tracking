using Server.Data.IRepositories;

namespace Server.Controllers
{
    public class RequestController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public RequestController(IUnitOfWork uow)
        {
            _uow = uow;
        }
    }
}