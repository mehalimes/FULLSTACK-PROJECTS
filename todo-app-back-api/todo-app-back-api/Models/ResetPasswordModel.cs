namespace todo_app_back_api.Models
{
	public class ResetPasswordModel
	{
		public string Email { get; set; }
		public string Token { get; set; }
		public string NewPassword { get; set; }
	}
}
