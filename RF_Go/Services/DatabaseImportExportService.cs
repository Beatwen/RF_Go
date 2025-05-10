using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Maui.Storage;
using RF_Go.Data;
using System.Collections.Generic;
using CommunityToolkit.Maui.Storage;
using System.Text.Json;
using System.Linq;
using RF_Go.Models;

namespace RF_Go.Services
{
    public class DatabaseImportExportService
    {
        private readonly DatabaseContext _dbContext;

        public DatabaseImportExportService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> ExportDatabaseAsync()
        {
            try
            {
                // Récupérer toutes les données de la base
                var groups = await _dbContext.GetAllAsync<RFGroup>();
                var devices = await _dbContext.GetAllAsync<RFDevice>();
                var exclusionChannels = await _dbContext.GetAllAsync<ExclusionChannel>();
                var frequencyData = await _dbContext.GetAllAsync<FrequencyData>();

                // Créer un objet contenant toutes les données
                var exportData = new
                {
                    Groups = groups,
                    Devices = devices,
                    ExclusionChannels = exclusionChannels,
                    FrequencyData = frequencyData,
                    ExportDate = DateTime.UtcNow
                };

                // Sérialiser en JSON
                var jsonData = JsonSerializer.Serialize(exportData, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                // Convertir en MemoryStream
                using var stream = new MemoryStream();
                using var writer = new StreamWriter(stream);
                await writer.WriteAsync(jsonData);
                await writer.FlushAsync();
                stream.Position = 0;

                // Sauvegarder le fichier
                var result = await FileSaver.Default.SaveAsync("RF_Go_Export.json", stream);
                return result.IsSuccessful;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error exporting database: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ImportDatabaseAsync()
        {
            try
            {
                // Ouvrir le sélecteur de fichier
                var result = await FilePicker.PickAsync(new PickOptions
                {
                    PickerTitle = "Import Database",
                    FileTypes = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>>
                    {
                        { DevicePlatform.WinUI, new[] { ".json" } },
                        { DevicePlatform.Android, new[] { "application/json" } },
                        { DevicePlatform.iOS, new[] { "public.json" } }
                    })
                });

                if (result != null)
                {
                    // Lire le fichier JSON
                    var jsonData = await File.ReadAllTextAsync(result.FullPath);
                    var importData = JsonSerializer.Deserialize<ImportData>(jsonData);

                    if (importData != null)
                    {
                        // Vider les tables existantes
                        await _dbContext.DeleteAllAsync<RFGroup>();
                        await _dbContext.DeleteAllAsync<RFDevice>();
                        await _dbContext.DeleteAllAsync<ExclusionChannel>();
                        await _dbContext.DeleteAllAsync<FrequencyData>();

                        // Dictionary to map old group IDs to new group IDs
                        var groupIdMapping = new Dictionary<int, int>();

                        foreach (var group in importData.Groups)
                        {
                            var oldId = group.ID;
                            group.ID = 0; 
                            await _dbContext.AddItemAsync(group);
                            
                            // Get the new ID and store the mapping
                            var newGroup = await _dbContext.GetAllAsync<RFGroup>();
                            var insertedGroup = newGroup.FirstOrDefault(g => g.Name == group.Name);
                            if (insertedGroup != null)
                            {
                                groupIdMapping[oldId] = insertedGroup.ID;
                            }
                        }

                        foreach (var device in importData.Devices)
                        {
                            if (device.GroupID > 0 && groupIdMapping.ContainsKey(device.GroupID))
                            {
                                device.GroupID = groupIdMapping[device.GroupID];
                            }
                            await _dbContext.AddItemAsync(device);
                        }

                        foreach (var channel in importData.ExclusionChannels)
                        {
                            await _dbContext.AddItemAsync(channel);
                        }

                        foreach (var data in importData.FrequencyData)
                        {
                            await _dbContext.AddItemAsync(data);
                        }

                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error importing database: {ex.Message}");
                return false;
            }
        }

        private class ImportData
        {
            public List<RFGroup> Groups { get; set; }
            public List<RFDevice> Devices { get; set; }
            public List<ExclusionChannel> ExclusionChannels { get; set; }
            public List<FrequencyData> FrequencyData { get; set; }
            public DateTime ExportDate { get; set; }
        }
    }
} 