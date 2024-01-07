using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
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
		public ActionResult<IEnumerable<AppUser>> getAllUsers()
		{
			return Ok(_userManager.Users.ToList());
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult> login([FromBody] SignInModel model)
		{
			AppUser user = await _userManager.FindByNameAsync(model.Username);
			if (user == null)
			{
				return Unauthorized("Kullanıcı Adı Veya Şifre Yanlış");
			}
			else
			{
				if(user.PhoneNumberConfirmed == false || user.EmailConfirmed == false)
				{
					return BadRequest("Kullanıcı Doğrulanmamış");
				}
				else
				{
					var result = await _signInManager.PasswordSignInAsync(user, model.Password, true, false);
					if (result.Succeeded)
					{
						var jwtToken = GenerateJwtToken(user);
						return Ok(new { Token = jwtToken });
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
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TopSecretTomCruiseKeyNoOneCanBreakThisIAmSure"));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, user.UserName)
			};
			var token = new JwtSecurityToken(
				issuer: "TodoApp",
				audience: "TodoAppUsers",
				claims: claims,
				expires: DateTime.MaxValue,
				signingCredentials: credentials
			);
			var tokenHandler = new JwtSecurityTokenHandler();
			var encodedToken = tokenHandler.WriteToken(token);
			return encodedToken;
		}

		[HttpPost]
		[Route("decodeJwtToken")]
		public string DecodeJwtToken([FromBody] DecodeJwtTokenModel token)
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var validationParameters = new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TopSecretTomCruiseKeyNoOneCanBreakThisIAmSure")),
				ValidateIssuer = false,
				ValidateAudience = false
			};
			SecurityToken validatedToken;
			var stringToken = token.Token.ToString();
			var principal = tokenHandler.ValidateToken(stringToken, validationParameters, out validatedToken);
			var claims = ((ClaimsIdentity)principal.Identity).Claims;
			var targetClaim = claims.ElementAt(0);
			return targetClaim.Subject.Name.ToString();
		}

		[HttpPost]
		[Route("register")]
		public async Task<ActionResult> register([FromBody] RegisterModel model)
		{
			AppUser user = await _userManager.FindByNameAsync(model.Username);
			if(user == null)
			{
				AppUser newUser = new AppUser
				{
					Id = Guid.NewGuid().ToString(),
					UserName = model.Username,
					EmailConfirmed = false,
					SecurityStamp = Guid.NewGuid().ToString()
				};
				var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
				newUser.EmailConfirmationToken = token;

				var smtpClient = new SmtpClient("smtp.gmail.com")
				{
					Port = 587,
					Credentials = new NetworkCredential("Your Gmail", "Your application password"),
					EnableSsl = true,
				};
				var mailMessage = new MailMessage
				{
					From = new MailAddress("Your Gmail"),
					Subject = "Verify",
					Body = $"<h1>Verify Token</h1><br/><p>{token}</p>",
					IsBodyHtml = true,
				};
				mailMessage.To.Add(model.Username);
				smtpClient.Send(mailMessage);
				var result = await _userManager.CreateAsync(newUser, model.Password);

				if (result.Succeeded)
				{
					return Ok(result);
				}
				else
				{
					return BadRequest(result.Errors);
				}
			}
			else
			{
				return BadRequest("Kullanıcı Zaten Mevcut.");
			}
		}

		[HttpPost]
		[Route("logout")]
		public async Task<ActionResult> logOut()
		{
			await _signInManager.SignOutAsync();
			return Ok("Başarıyla Çıkış Yapıldı.");
		}

		[HttpPost]
		[Route("verify")]
		public async Task<ActionResult> verify([FromBody] VerifyModel model)
		{
			AppUser userExists = await _userManager.FindByNameAsync(model.Username);
			if(userExists != null && userExists.EmailConfirmationToken == model.Token)
			{
				userExists.EmailConfirmed = true;
				userExists.PhoneNumberConfirmed = true;
				var result = await _userManager.UpdateAsync(userExists);
				if(result.Succeeded)
				{
					return Ok(userExists);
				}
				else
				{
					return BadRequest(result.Errors);
				}
			}
			else
			{
				return BadRequest("Doğrulanamadı");
			}
		}

		[HttpPost]
		[Route("getAllTodos")]
		public async Task<ActionResult<IEnumerable<Todo>>> getAllTodos([FromBody] GetAllTodosModel model)
		{
			var todos = await _context.Todos.Where(x => x.Email == model.Email).ToListAsync();
			return Ok(todos);
		}

		[HttpPost]
		[Route("addTodo")]
		public async Task<ActionResult> addTodo([FromBody] Todo todo)
		{
			_context.Todos.Add(todo);
			await _context.SaveChangesAsync();
			return Ok("Successfully Added");
		}

		[HttpPost]
		[Route("putTodo")]
		public async Task<ActionResult> putTodo([FromBody] UpdateTodoModel todo)
		{
			Todo existingTodo = _context.Todos.FirstOrDefault(x => x.Email == todo.EmailFirst && x.TodoItem == todo.TodoItemFirst);
			if (existingTodo == null)
			{
				return BadRequest("Böyle bir todo yok");
			}
			else
			{
				existingTodo.TodoItem = todo.TodoItemSecond;
				existingTodo.Email = todo.EmailSecond;
				_context.Todos.Update(existingTodo);
				await _context.SaveChangesAsync();
				return Ok("Todo Güncellendi.");
			}
		}

		[HttpPost]
		[Route("deleteTodo")]
		public async Task<ActionResult> deleteTodo([FromBody] Todo todo)
		{
			Todo existingTodo = await _context.Todos.FirstOrDefaultAsync(x => x.TodoItem == todo.TodoItem && x.Email == todo.Email);
			if(existingTodo == null)
			{
				return BadRequest("Böyle bir todo yok delete");
			}
            else
            {
				_context.Todos.Remove(existingTodo);
				await _context.SaveChangesAsync();
				return Ok("Todo Başarıyla Silindi");
            }
        }

		[HttpPost]
		[Route("forgotPassword")]
		public async Task<ActionResult> forgotPassword([FromBody] ForgotPasswordModel model)
		{
			AppUser user = await _userManager.FindByNameAsync(model.Email);
			if(user == null)
			{
				return BadRequest("Kullanıcı Bulunamadı");
			}
			var token = await _userManager.GeneratePasswordResetTokenAsync(user);
			var smtpClient = new SmtpClient("smtp.gmail.com")
			{
				Port = 587,
				Credentials = new NetworkCredential("Your Gmail", "Your application password"),
				EnableSsl = true,
			};
			var mailMessage = new MailMessage
			{
				From = new MailAddress("Your Gmail"),
				Subject = "Verify",
				Body = $"<h1>Forgot Password Token</h1><br/><p>{token}</p>",
				IsBodyHtml = true,
			};
			mailMessage.To.Add(model.Email);
			smtpClient.Send(mailMessage);
			return Ok("Forgot Password Token gönderildi");
		}

		[HttpPost]
		[Route("resetPassword")]
		public async Task<ActionResult> resetPassword([FromBody] ResetPasswordModel model)
		{
			AppUser user = await _userManager.FindByNameAsync(model.Email);
			if(user != null)
			{
				var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
                if(result.Succeeded)
				{
					return Ok("Şifre Başarıyla Sıfırlandı");
				}
				else
				{
					return BadRequest("Şifre Sıfırlanamadı");
				}
			}
			else
			{
				return BadRequest("Kullanıcı Bulunamadı");
			}
		}
	}
}
