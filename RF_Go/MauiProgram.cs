using Microsoft.Extensions.Logging;
using RF_Go.Data;
using RF_Go.ViewModels;
using MudBlazor.Services;
using Microsoft.AspNetCore.Components.WebView.Maui;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using RF_Go.Services;
using RF_Go.Models;


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

            builder.Services.AddBlazorWebViewDeveloperTools();

#if DEBUG

            builder.Logging.AddDebug();
#endif
            builder.Services.AddScoped<DatabaseContext>();

            builder.Services.AddTransient<DevicesViewModel>();
            builder.Services.AddTransient<GroupsViewModel>();
            builder.Services.AddTransient<ExclusionChannelViewModel>();
            
            builder.Services.AddScoped<MainPage>();
            builder.Services.AddSingleton<DiscoveryService>();
            builder.Services.AddSingleton<ShureDiscoveryService>();
            builder.Services.AddSingleton<SennheiserDiscoveryService>();
            return builder.Build();
        }

    }
}