using System.Text.Json;
using RF_Go.Data;

public static class CountryDataJson
{
    public static string Countries = """
    {
        "countries": {
            "France": {
                "name": "France",
                "channelDivision": "Generic-8MHz",
                "regions": {
                    "National": {
                        "name": "National",
                        "allowedChannels": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 65],
                        "description": "Canaux TV autorisés en France (470-694 MHz + 823-832 MHz)"
                    }
                }
            },
            "Belgique": {
                "name": "Belgique",
                "channelDivision": "Generic-8MHz",
                "regions": {
                    "National": {
                        "name": "National (sans licence)",
                        "allowedChannels": [27, 29],
                        "description": "Canaux autorisés sans licence en Belgique"
                    },
                    "Hainaut": {
                        "name": "Hainaut",
                        "allowedChannels": [27],
                        "description": "Canaux autorisés dans le Hainaut"
                    }
                }
            },
            "Allemagne": {
                "name": "Allemagne",
                "channelDivision": "Generic-8MHz",
                "regions": {
                    "National": {
                        "name": "National (License Free)",
                        "allowedChannels": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 54, 55],
                        "description": "Allemagne License Free: 470-608 MHz (Ch.21-36), 614-698 MHz (Ch.38-49), 736-753 MHz (Ch.54-55), 823-832 MHz - 50mW ERP"
                    }
                }
            },
            "Pays-Bas": {
                "name": "Pays-Bas",
                "channelDivision": "Generic-8MHz",
                "regions": {
                    "National": {
                        "name": "National (License Free)",
                        "allowedChannels": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 54, 55],
                        "description": "Pays-Bas License Free: 470-604 MHz (Ch.21-36), 614-694 MHz (Ch.38-48), 736-753 MHz (Ch.54-55), 823-832 MHz - 50mW ERP"
                    }
                }
            },
            "États-Unis": {
                "name": "États-Unis",
                "channelDivision": "Generic-6MHz",
                "regions": {
                    "National": {
                        "name": "National (License Exempt)",
                        "allowedChannels": [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 45],
                        "description": "USA License Exempt: 470-608 MHz (Ch.14-36), 614-616 MHz (Ch.38 partial), 657-663 MHz (Ch.45 partial) - 50mW EIRP"
                    }
                }
            }
        }
    }
    """;

    public static CountryData GetCountryData()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Deserialize<CountryData>(Countries, options);
    }
}

public class CountryData
{
    public Dictionary<string, Country> Countries { get; set; } = new();
}

public class Country
{
    public string Name { get; set; } = string.Empty;
    public string ChannelDivision { get; set; } = string.Empty;
    public Dictionary<string, Region> Regions { get; set; } = new();
}

public class Region
{
    public string Name { get; set; } = string.Empty;
    public List<int> AllowedChannels { get; set; } = new();
    public string Description { get; set; } = string.Empty;
} 