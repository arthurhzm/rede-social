using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api.Data;
using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar usuário: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Erro interno: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<(string token, string refreshToken)> Authenticate(LoginUserDTO model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                throw new Exception("Credenciais inválidas");
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            await _context.SaveChangesAsync();

            return (token, refreshToken);
        }

        public async Task Logout(string refreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null)
            {
                throw new Exception("Token inválido");
            }

            user.RefreshToken = string.Empty;
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetUserByRefreshToken(string refreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null)
            {
                throw new Exception("Token inválido");
            }

            var newToken = GenerateJwtToken(user);
            return newToken;
        }

        public async Task<ProfileDTO> GetByUsername(string username)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Username == username)
                ?? throw new Exception("Usuário não encontrado");

            var followersCount = await _context.Follows.CountAsync(f => f.FollowedId == user.Id);

            return new ProfileDTO
            {
                Id = user.Id,
                Username = user.Username,
                Posts = user.Posts.Select(p => new ProfilePostsDTO { Id = p.Id, Content = p.Content, CreatedAt = p.CreatedAt }).ToList(),
                Followers = followersCount

            };
        }

        public async Task FollowUser(int followerId, int followedId)
        {
            if (followerId == followedId)
                throw new Exception("Você não pode seguir a si mesmo!");

            var alreadyFollowing = await _context.Follows
                .AnyAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (alreadyFollowing)
                throw new Exception("Você já está seguindo este usuário.");

            var follow = new FollowModel
            {
                FollowerId = followerId,
                FollowedId = followedId
            };

            _context.Follows.Add(follow);
            await _context.SaveChangesAsync();

        }

        public async Task<List<ProfileDTO>> GetFollowers(int userId)
        {
            var followers = await _context.Follows
            .Where(f => f.FollowedId == userId)
            .Include(f => f.Follower.Posts)
            .Select(f => f.Follower)
            .ToListAsync();

            var followerProfiles = new List<ProfileDTO>();

            foreach (var follower in followers)
            {
                var followersCount = await _context.Follows.CountAsync(f => f.FollowedId == follower.Id);

                followerProfiles.Add(new ProfileDTO
                {
                    Id = follower.Id,
                    Username = follower.Username,
                    Posts = follower.Posts.Select(p => new ProfilePostsDTO { Id = p.Id, Content = p.Content, CreatedAt = p.CreatedAt }).ToList(),
                    Followers = followersCount
                });
            }

            return followerProfiles;
        }

        public string GenerateJwtToken(UserModel user)
        {
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

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

    }

}