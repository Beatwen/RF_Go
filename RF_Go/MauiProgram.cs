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

#if IOS || MACCATALYST
                var handlerType = typeof(BlazorWebViewHandler);
                var field = handlerType.GetField("AppOriginUri", BindingFlags.Static | BindingFlags.NonPublic) ?? throw new Exception("AppOriginUri field not found");
                field.SetValue(null, new Uri("app://localhost/"));
#endif

#endif
            builder.Services.AddScoped<DatabaseContext>();

            // Enregistrer DevicesViewModel en tant que singleton
            builder.Services.AddSingleton<DevicesViewModel>();

            // Enregistrer les autres ViewModels
            builder.Services.AddTransient<GroupsViewModel>();
            builder.Services.AddTransient<ExclusionChannelViewModel>();

            // Enregistrer les pages
            builder.Services.AddScoped<MainPage>();

            // Enregistrer les services et handlers
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