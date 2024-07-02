using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_back_api.Models
{
	public class AppUser : IdentityUser<int>
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public override int Id { get; set; }
		public Order Order { get; set; }
		public Cart Cart { get; set; }

		public AppUser()
		{
			Order = new Order();
			Cart = new Cart();
		}
	}
}
