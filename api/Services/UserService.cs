using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Data;
using api.DTO;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public UserService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<UserModel> Create(CreateUserDTO model)
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                throw new Exception("Este e-mail já está em uso");
            }

            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                throw new Exception("Este nome de usuário já está em uso");
            }

            var user = new UserModel
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string> Authenticate(LoginUserDTO model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                throw new Exception("Credenciais inválidas");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["Jwt:Key"];

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
    }
}