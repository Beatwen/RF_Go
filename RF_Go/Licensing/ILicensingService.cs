using MyApp.Licensing.Models;
namespace MyApp.Licensing;

public interface ILicenseService
{
    Task<bool> ValidateLicenseAsync(string deviceId, string licenseKey);
    Task<bool> RegisterLicenseAsync(string deviceId, string licenseKey);
    License GetLocalLicense();
    void SaveLocalLicense(License license);
}
