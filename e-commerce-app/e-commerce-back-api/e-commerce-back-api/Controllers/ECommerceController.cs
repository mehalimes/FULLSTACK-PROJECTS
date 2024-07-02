using e_commerce_back_api.Contexts;
using e_commerce_back_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using CloudinaryDotNet.Core;

namespace e_commerce_back_api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ECommerceController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly ApplicationDbContext _context;
		private readonly Cloudinary _cloudinary;

		public ECommerceController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ApplicationDbContext context, Cloudinary cloudinary)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_context = context;
			_cloudinary = cloudinary;
		}

		[HttpDelete]
		[Route("deleteImage")]
		public async Task<ActionResult> deleteImage([FromBody] PublicIdModel model)
		{
			DeletionParams deletionParams = new DeletionParams(model.PublicID);
			DeletionResult result = await _cloudinary.DestroyAsync(deletionParams);
			if(result.Result == "ok")
			{
				return Ok();
			}
			else
			{
				return BadRequest(result.Error);
			}
		}

		[HttpGet]
		[Route("getAllUsers")]
		public async Task<ActionResult<IEnumerable<string>>> getAllUsers()
		{
			List<string> users = await _userManager.Users.Select(x => x.Email).ToListAsync();
			return users;
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult> login([FromBody] LoginModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				return Unauthorized();
			}
			else
			{
				Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
				if(result.Succeeded)
				{
					Task<string> JWT_TOKEN = generateJwtToken(user);
					return Ok(new { Token = JWT_TOKEN });
				}
				else
				{
					return BadRequest(result);
				}
			}
		}

		[NonAction]
		public async Task<string> generateJwtToken(AppUser user)
		{
			SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")));
			SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			List<Claim> claims = new List<Claim>
			{
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
			};

			JwtSecurityToken token = new JwtSecurityToken(
				issuer: "Mehmet Ali Meşe",
				audience: "E Ticaret Sitesi Kullanıcıları",
				claims: claims,
				expires: DateTime.UtcNow.AddDays(7),
				signingCredentials: credentials
			);

			JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
			string encodedToken = tokenHandler.WriteToken(token);
			return encodedToken;
		}

		[HttpPost]
		[Route("decodeJwtToken")]
		public async Task<ActionResult> decodeJwtToken([FromBody] DecodeModel model)
		{
			JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

			TokenValidationParameters validationParameters = new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY"))),
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidAudience = "E Ticaret Sitesi Kullanıcıları",
				ValidIssuer = "Mehmet Ali Meşe"
			};

			SecurityToken validatedToken;
			string stringToken = model.Token.ToString();
			tokenHandler.ValidateToken(stringToken, validationParameters, out validatedToken);
			return Ok(validatedToken);
		}

		[HttpPost]
		[Route("register")]
		public async Task<ActionResult> register([FromBody] RegisterModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if(user == null)
			{
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
					return Ok(token);
				}
				else
				{
					return BadRequest(result.Errors);
				}
			}
			else
			{
				return BadRequest();
			}
		}

		[HttpGet]
		[Route("logout")]
		public async Task<ActionResult> logout()
		{
			await _signInManager.SignOutAsync();
			return Ok();
		}

		[HttpPost]
		[Route("sendResetPasswordToken")]
		public async Task<ActionResult> sendResetPasswordToken([FromBody] ForgotPasswordModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if(user == null)
			{
				return BadRequest();
			}
			else
			{
				string token = await _userManager.GeneratePasswordResetTokenAsync(user);
				return Ok(token);
			}
		}

		[HttpPost]
		[Route("resetPassword")]
		public async Task<ActionResult> resetPassword([FromBody] ResetPasswordModel model)
		{
			AppUser user = await _userManager.FindByEmailAsync(model.Email);
			if(user == null)
			{
				return BadRequest();
			}
			else
			{
				IdentityResult result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
				if (result.Succeeded)
				{
					return Ok();
				}
				else
				{
					return BadRequest();
				}
			}
		}

		[HttpPost]
		[Route("addProduct")]
		public async Task<ActionResult> addProduct([FromBody] Product model)
		{
			_context.Products.Add(model);
			await _context.SaveChangesAsync();
			return Ok();
		}

		[HttpDelete]
		[Route("deleteProduct")]
		public async Task<ActionResult> deleteProduct([FromBody] IdModel model)
		{
			Product existingProduct = await _context.Products.FindAsync(model.Id);
			if(existingProduct == null)
			{
				return BadRequest();
			}
			else
			{
				_context.Products.Remove(existingProduct);
				await _context.SaveChangesAsync();
				return Ok();
			}
        }

		[HttpPost]
		[Route("addToCart")]
		public async Task<ActionResult> addCart([FromBody] AddToCartModel model)
		{
			AppUser user = await _context.Users.Include(u => u.Cart).FirstOrDefaultAsync(u => u.Id == model.UserId);
			if(user == null)
			{
				return BadRequest();
			}
			Product product = await _context.Products.FindAsync(model.ProductId);
			if (product == null)
			{
				return BadRequest();
			}
			user.Cart.Products.Add(product);
			await _context.SaveChangesAsync();
			return Ok("Product Added SuccessFully");
        }

		[HttpDelete]
		[Route("deleteFromCart")]
		public async Task<ActionResult> deleteFromCart([FromBody] DeleteFromCartModel model)
		{
			return Ok();
        }

		[HttpGet]
		[Route("getAllProducts")]
		public async Task<ActionResult<List<Product>>> getAllProducts()
		{
			return Ok(await _context.Products.ToListAsync());
		}

		[HttpPost]
		[Route("getCartProducts")]
		public async Task<ActionResult> getCartProducts([FromBody] IdModel model)
		{
			return Ok();
		}

		[HttpGet]
		[Route("verifyToken")]
		public async Task<ActionResult> verifyToken([FromQuery] string email, [FromQuery] string token)
		{
			AppUser user = await _userManager.FindByEmailAsync(email);
			if(user == null)
			{
				return BadRequest();
			}
			else
			{
				IdentityResult result = await _userManager.ConfirmEmailAsync(user, token);
				if(result.Succeeded)
				{
					return Ok();
				}
				else
				{
					return BadRequest(result.Errors);
				}
			}
		}

		[HttpPost]
		[Route("adminLogin")]
		public async Task<ActionResult> adminLogin([FromBody] PasswordModel model)
		{
			if(model.Password == "123")
			{
				return Ok();
			}
			else
			{
				return Unauthorized();
			}
		}

		[HttpPost]
		[Route("getProduct")]
		public async Task<ActionResult<Product>> getProduct([FromBody] IdModel model)
		{
			Product product = await _context.Products.FindAsync(model.Id);
			if(product == null)
			{
				return NotFound();
			}
			else
			{
				return Ok(product);
			}
		}

		[HttpPost]
		[Route("submitCart")]
		public async Task<ActionResult> submitCart([FromBody] SubmitCartModel model)
		{
			return Ok();
		}

		[HttpPost]
		[Route("getOrder")]
		public async Task<ActionResult> getOrder([FromBody] IdModel model)
		{
			return Ok();
		}
	}
}
