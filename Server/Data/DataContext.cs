using Microsoft.EntityFrameworkCore;
using Server.Data.Entities;

namespace Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Station> Station { get; set; }
        public DbSet<Camera> Camera { get; set; }
        public DbSet<Request> Request { get; set; }
        public DbSet<Photo> Photo { get; set; }
    }
}