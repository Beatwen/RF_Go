namespace MyApp.Licensing.Models;

public class License
{
    public string DeviceId { get; set; }
    public string LicenseKey { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool IsValid { get; set; }
}
