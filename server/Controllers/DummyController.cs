using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("DummyController")]
    public class DummyController : Controller
    {
        [HttpGet]
        public JsonResult Index()
        {
            return Json(5);
        }
    }
}
