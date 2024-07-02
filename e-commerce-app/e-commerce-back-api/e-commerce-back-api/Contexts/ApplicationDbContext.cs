using e_commerce_back_api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace e_commerce_back_api.Contexts
{
	public class ApplicationDbContext : IdentityDbContext<AppUser, AppRole, int>
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		public DbSet<Product> Products { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<Cart> Carts { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<Product>()
				.HasMany(p => p.Carts)
				.WithMany(o => o.Products);

			builder.Entity<Product>()
				.HasMany(p => p.Orders)
				.WithMany(c => c.Products);

			builder.Entity<AppUser>()
				.HasOne(u => u.Order)
				.WithOne(o => o.User)
				.HasForeignKey<Order>(c => c.UserId)
				.IsRequired(false);

			builder.Entity<AppUser>()
				.HasOne(u => u.Cart)
				.WithOne(c => c.User)
				.HasForeignKey<Cart>(c => c.UserId)
				.IsRequired(false);
        }

		public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
		{
			public ApplicationDbContext CreateDbContext(string[] args)
			{
                DbContextOptionsBuilder<ApplicationDbContext> optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
				optionsBuilder.UseSqlServer("Data Source=DESKTOP-OIVAHGF\\SQLEXPRESS;Initial Catalog=EComDB;Integrated Security=True;Connect Timeout=30;Encrypt=True;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False");
				return new ApplicationDbContext(optionsBuilder.Options);
			}
		}
    }
}
