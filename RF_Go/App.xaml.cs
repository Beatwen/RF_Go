using RF_Go.Data;
using RF_Go.ViewModels;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Controls.Xaml;

namespace RF_Go
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            // Configurer WebView2 pour utiliser un dossier utilisateur
            var userDataFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "RF_Go",
                "WebView2"
            );
            Directory.CreateDirectory(userDataFolder);

            MainPage = new AppShell();
        }
        protected override void OnStart()
        {
        }
    }
}