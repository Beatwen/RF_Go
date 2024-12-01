using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Utils
{ 
    public static class GUID
    {
        public static async Task<string> GetOrCreateDeviceIdentifier()
        {
            const string key = "deviceIdentifier";

            // Vérifiez si un identifiant existe déjà
            var identifier = await SecureStorage.GetAsync(key);

            if (string.IsNullOrEmpty(identifier))
            {
                // Créez un nouvel identifiant unique
                identifier = Guid.NewGuid().ToString();

                // Stockez-le pour les futures utilisations
                await SecureStorage.SetAsync(key, identifier);
            }

            return identifier;
     }
    }
    public class DeviceService
    {
        private readonly HttpClient _httpClient;
        private const string ApiEndpoint = "http://localhost:3000/devices/add";

        public DeviceService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> AddDeviceAsync(string licenseKey)
        {
            var deviceId = await DeviceIdentifier.GetOrCreateDeviceIdentifierAsync();

            var payload = new
            {
                licenseKey,
                deviceId
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync(ApiEndpoint, payload);

                if (response.IsSuccessStatusCode)
                {
                    return "Device added successfully.";
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return $"Error: {response.StatusCode}. Details: {errorContent}";
                }
            }
            catch (Exception ex)
            {
                return $"Error while adding device: {ex.Message}";
            }
        }
    }
    public static class DeviceIdentifier
    {
        public static async Task<string> GetOrCreateDeviceIdentifierAsync()
        {
            const string key = "deviceIdentifier";
            var identifier = await SecureStorage.GetAsync(key);

            if (string.IsNullOrEmpty(identifier))
            {
                identifier = Guid.NewGuid().ToString();
                await SecureStorage.SetAsync(key, identifier);
            }

            return identifier;
        }
    }




}
