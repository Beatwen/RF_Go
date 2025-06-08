using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Models;

public class CountrySelectionResult
{
    public string CountryKey { get; set; } = string.Empty;
    public string RegionKey { get; set; } = string.Empty;
    public Country Country { get; set; } = new();
    public Region Region { get; set; } = new();
}
