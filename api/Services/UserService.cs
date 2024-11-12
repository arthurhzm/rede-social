using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserModel> Create(UserModel user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                throw new Exception("Este e-mail já está em uso");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}