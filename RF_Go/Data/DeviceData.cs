using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Data
{
    public class DeviceData
    {
        // A FAIRE : Cet objet pourrait repéresenter model, brands, et frequency plutôt qu'une liste de liste..
        public Dictionary<string, Dictionary<string, Dictionary<string, List<int>>>> Brands { get; set; }
    }
}
