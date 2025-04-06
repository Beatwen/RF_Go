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
        private readonly NavigationManager _navigationManager;

        public AuthService(HttpClient httpClient, NavigationManager navigationManager)
        {
            _httpClient = httpClient;
            _navigationManager = navigationManager;
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

        public async Task<string> GetValidAccessTokenAsync()
        {
            var accessToken = await TokenStorage.GetAccessTokenAsync();
            var refreshToken = await TokenStorage.GetRefreshTokenAsync();

            if (IsTokenExpired(accessToken))
            {
                accessToken = await RefreshAccessTokenAsync(refreshToken);
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

        private async Task<string> RefreshAccessTokenAsync(string refreshToken)
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
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                return await HandleExpiredRefreshTokenAsync();
            }
            else
            {
                throw new Exception("Token refresh failed");
            }
        }

        private Task<string> HandleExpiredRefreshTokenAsync()
        {
            _navigationManager.NavigateTo("/login");
            return null;
        }
    }

        public class TokenResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public int ExpiresIn { get; set; }
        }
    }
