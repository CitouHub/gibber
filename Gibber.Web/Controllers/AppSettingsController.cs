using Microsoft.AspNetCore.Mvc;

namespace Gibbler.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AppSettingsController : ControllerBase
    {
        private readonly ILogger<AppSettingsController> _logger;

        public AppSettingsController(ILogger<AppSettingsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public Dictionary<string, string> Get()
        {
            throw new NotImplementedException();
        }
    }
}