using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using todo_app_back_api.Models;

namespace todo_app_back_api.Contexts
{
	public class ApplicationDbContext : IdentityDbContext<AppUser, AppRole, int>
	{
		public ApplicationDbContext(DbContextOptions options) : base(options) { }
		public DbSet<Todo> Todos {  get; set; }
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<Todo>().
				HasOne(t => t.User).
				WithMany(u => u.Todos);
		}
	}
}
