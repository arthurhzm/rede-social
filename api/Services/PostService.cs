using api.Data;
using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class PostService
    {
        private readonly AppDbContext _context;

        public PostService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PostModel> Create(CreatePostDTO model)
        {

            var post = new PostModel
            {
                Content = model.Content,
                UserId = model.UserId,
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<PostModel[]> GetAll()
        {
            return await _context.Posts
                .Include(p => p.User)
                .Select(p => new PostModel
                {
                    Id = p.Id,
                    Content = p.Content,
                    UserId = p.UserId,
                    User = new UserModel
                    {
                        Username = p.User.Username
                    }
                })
                .ToArrayAsync();
        }

    }
}