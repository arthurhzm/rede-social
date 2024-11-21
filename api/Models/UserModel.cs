namespace api.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryTime { get; set; } = DateTime.UtcNow.AddDays(-1);

        public List<PostModel> Posts { get; set; }

        public List<LikeModel> Likes { get; set; }

        public List<CommentsModel> Comments { get; set; }

        public List<FollowModel> Followers { get; set; } = new();
        public List<FollowModel> Following { get; set; } = new();

    }
}