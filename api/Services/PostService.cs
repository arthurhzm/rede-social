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
            
            return new PostModel
            {
                Id = post.Id,
                Content = post.Content,
                UserId = post.UserId,
                User = new UserModel
                {
                    Username = (await _context.Users.FindAsync(post.UserId)).Username
                }
            };
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

        public async Task<PostModel> Update(UpdatePostDTO model)
        {
            var post = await _context.Posts.FindAsync(model.Id);

            if (post == null)
            {
                throw new Exception("Post não encontrado");
            }

            post.Content = model.Content;
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                throw new Exception("Post não encontrado");
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return new OkResult();
        }

    }
}