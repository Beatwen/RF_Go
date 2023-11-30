using RF_Go.Data;
using RF_Go.ViewModels;

namespace RF_Go
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            MainPage = new AppShell();
        }
        protected override void OnStart()
        {
        }
    }
}