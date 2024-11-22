namespace api.DTO
{
    public class CreateCommentDTO
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
    }
}