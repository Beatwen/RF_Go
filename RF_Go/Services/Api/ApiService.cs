using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using RF_Go.Utils;

namespace RF_Go.Services.Api
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(AppConfig.ApiBaseUrl); // Set the base URL
            _httpClient.DefaultRequestHeaders.Add("X-API-KEY", AppConfig.ApiKey); // Add default headers
        }

        private async Task AddSecureStorageHeadersAsync()
        {
            var userKey = await SecureStorage.GetAsync("userKey");
            var licenseKey = await SecureStorage.GetAsync("licenseKey");
            var deviceIdentifier = await GUID.GetOrCreateDeviceIdentifier();
            var token = await SecureStorage.GetAsync("access_token");

            _httpClient.DefaultRequestHeaders.Remove("X-USER-KEY");
            _httpClient.DefaultRequestHeaders.Remove("X-LICENSE-KEY");
            _httpClient.DefaultRequestHeaders.Remove("X-DEVICE-ID");
            _httpClient.DefaultRequestHeaders.Remove("Authorization");

            if (!string.IsNullOrEmpty(userKey))
                _httpClient.DefaultRequestHeaders.Add("X-USER-KEY", userKey);

            if (!string.IsNullOrEmpty(licenseKey))
                _httpClient.DefaultRequestHeaders.Add("X-LICENSE-KEY", licenseKey);

            if (!string.IsNullOrEmpty(deviceIdentifier))
                _httpClient.DefaultRequestHeaders.Add("X-DEVICE-ID", deviceIdentifier);

            if (!string.IsNullOrEmpty(token))
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<T> GetAsync<T>(string endpoint)
        {
            await AddSecureStorageHeadersAsync();
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<T>();
        }

        public async Task<T> PostAsync<T>(string endpoint, object payload)
        {
            await AddSecureStorageHeadersAsync();
            var content = JsonContent.Create(payload);
            var response = await _httpClient.PostAsync(endpoint, content);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<T>();
        }

        public async Task<T> PutAsync<T>(string endpoint, object payload)
        {
            await AddSecureStorageHeadersAsync();

            var content = JsonContent.Create(payload);
            var response = await _httpClient.PutAsync(endpoint, content);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<T>();
        }

        public async Task DeleteAsync(string endpoint)
        {
            await AddSecureStorageHeadersAsync();
            var response = await _httpClient.DeleteAsync(endpoint);
            response.EnsureSuccessStatusCode();
        }
    }
}
