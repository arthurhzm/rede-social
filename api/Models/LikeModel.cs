namespace api.Models
{
    public class LikeModel
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public PostModel Post { get; set; }
        public int UserId { get; set; }
        public UserModel User { get; set; }

        public DateTime createdAt { get; set; } = DateTime.UtcNow;

    }
}