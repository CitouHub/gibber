using Microsoft.AspNetCore.Mvc;

namespace gibbr.Web.Controllers
{
    [Route("api/[controller]")]
    public class AppSettingsController : Controller
    {
        private readonly IConfiguration _configuration;

        public AppSettingsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public Dictionary<string, string> GetPublicAppSettings()
        {
            var appSettings = new Dictionary<string, string>
            {
                { "API:BaseURL", _configuration.GetValue<string>("API:BaseURL") },
                { "User:IdLength", _configuration.GetValue<string>("User:IdLength") },
            };

            return appSettings;
        }
    }
}