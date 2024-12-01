using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Utils
{
    public static class TokenStorage
    {
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

        public static void ClearTokensAsync()
        {
            SecureStorage.Remove("access_token");
            SecureStorage.Remove("refresh_token");
        }
    }

}
