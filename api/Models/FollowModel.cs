namespace api.Models
{
    public class FollowModel
    {
        public int FollowerId { get; set; }
        public UserModel Follower { get; set; }

        public int FollowedId { get; set; }
        public UserModel Followed { get; set; }

        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }

}