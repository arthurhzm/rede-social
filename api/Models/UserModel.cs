namespace api.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime DateTime { get; set; }

    }
}