using Microsoft.Extensions.Logging;
using RF_Go.Data;
using RF_Go.ViewModels;
using RF_Go.Services.Mapping;
using MudBlazor.Services;
using Microsoft.AspNetCore.Components.WebView.Maui;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using RF_Go.Services.Commands;
using RF_Go.Models;
using System.Reflection;
using RF_Go.Services.DeviceHandlers;
using RF_Go.Services.NetworkProtocols;
using SkiaSharp.Views.Maui.Controls.Hosting;
using RF_Go.Utils;


namespace RF_Go
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseSkiaSharp()
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

#if IOS || MACCATALYST
            var handlerType = typeof(BlazorWebViewHandler);
            var field = handlerType.GetField("AppOriginUri", BindingFlags.Static | BindingFlags.NonPublic) ?? throw new Exception("AppOriginUri field not found");
            field.SetValue(null, new Uri("app://localhost/"));
#endif

#endif
            builder.Services.AddScoped<DatabaseContext>();
            builder.Services.AddSingleton<DevicesViewModel>();
            builder.Services.AddTransient<GroupsViewModel>();
            builder.Services.AddTransient<ExclusionChannelViewModel>();
            builder.Services.AddScoped<MainPage>();
            builder.Services.AddSingleton<ChartViewModel>();



            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(AppConfig.ApiBaseUrl) });
            builder.Services.AddSingleton<AuthService>();

            builder.Services.AddSingleton<IDeviceHandler, SennheiserDeviceHandler>();
            builder.Services.AddSingleton<IDeviceCommandSet, SennheiserCommandSet>();
            builder.Services.AddSingleton<UDPCommunicationService>();
            builder.Services.AddSingleton<DeviceMappingService>();
            builder.Services.AddSingleton<SennheiserDeviceHandler>();
            builder.Services.AddSingleton<ShureDiscoveryService>();
            builder.Services.AddSingleton<SennheiserDiscoveryService>();

            // Enregistrer DiscoveryService avec ses dépendances
            builder.Services.AddSingleton<DiscoveryService>(provider =>
            {
                var handlers = provider.GetServices<IDeviceHandler>().ToList();
                var devicesViewModel = provider.GetRequiredService<DevicesViewModel>();
                var discoveryService = new DiscoveryService(handlers, devicesViewModel);
                return discoveryService;
            });

            return builder.Build();
        }
    }
}