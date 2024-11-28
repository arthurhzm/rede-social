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
            .Include(p => p.Comments)
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
                }).ToList(),
                Comments = p.Comments.Select(c => new CommentsModel
                {
                    Id = c.Id,
                    Content = c.Content,
                    UserId = c.UserId,
                    createdAt = c.createdAt,
                    User = new UserModel
                    {
                        Username = (from u in _context.Users where u.Id == c.UserId select u.Username).FirstOrDefault()
                    }
                }).ToList()
            })
            .ToArrayAsync();
        }

        public async Task<PostModel[]> GetByContent(string content)
        {
            return await _context.Posts
                .Where(p => EF.Functions.Like(p.Content.ToLower(), $"%{content.ToLower()}%"))
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
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
                    }).ToList(),
                    Comments = p.Comments.Select(c => new CommentsModel
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        createdAt = c.createdAt,
                        User = new UserModel
                        {
                            Username = (from u in _context.Users where u.Id == c.UserId select u.Username).FirstOrDefault()
                        }
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
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == model.PostId && l.UserId == model.UserId);

            if (like == null)
            {
                throw new Exception("Você não curtiu este post");
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<CommentsModel> Comment(CreateCommentDTO model)
        {
            var post = await _context.Posts.FindAsync(model.PostId) ?? throw new Exception("Post não encontrado.");

            var comment = new CommentsModel { PostId = model.PostId, UserId = model.UserId, Content = model.Content };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return await _context.Comments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == comment.Id);
        }

    }
}