using System.Security.Claims;
using api.DTO;
using api.Filters;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [ApiController]
    [Route("posts")]
    [ServiceFilter(typeof(AuthFilter))]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        public PostController(PostService postService)
        {
            _postService = postService;
        }

        [HttpPost]
        public async Task<ActionResult<PostModel>> Create([FromBody] CreatePostDTO model)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;

                model.UserId = int.Parse(userId);

                var post = await _postService.Create(model);
                return post;
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<PostModel[]>> GetAll()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;

                var posts = await _postService.GetAll();
                return Ok(new { data = new { userId = int.Parse(userId), posts } });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPatch]
        public async Task<ActionResult<PostModel>> Update([FromBody] UpdatePostDTO model)
        {
            try
            {
                var post = await _postService.Update(model);
                return post;
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _postService.Delete(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost]
        [Route("{id}/like")]
        public async Task<IActionResult> Like(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;
                var model = new LikePostDTO { PostId = id, UserId = int.Parse(userId) };
                await _postService.Like(model);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpDelete]
        [Route("{id}/like")]
        public async Task<IActionResult> Unlike(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;
                var model = new LikePostDTO { PostId = id, UserId = int.Parse(userId) };
                await _postService.Unlike(model);
                return NoContent();
            }
            catch (System.Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost]
        [Route("{id}/comment")]
        public async Task<IActionResult> Comment(int id, [FromBody] CreateCommentParamsDTO model)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;
                var commentParams = new CreateCommentDTO { PostId = id, UserId = int.Parse(userId), Content = model.Content };
                var comment = await _postService.Comment(commentParams);

                var response = new CommentResponseDTO
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    UserId = comment.UserId,
                    CreatedAt = comment.createdAt
                };
                return CreatedAtAction(nameof(Comment), new { data = response });
            }
            catch (System.Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }


    }
}