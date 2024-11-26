using api.Data;
using api.DTO;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class CommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CommentsModel> Update(UpdateCommentDTO model)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == model.Id);

            if (comment == null)
            {
                throw new Exception("Esse comentário não existe ou não existe mais");
            }

            comment.Content = model.Content;
            await _context.SaveChangesAsync();

            return await _context.Comments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == comment.Id);
        }
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                throw new Exception("Esse comentário não existe ou não existe mais");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return new OkResult();
        }
    }
}