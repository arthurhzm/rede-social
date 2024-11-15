using System.Security.Claims;
using api.DTO;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var token = await _userService.GetUserByRefreshToken(refreshToken);
            return Ok(new { data = new { token } });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            await _userService.Logout(refreshToken);
            return Ok(new { message = "Logout realizado com sucesso" });
        }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<UserModel>> GetByUsername(string username)
        {
            var user = await _userService.GetByUsername(username);
            return Ok(new { data = user });
        }

        [HttpPost("{followedId}/follow")]
        public async Task<IActionResult> Follow(int followedId)
        {
            try
            {
                var followerId = User.FindFirst(ClaimTypes.Name)?.Value;

                if (followerId.IsNullOrEmpty())
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }
                await _userService.FollowUser(int.Parse(followerId), followedId);
                return Ok(new { message = "Agora você está seguindo este usuário." });

            }
            catch (System.Exception e)
            {

                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet("{id}/followers")]
        public async Task<ActionResult<int>> GetFollowers(int id)
        {
            var followers = await _userService.GetFollowers(id);
            return Ok(new { data = followers });
        }
    }
}