using Microsoft.AspNetCore.Identity;

namespace todo_app_back_api.Models
{
	public class AppUser : IdentityUser<string>
	{
		public string EmailConfirmationToken { get; set; }
	}
}
