using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<UserModel>> Create([FromBody] CreateUserDTO model)
        {
            try
            {
                var user = await _userService.Create(model);
                return user;
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost("auth")]
        public async Task<ActionResult<UserModel>> Authenticate([FromBody] LoginUserDTO model)
        {
            try
            {
                var (token, refreshToken) = await _userService.Authenticate(model);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7),
                };

                Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

                return Ok(new { data = new { token } });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

    }
}