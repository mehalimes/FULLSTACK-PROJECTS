using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace todo_app_back_api.Models
{
	public class AppUser : IdentityUser<int>
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public override int Id { get; set; }
		public List<Todo> Todos { get; set; }
		public AppUser()
		{
			Todos = new List<Todo>();
		}
	}
}
