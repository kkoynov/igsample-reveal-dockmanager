using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Reveal.Sdk;

namespace Server.RevealSDK
{
    public class RevealUserContext : IRevealUserContext
    {
        public string GetUserId(ClaimsPrincipal principal)
        {
            // extract the userId from the principal and return it
            // this would be the userId you get as a parameter

            return "dummyUser";
        }
    }
}
