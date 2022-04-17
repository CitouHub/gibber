﻿using Microsoft.AspNetCore.Mvc;

namespace Gibber.Web.Controllers
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
                { "API:Version", _configuration.GetValue<string>("API:Version") },
                { "API:BaseURL", _configuration.GetValue<string>("API:BaseURL") },
            };

            return appSettings;
        }
    }
}