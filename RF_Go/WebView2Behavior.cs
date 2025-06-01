using Microsoft.Maui.Controls;

namespace RF_Go
{
    public class WebView2Behavior : Behavior<Application>
    {
        protected override void OnAttachedTo(Application application)
        {
            base.OnAttachedTo(application);

            // Configuration du dossier utilisateur pour WebView2
            var userDataFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "RF_Go",
                "WebView2"
            );
            Directory.CreateDirectory(userDataFolder);

            // Définir la variable d'environnement pour WebView2
            Environment.SetEnvironmentVariable("WEBVIEW2_USER_DATA_FOLDER", userDataFolder);
        }
    }
} 