namespace api.Models
{
    public class PostModel
    {
        public int Id { get; set; }

        public string Content { get; set; }

        public int UserId { get; set; }

        public UserModel User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}