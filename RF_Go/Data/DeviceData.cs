using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace RF_Go.Data
{
    public class DeviceData
    {
        // A FAIRE : Cet objet pourrait repéresenter model, brands, et frequency plutôt qu'une liste de liste..
        [JsonPropertyName("brands")]
        public Dictionary<string, Dictionary<string, Dictionary<string, List<int>>>> Brands { get; set; }
    }
}
