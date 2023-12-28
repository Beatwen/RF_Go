using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Data
{
    public class DeviceData
    {
        public Dictionary<string, Dictionary<string, Dictionary<string, List<int>>>> Brands { get; set; }
    }
}
