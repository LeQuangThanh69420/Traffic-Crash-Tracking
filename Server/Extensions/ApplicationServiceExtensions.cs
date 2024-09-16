using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Helpers;

namespace Server.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddCors();
            services.AddSignalR();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), x => x.UseNetTopologySuite());
            });

            return services;
        }
    }
}