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
using RF_Go.Services.Api;
using MudBlazor;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace RF_Go.Utils
{
    public class AuthService
    {
        private readonly ApiService _apiService;

        public AuthService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<TokenResponse> LoginAsync(string email, string password)
        {
            try
            {
                var payload = new { email, password };

                var tokenResponse = await _apiService.PostAsync<TokenResponse>("auth/login", payload);

                await TokenStorage.SaveAccessTokenAsync(tokenResponse.AccessToken);
                await TokenStorage.SaveRefreshTokenAsync(tokenResponse.RefreshToken);

                return tokenResponse;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Login failed", ex);
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
            try
            {
                var payload = new { refreshToken };

                // Use ApiService to make the POST request
                var tokenResponse = await _apiService.PostAsync<TokenResponse>("auth/refresh", payload);

                await TokenStorage.SaveAccessTokenAsync(tokenResponse.AccessToken);
                await TokenStorage.SaveRefreshTokenAsync(tokenResponse.RefreshToken);

                return tokenResponse.AccessToken;
            }
            catch (HttpRequestException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    return await HandleExpiredRefreshTokenAsync(navigationManager);
                }
                else
                {
                    throw new Exception("Token refresh failed", ex);
                }
            }
        }
        public async Task<RegistrationResponse> RegisterAsync(RegistrationModel registrationModel)
        {
            try
            {
                // Use ApiService to make the POST request
                return await _apiService.PostAsync<RegistrationResponse>("auth/register", registrationModel);
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Registration failed", ex);
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
    public class RegistrationModel
    {
        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName { get; set; } = string.Empty;
        private string email;
        [Required, EmailAddress]
        public string Email
        {
            get => email;
            set => email = value.ToLower();
        }
        [Required] public string Password { get; set; } = string.Empty;
        [Required] public bool AcceptedTerms { get; set; } = false;
    }
    public class TokenResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public int ExpiresIn { get; set; }
        }
    public class RegistrationResponse
    {
        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("user")]
        public UserInfo User { get; set; }

        [JsonPropertyName("client")]
        public ClientInfo Client { get; set; }
    }

    public class UserInfo
    {
        [JsonPropertyName("emailConfirmed")]
        public bool EmailConfirmed { get; set; }

        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("userName")]
        public string UserName { get; set; }

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public string LastName { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("password")]
        public string Password { get; set; }

        [JsonPropertyName("confirmationToken")]
        public string ConfirmationToken { get; set; }

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
    }

    public class ClientInfo
    {
        [JsonPropertyName("clientId")]
        public string ClientId { get; set; }

        [JsonPropertyName("clientSecret")]
        public string ClientSecret { get; set; }
    }

}
