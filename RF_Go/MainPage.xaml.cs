using RF_Go.ViewModels;

namespace RF_Go
{
    public partial class MainPage : ContentPage
    {
        public MainPage(DevicesViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }
    }
}