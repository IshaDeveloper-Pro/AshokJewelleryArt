using Microsoft.EntityFrameworkCore;
using AshokJewelleryArt.Models;

namespace AshokJewelleryArt.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

       
        public DbSet<Product> Products { get; set; }
    }
}
