using api.Data;
using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Mvc;

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

    }
}