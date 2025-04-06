using System.Text.Json;
using RF_Go.Models.Licensing;

namespace RF_Go.Utils
{
    public static class SecureStorageUtils
    {
        public static async Task SaveUserToSecureStorage(User user)
        {
            var userJson = JsonSerializer.Serialize(user);
            await SecureStorage.SetAsync("user", userJson);
        }
        public static async Task<User> GetUserFromSecureStorage()
        {
            var userJson = await SecureStorage.GetAsync("user");
            if (!string.IsNullOrEmpty(userJson))
            {
                return JsonSerializer.Deserialize<User>(userJson);
            }
            return null;
        }

    }
}
