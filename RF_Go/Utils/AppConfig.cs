﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Utils
{
    public static class AppConfig
    {
        public const string ApiKey = "123456789987654321";
        public static string ApiBaseUrl { get; } = "https://api.licensing.noobastudio.be";
        //public static string ApiBaseUrl { get; } = "http://localhost:3000";

        public static string AppBaseUrl { get; } = "https://licensing.noobastudio.be";

    }
}
