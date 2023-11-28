using Microsoft.Extensions.Logging;
using RF_Go.Data;
using RF_Go.ViewModels;
using MudBlazor.Services;
using Microsoft.AspNetCore.Components.WebView.Maui;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace RF_Go
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });
            builder.Services.AddMudServices();
            builder.Services.AddMauiBlazorWebView();
            
            builder.Configuration.AddJsonFile("appsettings.json");
            string v_ConnectionString = builder.Configuration.GetConnectionString("StringConnection");

#if DEBUG
            
            builder.Services.AddBlazorWebViewDeveloperTools();
		builder.Logging.AddDebug();
#endif
            builder.Services.AddSingleton<DatabaseContext>();
            builder.Services.AddSingleton<DevicesViewModel>();
            builder.Services.AddSingleton<MainPage>();

            return builder.Build();
        }

    }
}