using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace todo_app_back_api.Models
{
	public class Todo
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string Content { get; set; }
		public string Email { get; set; }
		public AppUser User { get; set; }
	}
}
