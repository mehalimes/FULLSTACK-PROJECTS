using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using todo_app_back_api.Models;
using todo_app_back_api.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace todo_app_back_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TodoAppController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly ApplicationDbContext _context;
		public TodoAppController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ApplicationDbContext context)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_context = context;
		}

		[HttpGet]
		[Route("getAllUsers")]
		public ActionResult<List<AppUser>> getAllUsers()
		{
			return Ok(_userManager.Users.ToList());
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult<string>> login([FromBody] SignInModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				return Unauthorized("Kullanıcı Adı Veya Şifre Yanlış");
			}
			else
			{
				if(user.EmailConfirmed == false)
				{
					return BadRequest("Kullanıcı Doğrulanmamış");
				}
				else
				{
					Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(user, model.Password, true, false);
					if (result.Succeeded)
					{
						string jwtToken = GenerateJwtToken(user);
						return Ok(jwtToken);
					}
					else
					{
						return BadRequest(result);
					}
				}
			}
		}
		[NonAction]
		public string GenerateJwtToken(AppUser user)
		{
			SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TopSecretTomCruiseKeyNoOneCanBreakThisIAmSure"));
			SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
			List<Claim> claims = new List<Claim>
			{
				new Claim(ClaimTypes.Email, user.Email)
			};
			JwtSecurityToken token = new JwtSecurityToken(
				issuer: "TodoAppAdmin",
				audience: "TodoAppUsers",
				claims: claims,
				expires: DateTime.MaxValue,
				signingCredentials: credentials
			);
			JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
			string encodedToken = tokenHandler.WriteToken(token);
			return encodedToken;
		}

		[HttpPost]
		[Route("decodeJwtToken")]
		public async Task<ActionResult> DecodeJwtToken([FromBody] DecodeJwtTokenModel token)
		{
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            TokenValidationParameters validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TopSecretTomCruiseKeyNoOneCanBreakThisIAmSure")),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = "TodoAppUsers",
                ValidIssuer = "TodoAppAdmin"
            };

            SecurityToken validatedToken;

			ClaimsPrincipal principal = tokenHandler.ValidateToken(token.Token, validationParameters, out validatedToken);
			JwtSecurityToken jwtToken = validatedToken as JwtSecurityToken;
			string emailClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
			if (string.IsNullOrEmpty(emailClaim))
			{
				return BadRequest("Token doesnt contain email claim");
			}
			return Ok(new { Email = emailClaim });
        }

		[HttpPost]
		[Route("register")]
		public async Task<ActionResult<string>> register([FromBody] RegisterModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if(user != null)
			{
				return BadRequest("Kullanıcı bulundu.");
			}

			AppUser newUser = new AppUser
			{
				UserName = model.Email,
				Email = model.Email,
				EmailConfirmed = false
			};

			IdentityResult result = await _userManager.CreateAsync(newUser, model.Password);
			if (result.Succeeded)
			{
				string token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                await _context.SaveChangesAsync();
                return Ok(token);
			}

			await _context.SaveChangesAsync();
			return BadRequest(result.Errors);
		}

		[HttpPost]
		[Route("logout")]
		public async Task<ActionResult> logOut()
		{
			await _signInManager.SignOutAsync();
			return Ok("Başarıyla Çıkış Yapıldı.");
		}

		[HttpPost]
		[Route("getAllTodos")]
		public async Task<ActionResult<List<Todo>>> getAllTodos([FromBody] GetAllTodosModel model)
		{
			List<Todo> todos = await _context.Todos.Where(x => x.Email == model.Email).ToListAsync();
			return Ok(todos);
		}

		[HttpPost]
		[Route("addTodo")]
		public async Task<ActionResult> addTodo([FromBody] AddTodoModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			Todo newTodo = new Todo
			{
				Content = model.Content,
				Email = model.Email,
				User = user
			};
			user.Todos.Add(newTodo);
			await _context.SaveChangesAsync();
			return Ok("Başarıyla eklendi.");
		}

		[HttpPut]
		[Route("putTodo")]
		public async Task<ActionResult> putTodo([FromBody] PutTodoModel model)
		{
			Todo existingTodo = await _context.Todos.FindAsync(model.Id);
			existingTodo.Content = model.Content;
			_context.Todos.Update(existingTodo);
			await _context.SaveChangesAsync();
			return Ok("Başarıyla Güncellendi.");
		}

		[HttpDelete]
		[Route("deleteTodo")]
		public async Task<ActionResult> deleteTodo([FromBody] IdModel IdObject)
		{
			Todo existingTodo = await _context.Todos.FindAsync(IdObject.Id);
			_context.Todos.Remove(existingTodo);
			await _context.SaveChangesAsync();
			return Ok("Başarıyla Silindi.");
        }

		[HttpPost]
		[Route("verifyToken")]
		public async Task<ActionResult> verifyToken([FromBody] VerifyModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				return BadRequest("User could'nt find.");
			}
			IdentityResult result = await _userManager.ConfirmEmailAsync(user, model.Token);
			if (result.Succeeded)
			{
				return Ok("Email Confirmed Successfully");
			}
			return BadRequest("Could'nt confirm.");
		}

		[HttpPost]
		[Route("passwordResetToken")]
		public async Task<ActionResult<string>> passwordResetToken([FromBody] EmailModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
			return Ok(resetToken);
		}


		[HttpPost]
		[Route("changePassword")]
		public async Task<ActionResult> changePassword([FromBody] ChangePasswordModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			IdentityResult result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
			if(result.Succeeded)
			{
                await _context.SaveChangesAsync();
                return Ok("Password changed.");
			}
            await _context.SaveChangesAsync();
			return BadRequest("Password could'nt change.");
        }
	}
}
