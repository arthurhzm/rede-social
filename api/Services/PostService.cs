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
            .Include(p => p.Likes)
            .Select(p => new PostModel
            {
                Id = p.Id,
                Content = p.Content,
                UserId = p.UserId,
                User = new UserModel
                {
                    Username = p.User.Username
                },
                Likes = p.Likes.Select(l => new LikeModel
                {
                    UserId = l.UserId
                }).ToList()
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

        public async Task<IActionResult> Like(LikePostDTO model)
        {
            if (await _context.Likes.AnyAsync(l => l.UserId == model.UserId && l.PostId == model.PostId))
            {
                throw new Exception("Você já curtiu este post");
            }

            var like = new LikeModel { PostId = model.PostId, UserId = model.UserId };
            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> Unlike(LikePostDTO model)
        {
            var like = await _context.Likes.FindAsync(model.PostId, model.UserId);

            if (like == null)
            {
                throw new Exception("Você não curtiu este post");
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            return new OkResult();
        }

    }
}