using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Utils
{
    public static class TokenStorage
    {
        private const string AccessTokenKey = "access_token";
        private const string 
            TokenKey = "refresh_token";
        private const string ClientIdKey = "client_id";
        private const string ClientSecretKey = "client_secret";

        public static async Task SaveAccessTokenAsync(string accessToken)
        {
            await SecureStorage.SetAsync("access_token", accessToken);
        }

        public static async Task SaveRefreshTokenAsync(string refreshToken)
        {
            await SecureStorage.SetAsync("refresh_token", refreshToken);
        }

        public static async Task<string> GetAccessTokenAsync()
        {
            return await SecureStorage.GetAsync("access_token");
        }

        public static async Task<string> GetRefreshTokenAsync()
        {
            return await SecureStorage.GetAsync("refresh_token");
        }
        public static async Task<string> GetClientIdAsync()
        {
            return await SecureStorage.GetAsync(ClientIdKey);
        }

        public static async Task SaveClientIdAsync(string clientId)
        {
            await SecureStorage.SetAsync(ClientIdKey, clientId);
        }

        public static async Task<string> GetClientSecretAsync()
        {
            return await SecureStorage.GetAsync(ClientSecretKey);
        }

        public static async Task SaveClientSecretAsync(string clientSecret)
        {
            await SecureStorage.SetAsync(ClientSecretKey, clientSecret);
        }
        public static void ClearTokensAsync()
        {
            SecureStorage.Remove("access_token");
            SecureStorage.Remove("refresh_token");
        }
    }

}
