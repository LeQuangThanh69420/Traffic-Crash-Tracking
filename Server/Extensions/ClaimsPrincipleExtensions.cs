using System.Security.Claims;

namespace Server.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static long GetId(this ClaimsPrincipal obj)
        {
            return long.Parse(obj.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
        
        public static string GetName(this ClaimsPrincipal obj)
        {
            return obj.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static string GetRole(this ClaimsPrincipal obj)
        {
            return obj.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}