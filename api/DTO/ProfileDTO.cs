namespace api.DTO
{
    public class ProfileDTO
    {
        public int Id { get; set; }

        public int Followers { get; set; }
        public string Username { get; set; }
        public List<ProfilePostsDTO> Posts { get; set; }
    }
}