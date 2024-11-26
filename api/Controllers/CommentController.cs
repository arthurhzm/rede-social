using api.DTO;
using api.Filters;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("comments")]
    [ServiceFilter(typeof(AuthFilter))]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpPatch]
        public async Task<IActionResult> Update(UpdateCommentDTO model)
        {
            try
            {
                var comment = await _commentService.Update(model);

                var response = new CommentResponseDTO
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    UserId = comment.UserId,
                    CreatedAt = comment.createdAt,
                    User = new UserDTO
                    {
                        Username = comment.User.Username
                    }
                };
                return Ok(new { data = response });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            try
            {
                await _commentService.Delete(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }
    }
}