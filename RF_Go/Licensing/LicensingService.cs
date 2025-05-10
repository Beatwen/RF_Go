using System.Net.Http.Json;
using MyApp.Licensing.Models;
using MyApp.Licensing;
using System.Text.Json;


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


}
