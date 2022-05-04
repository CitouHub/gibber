using RateLimitingDemo.UsingCustomMiddleware.Middlewares;

namespace gibbr.API.Middleware
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}