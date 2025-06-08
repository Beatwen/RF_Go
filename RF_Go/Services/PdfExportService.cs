using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Maui.Storage;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RF_Go.Models;
using RF_Go.ViewModels;
using CommunityToolkit.Maui.Storage;
using PdfColors = QuestPDF.Helpers.Colors;
using PdfFonts = QuestPDF.Helpers.Fonts;
using PdfContainer = QuestPDF.Infrastructure.IContainer;

namespace RF_Go.Services
{
    public class PdfExportService
    {
        public async Task<bool> ExportDevicesToPdfAsync(
            DevicesViewModel devicesViewModel, 
            GroupsViewModel groupsViewModel, 
            ExportOptions options)
        {
            try
            {
                QuestPDF.Settings.License = LicenseType.Community;
                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(40);
                        page.DefaultTextStyle(x => x.FontSize(11).FontFamily(PdfFonts.Calibri));

                        page.Header().Element(container => ComposeHeader(container, options));
                        page.Content().Element(container => ComposeContent(container, devicesViewModel, groupsViewModel, options));
                        page.Footer().Element(ComposeFooter);
                    });
                });

                using var stream = new MemoryStream();
                document.GeneratePdf(stream);
                stream.Position = 0;

                var fileName = $"RF_Go_Export_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.pdf";
                var result = await FileSaver.Default.SaveAsync(fileName, stream);
                return result.IsSuccessful;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error exporting PDF: {ex.Message}");
                return false;
            }
        }

        private void ComposeHeader(PdfContainer container, ExportOptions options)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text(options.PdfTitle)
                        .FontSize(24)
                        .Bold()
                        .FontColor(PdfColors.Blue.Medium);

                    column.Item().Text($"Generated on {DateTime.Now:dddd, MMMM dd, yyyy 'at' HH:mm}")
                        .FontSize(10)
                        .FontColor(PdfColors.Grey.Medium);
                });

                row.ConstantItem(100).Height(50).Placeholder();
            });
        }

        private void ComposeContent(PdfContainer container, DevicesViewModel devicesViewModel, 
            GroupsViewModel groupsViewModel, ExportOptions options)
        {
            container.PaddingVertical(20).Column(column =>
            {
                // Summary section
                column.Item().Element(container => ComposeSummary(container, devicesViewModel, groupsViewModel));
                column.Item().PaddingTop(20);

                // Devices section
                if (options.GroupByDeviceType)
                {
                    column.Item().Element(container => ComposeDevicesByType(container, devicesViewModel, groupsViewModel, options));
                }
                else
                {
                    column.Item().Element(container => ComposeDevicesByGroup(container, devicesViewModel, groupsViewModel, options));
                }
            });
        }

        private void ComposeSummary(PdfContainer container, DevicesViewModel devicesViewModel, GroupsViewModel groupsViewModel)
        {
            container.Column(column =>
            {
                column.Item().Text("Summary")
                    .FontSize(18)
                    .Bold()
                    .FontColor(PdfColors.Blue.Medium);

                column.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text($"Total Devices: {devicesViewModel.Devices.Count}")
                            .SemiBold();
                        col.Item().Text($"Total Groups: {groupsViewModel.Groups.Count}")
                            .SemiBold();
                        col.Item().Text($"Total Channels: {devicesViewModel.Devices.Sum(d => d.Channels.Count)}")
                            .SemiBold();
                    });

                    row.RelativeItem().Column(col =>
                    {
                        var deviceTypes = devicesViewModel.Devices
                            .GroupBy(d => $"{d.Brand} {d.Model}")
                            .Count();
                        col.Item().Text($"Device Types: {deviceTypes}")
                            .SemiBold();
                        
                        var syncedDevices = devicesViewModel.Devices.Count(d => d.IsSynced);
                        col.Item().Text($"Synced Devices: {syncedDevices}")
                            .SemiBold();
                    });
                });
            });
        }

        private void ComposeDevicesByGroup(PdfContainer container, DevicesViewModel devicesViewModel, 
            GroupsViewModel groupsViewModel, ExportOptions options)
        {
            container.Column(column =>
            {
                column.Item().Text("Devices by Group")
                    .FontSize(18)
                    .Bold()
                    .FontColor(PdfColors.Blue.Medium);

                var devicesByGroup = devicesViewModel.Devices.GroupBy(d => d.GroupID);

                foreach (var group in devicesByGroup)
                {
                    var groupName = groupsViewModel.Groups.FirstOrDefault(g => g.ID == group.Key)?.Name ?? "Unknown Group";
                    
                    column.Item().PaddingTop(15).Column(groupColumn =>
                    {
                        groupColumn.Item().Text(groupName)
                            .FontSize(14)
                            .Bold()
                            .FontColor(PdfColors.Blue.Darken1);

                        var devicesByType = group.GroupBy(d => $"{d.Brand} {d.Model}");
                        
                        foreach (var deviceType in devicesByType)
                        {
                            groupColumn.Item().PaddingTop(8).Element(container => 
                                ComposeDeviceType(container, deviceType.Key, deviceType.ToList(), options));
                        }
                    });
                }
            });
        }

        private void ComposeDevicesByType(PdfContainer container, DevicesViewModel devicesViewModel, 
            GroupsViewModel groupsViewModel, ExportOptions options)
        {
            container.Column(column =>
            {
                column.Item().Text("Devices by Type")
                    .FontSize(18)
                    .Bold()
                    .FontColor(PdfColors.Blue.Medium);

                var devicesByType = devicesViewModel.Devices.GroupBy(d => $"{d.Brand} {d.Model}");

                foreach (var deviceType in devicesByType)
                {
                    column.Item().PaddingTop(15).Element(container => 
                        ComposeDeviceType(container, deviceType.Key, deviceType.ToList(), options));
                }
            });
        }

        private void ComposeDeviceType(PdfContainer container, string deviceTypeName, 
            List<RFDevice> devices, ExportOptions options)
        {
            container.Column(column =>
            {
                column.Item().Text(deviceTypeName)
                    .FontSize(12)
                    .Bold()
                    .FontColor(PdfColors.Blue.Darken1);

                column.Item().PaddingTop(5).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(40);  // Device #
                        if (options.IncludeChannelNames)
                            columns.RelativeColumn();    // Channel Name
                        columns.RelativeColumn();    // Frequency
                        columns.ConstantColumn(80);  // Status
                    });

                    table.Header(header =>
                    {
                        header.Cell().Text("#").Bold();
                        if (options.IncludeChannelNames)
                            header.Cell().Text("Channel").Bold();
                        header.Cell().Text("Frequency (MHz)").Bold();
                        header.Cell().Text("Status").Bold();
                    });

                    int deviceNumber = 1;
                    foreach (var device in devices)
                    {
                        for (int channelIndex = 0; channelIndex < device.Channels.Count; channelIndex++)
                        {
                            var channel = device.Channels[channelIndex];
                            
                            table.Cell().Element(CellStyle).Text(channelIndex == 0 ? deviceNumber.ToString() : "");
                            
                            if (options.IncludeChannelNames)
                            {
                                var channelName = !string.IsNullOrEmpty(channel.ChannelName) 
                                    ? channel.ChannelName 
                                    : $"Channel {channelIndex + 1}";
                                table.Cell().Element(CellStyle).Text(channelName);
                            }
                            
                            table.Cell().Element(CellStyle).Text(
                                channel.Frequency > 0 
                                    ? (channel.Frequency / 1000.0).ToString("F3")
                                    : "Not set"
                            );
                            
                            table.Cell().Element(CellStyle).Text(
                                device.IsSynced ? "Synced" : "Local"
                            ).FontColor(device.IsSynced ? PdfColors.Green.Medium : PdfColors.Orange.Medium);
                        }
                        deviceNumber++;
                    }
                });
            });

            static PdfContainer CellStyle(PdfContainer container)
                => container.BorderBottom(1).BorderColor(PdfColors.Grey.Lighten2).PaddingVertical(5);
        }

        private void ComposeFooter(PdfContainer container)
        {
            container.AlignCenter().Text(text =>
            {
                text.CurrentPageNumber();
                text.Span(" / ");
                text.TotalPages();
            });
        }
    }
} 