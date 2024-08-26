using Microsoft.EntityFrameworkCore;

namespace Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
    }
}