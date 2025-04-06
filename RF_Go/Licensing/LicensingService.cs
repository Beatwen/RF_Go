using System.Net.Http.Json;
using MyApp.Licensing.Models;
using MyApp.Licensing;
using Newtonsoft.Json;

namespace MyApp.Licensing;

public class LicenseService : ILicenseService
{
    private readonly HttpClient _httpClient;
    private const string ApiBaseUrl = "https://rfgo.com/api";

    public LicenseService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> ValidateLicenseAsync(string deviceId, string licenseKey)
    {
        var response = await _httpClient.PostAsJsonAsync($"{ApiBaseUrl}/validate", new
        {
            deviceId,
            licenseKey
        });

        return response.IsSuccessStatusCode;
    }

    public async Task<bool> RegisterLicenseAsync(string deviceId, string licenseKey)
    {
        var response = await _httpClient.PostAsJsonAsync($"{ApiBaseUrl}/register", new
        {
            deviceId,
            licenseKey
        });

        return response.IsSuccessStatusCode;
    }

    public License GetLocalLicense()
    {
        // Simule l'utilisation de SecureStorage de MAUI
        var json = Preferences.Get("localLicense", null);
        return json == null ? null : JsonConvert.DeserializeObject<License>(json);
    }

    public void SaveLocalLicense(License license)
    {
        var json = JsonConvert.SerializeObject(license);
        Preferences.Set("localLicense", json);
    }
}
