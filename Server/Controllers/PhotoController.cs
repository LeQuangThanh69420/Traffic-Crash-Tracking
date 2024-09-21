using Server.Data.IRepositories;

namespace Server.Controllers
{
    public class PhotoController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public PhotoController(IUnitOfWork uow)
        {
            _uow = uow;
        }
    }
}