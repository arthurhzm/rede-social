namespace api.DTO
{
    public class CommentResponseDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }

        public UserDTO User { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserDTO
    {
        public string Username { get; set; }
    }

}