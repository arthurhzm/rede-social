using api.Models;

namespace api.DTO
{
    public class ProfileDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public List<PostModel> Posts { get; set; }

        public int Followers { get; set; }
    }
}