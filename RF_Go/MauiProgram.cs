using Microsoft.Extensions.Logging;
using RF_Go.Data;
using RF_Go.ViewModels;
using RF_Go.Services.Mapping;
using MudBlazor.Services;
using Microsoft.AspNetCore.Components.WebView.Maui;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection; 
using Microsoft.EntityFrameworkCore;
using RF_Go.Services.Commands;
using RF_Go.Models;
using System.Reflection;
using RF_Go.Services.DeviceHandlers;
using RF_Go.Services.NetworkProtocols;
using SkiaSharp.Views.Maui.Controls.Hosting;
using RF_Go.Utils;
using RF_Go.Services.Api;
using RF_Go.Services;
using CommunityToolkit.Maui;

namespace RF_Go
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            
            // Configuration WebView pour Windows (ESSENTIELLE)
#if WINDOWS
            var userDataFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "RF_Go",
                "WebView2"
            );
            if (!Directory.Exists(userDataFolder))
            {
                try 
                {
                    Directory.CreateDirectory(userDataFolder);
                }
                catch 
                {
                    // Si on ne peut pas créer, utiliser un dossier par défaut
                }
            }
            Environment.SetEnvironmentVariable("WEBVIEW2_USER_DATA_FOLDER", userDataFolder);
#endif
            
            builder
                .UseSkiaSharp()
                .UseMauiApp<App>()
                .UseMauiCommunityToolkit()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });

            builder.Services.AddMudServices();
            builder.Services.AddMauiBlazorWebView();
            builder.Services.AddBlazorWebViewDeveloperTools();
            builder.Services.AddSingleton<DatabaseImportExportService>();

#if DEBUG
            builder.Logging.AddDebug();
#endif

            // Configuration BlazorWebView pour macOS/iOS (MAIS PLUS SÛRE)
#if IOS || MACCATALYST
            try {
                var handlerType = typeof(BlazorWebViewHandler);
                var field = handlerType.GetField("AppOriginUri", BindingFlags.Static | BindingFlags.NonPublic);
                if (field != null) {
                    field.SetValue(null, new Uri("app://localhost/"));
                }
            } catch {
                // Si la réflexion échoue, continuer sans crash
            }
#endif

            builder.Services.AddSingleton<DatabaseContext>();
            builder.Services.AddSingleton<DevicesViewModel>();
            builder.Services.AddScoped<GroupsViewModel>();
            builder.Services.AddScoped<ExclusionChannelViewModel>();
            builder.Services.AddHttpClient<ApiService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<MainPage>();
            builder.Services.AddScoped<FrequencyDataViewModel>();
            builder.Services.AddScoped<ScansViewModel>();
            builder.Services.AddScoped<ScanImportExportService>();
            builder.Services.AddScoped<BackupFrequenciesViewModel>();
            builder.Services.AddScoped<FrequencyCalculationService>();

            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(AppConfig.ApiBaseUrl) });
            builder.Services.AddSingleton<AuthService>();

            // Device data
            builder.Services.AddSingleton(_ => DeviceDataJson.GetDeviceData());
            
            // Device handlers
            builder.Services.AddSingleton<IDeviceHandler, SennheiserDeviceHandler>();
            
            // Command sets
            builder.Services.AddSingleton<IDeviceCommandSet, SennheiserCommandSet>();
            builder.Services.AddSingleton<IDeviceCommandSet, SennheiserG4CommandSet>();
            builder.Services.AddSingleton<IDeviceCommandSet, ShureCommandSet>();
            builder.Services.AddSingleton<SennheiserG4CommandSet>();
            builder.Services.AddSingleton<SennheiserCommandSet>();
            builder.Services.AddSingleton<ShureCommandSet>();
            
            // Communication service (unifié pour tous les types d'appareils)
            builder.Services.AddSingleton<UDPCommunicationService>();
            builder.Services.AddSingleton<TCPCommunicationService>();
            
            // Register device handlers with their correct dependencies
            builder.Services.AddSingleton<SennheiserDeviceHandler>(sp => 
                new SennheiserDeviceHandler(
                    sp.GetRequiredService<UDPCommunicationService>(),
                    sp.GetRequiredService<SennheiserCommandSet>()));
                    
            builder.Services.AddSingleton<SennheiserG4DeviceHandler>(sp => 
                new SennheiserG4DeviceHandler(
                    sp.GetRequiredService<SennheiserG4CommandSet>(), 
                    sp.GetRequiredService<UDPCommunicationService>(), 
                    sp.GetRequiredService<DeviceData>()));
                    
            // Add ShureDeviceHandler registration
            builder.Services.AddSingleton<ShureDeviceHandler>(sp => 
                new ShureDeviceHandler(
                    sp.GetRequiredService<TCPCommunicationService>(),
                    sp.GetRequiredService<ShureCommandSet>()));
                    
            // Register handlers with the interface
            builder.Services.AddSingleton<IDeviceHandler>(sp => sp.GetRequiredService<SennheiserDeviceHandler>());
            builder.Services.AddSingleton<IDeviceHandler>(sp => sp.GetRequiredService<SennheiserG4DeviceHandler>());
            builder.Services.AddSingleton<IDeviceHandler>(sp => sp.GetRequiredService<ShureDeviceHandler>());

            builder.Services.AddSingleton<DeviceMappingService>();
            
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