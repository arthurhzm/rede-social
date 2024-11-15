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

        public int Followers { get; set; } = 0;

    }
}