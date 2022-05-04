using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace RateLimitingDemo.UsingCustomMiddleware.Middlewares;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;

    public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache, IConfiguration configuration)
    {
        _next = next;
        _cache = cache;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var method = context.Request.Method;
        var timeSpanSeconds = _configuration.GetValue<int?>($"Throttling:{method}:TimeSpanMilliseconds");
        var maxRequests = _configuration.GetValue<int?>($"Throttling:{method}:MaxRequests");

        if(timeSpanSeconds is not null && maxRequests is not null)
        {
            var key = GenerateClientKey(context);
            var clientStatistics = UpdateClientStatisticsStorage(key, maxRequests.Value);

            if (clientStatistics != null &&
                (clientStatistics.LastSuccessfulResponseTime - clientStatistics.FirstSuccessfulResponseTime).TotalMilliseconds <= timeSpanSeconds.Value &&
                clientStatistics.NumberOfRequestsCompletedSuccessfully >= maxRequests)
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                return;
            }
        }
        
        await _next(context);
    }

    private static string GenerateClientKey(HttpContext context)
    {
        return $"{context.Request.Path}_{context.Connection.RemoteIpAddress}";
    } 

    private ClientStatistics UpdateClientStatisticsStorage(string key, int maxRequests)
    {
        var clientStat = _cache.Get<ClientStatistics>(key);

        if (clientStat != null)
        {
            clientStat.LastSuccessfulResponseTime = DateTime.UtcNow;

            if (clientStat.NumberOfRequestsCompletedSuccessfully == maxRequests)
            {
                clientStat.FirstSuccessfulResponseTime = DateTime.UtcNow;
                clientStat.NumberOfRequestsCompletedSuccessfully = 0;
            }
            else
            {
                clientStat.NumberOfRequestsCompletedSuccessfully++;
            }

            _cache.Set(key, clientStat);
        }
        else
        {
            clientStat = new ClientStatistics
            {
                FirstSuccessfulResponseTime = DateTime.UtcNow,
                LastSuccessfulResponseTime = DateTime.UtcNow,
                NumberOfRequestsCompletedSuccessfully = 0
            };

            _cache.Set(key, clientStat);
        }

        return clientStat;
    }
}

public class ClientStatistics
{
    public DateTime FirstSuccessfulResponseTime { get; set; }
    public DateTime LastSuccessfulResponseTime { get; set; }
    public int NumberOfRequestsCompletedSuccessfully { get; set; }
}