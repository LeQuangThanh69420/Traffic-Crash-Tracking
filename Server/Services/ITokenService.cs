namespace Server.Services
{
    public interface ITokenService
    {
        string CreateToken(long id, string name, string role);
    }
}