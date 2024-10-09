namespace Server.Data
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Moderator = "Moderator";
        public const string Member = "Member";
        public const string Camera = "Camera";
        public static readonly List<string> validRoles = new List<string> { Admin, Moderator, Member, Camera };
    }
}