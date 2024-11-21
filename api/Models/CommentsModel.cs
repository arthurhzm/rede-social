namespace api.Models
{
    public class CommentsModel
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public PostModel Post { get; set; }
        public int UserId { get; set; }
        public UserModel User { get; set; }
        public string Content { get; set; }
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}