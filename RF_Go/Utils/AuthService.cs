using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RF_Go.Utils
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetValidAccessTokenAsync()
        {
            var accessToken = await TokenStorage.GetAccessTokenAsync();

            if (string.IsNullOrEmpty(accessToken) || IsTokenExpired(accessToken))
            {
                var refreshToken = await TokenStorage.GetRefreshTokenAsync();
                if (string.IsNullOrEmpty(refreshToken))
                {
                    throw new Exception("No valid tokens available. User needs to log in.");
                }

                // Refresh the token
                var newAccessToken = await RefreshAccessTokenAsync(refreshToken);
                return newAccessToken;
            }

            return accessToken;
        }

        private bool IsTokenExpired(string token)
        {
            // Implémentez une logique pour vérifier si le token est expiré.
            // Par exemple : stockez la date d'expiration lors de l'obtention du token.
            return false; // Exemple simplifié.
        }

        private async Task<string> RefreshAccessTokenAsync(string refreshToken)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    grant_type = "refresh_token",
                    refresh_token = refreshToken,
                    client_id = "your_client_id",
                    client_secret = "your_client_secret"
                }),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync("https://yourserver.com/auth/token", content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseContent);

                if (tokenResponse != null)
                {
                    await TokenStorage.SaveAccessTokenAsync(tokenResponse.AccessToken);
                    await TokenStorage.SaveRefreshTokenAsync(tokenResponse.RefreshToken);
                    return tokenResponse.AccessToken;
                }
            }

            throw new Exception("Failed to refresh token.");
        }
    }

    public class TokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }

}
