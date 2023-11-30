using RF_Go.ViewModels;

namespace RF_Go
{
    public partial class MainPage : ContentPage
    {
        private readonly DevicesViewModel _viewModel;
        public MainPage(DevicesViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }
    }
}