using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Diagnostics;
using Microsoft.AspNetCore.Components;

namespace RF_Go.Utils
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<TokenResponse> LoginAsync(string email, string password)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{AppConfig.ApiBaseUrl}/auth/login")
            {
                Content = JsonContent.Create(new { email, password })
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<TokenResponse>(responseContent);
            }
            else
            {
                throw new Exception("Login failed");
            }
        }

        public async Task<string> GetValidAccessTokenAsync(NavigationManager navigationManager = null)
        {
            var accessToken = await TokenStorage.GetAccessTokenAsync();
            var refreshToken = await TokenStorage.GetRefreshTokenAsync();

            if (IsTokenExpired(accessToken))
            {
                accessToken = await RefreshAccessTokenAsync(refreshToken, navigationManager);
            }
            else
            {
                Debug.Print("Token Still Valid");
            }

            return accessToken;
        }

        private bool IsTokenExpired(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            return jwtToken.ValidTo < DateTime.UtcNow;
        }

        private async Task<string> RefreshAccessTokenAsync(string refreshToken, NavigationManager navigationManager)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{AppConfig.ApiBaseUrl}/auth/refresh")
            {
                Content = JsonContent.Create(new { refreshToken })
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseContent);

                await TokenStorage.SaveAccessTokenAsync(tokenResponse.AccessToken);
                await TokenStorage.SaveRefreshTokenAsync(tokenResponse.RefreshToken);

                return tokenResponse.AccessToken;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                return await HandleExpiredRefreshTokenAsync(navigationManager);
            }
            else
            {
                throw new Exception("Token refresh failed");
            }
        }

        private Task<string> HandleExpiredRefreshTokenAsync(NavigationManager navigationManager)
        {
            if (navigationManager != null)
            {
                navigationManager.NavigateTo("/login");
            }
            else
            {
                Debug.WriteLine("NavigationManager is not initialized. Delaying navigation.");
                // Optionally, you can queue the navigation to be executed later.
            }

            return Task.FromResult<string>(null);
        }
    }

        public class TokenResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public int ExpiresIn { get; set; }
        }
    }
