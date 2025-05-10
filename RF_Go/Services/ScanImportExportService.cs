using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;
using RF_Go.Models;
using RF_Go.ViewModels;
using System.Text;
using System.Diagnostics;

namespace RF_Go.Services
{
    public class ScanImportExportService
    {
        private readonly ScansViewModel _scansViewModel;
        private readonly IJSRuntime _jsRuntime;

        public ScanImportExportService(ScansViewModel scansViewModel, IJSRuntime jsRuntime)
        {
            _scansViewModel = scansViewModel;
            _jsRuntime = jsRuntime;
        }

        public async Task<(bool Success, string ErrorMessage)> ImportScanAsync(string filePath)
        {
            try
            {
                var fileInfo = new FileInfo(filePath);
                
                // Validate file size (10MB max)
                if (fileInfo.Length > 10485760)
                {
                    return (false, "File size exceeds 10MB limit");
                }

                var fileExtension = Path.GetExtension(filePath).ToLower();
                if (fileExtension != ".sdb2" && fileExtension != ".sdb3")
                {
                    return (false, "Unsupported file type. Only .sdb2 and .sdb3 files are supported");
                }

                ScanData scanData = null;

                try
                {
                    // Validate file content
                    if (!File.Exists(filePath) || fileInfo.Length == 0)
                    {
                        return (false, "Invalid file content");
                    }

                    // Process file based on extension
                    switch (fileExtension)
                    {
                        case ".sdb2":
                            scanData = ImportSdb2FileAsync(filePath);
                            break;
                        case ".sdb3":
                            scanData = ImportSdb3File(filePath);
                            break;
                    }

                    if (scanData == null)
                    {
                        return (false, "Failed to parse scan data from file");
                    }

                    // Validate scan data
                    if (string.IsNullOrEmpty(scanData.FrequenciesJson) || string.IsNullOrEmpty(scanData.ValuesJson))
                    {
                        return (false, "No valid frequency or value data found in file");
                    }

                    await _scansViewModel.AddScanAsync(scanData);
                    return (true, "Scan imported successfully");
                }
                catch (XmlException ex)
                {
                    Debug.Print(ex.ToString());
                    return (false, "Invalid XML format in scan file");
                }
                catch (JsonException ex)
                {
                    Debug.Print(ex.ToString());
                    return (false, "Error processing scan data");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error importing scan: {ex.Message}");
                return (false, $"Error importing scan: {ex.Message}");
            }
        }

        private static ScanData ImportSdb2FileAsync(string filePath)
        {
            try
            {
                var xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);

                var scanData = new ScanData
                {
                    Name = Path.GetFileNameWithoutExtension(filePath),
                    SourceFile = filePath,
                    ImportDate = DateTime.Now,
                    FileType = "sdb2"
                };

                var freqSet = xmlDoc.SelectSingleNode("//freq_set");
                var dataSet = xmlDoc.SelectSingleNode("//data_set");

                if (freqSet != null && dataSet != null)
                {
                    var frequencies = new List<double>();
                    var values = new List<float>();

                    foreach (XmlNode freqNode in freqSet.SelectNodes("f"))
                    {
                        if (double.TryParse(freqNode.InnerText, out double freq))
                        {
                            frequencies.Add(freq);
                        }
                    }

                    foreach (XmlNode valueNode in dataSet.SelectNodes("v"))
                    {
                        if (float.TryParse(valueNode.InnerText, out float value))
                        {
                            values.Add(value / 10);
                        }
                    }

                    scanData.FrequenciesJson = JsonSerializer.Serialize(frequencies);
                    scanData.ValuesJson = JsonSerializer.Serialize(values);
                    scanData.IsVisible = true;

                    if (frequencies.Count > 0 && values.Count > 0)
                    {
                        scanData.MinFrequency = frequencies.Min();
                        scanData.MaxFrequency = frequencies.Max();
                        scanData.MinValue = values.Min();
                        scanData.MaxValue = values.Max();
                    }
                }

                return scanData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error importing SDB2 file: {ex.Message}");
                throw;
            }
        }

        private static ScanData ImportSdb3File(string filePath)
        {
            try
            {
                var scanData = new ScanData
                {
                    Name = Path.GetFileNameWithoutExtension(filePath),
                    SourceFile = filePath,
                    ImportDate = DateTime.Now,
                    FileType = "sdb3"
                };

                // 1) lire le flux binaire tel quel
                using var fs = File.OpenRead(filePath);
                using var br = new BinaryReader(fs);

                // ---- en-tête JSON -------------------------------------------------------
                var headerBytes = new List<byte>();
                byte[] marker = Encoding.ASCII.GetBytes("@Binary:");
                while (true)
                {
                    headerBytes.Add(br.ReadByte());
                    if (headerBytes.Count >= marker.Length &&
                        headerBytes.Skip(headerBytes.Count - marker.Length)
                                  .SequenceEqual(marker))
                        break;                              // "@Binary:" atteint
                }

                // extraire le JSON
                string headerJson = Encoding.UTF8.GetString(headerBytes
                                .Take(headerBytes.Count - marker.Length).ToArray());
                headerJson = headerJson.Substring(headerJson.IndexOf('{'));
                var header = JsonSerializer.Deserialize<Sdb3Header>(headerJson);

                // récupérer la première entrée contenant "Curve"
                var schemaItem = header.BinarySchema.First(it => it.Curve != null);
                var range = schemaItem.Curve.FreqRanges[0];
                int numPoints = (int)((range.EndFreq - range.StartFreq) / range.StepFreq) + 1;

                // 2) se placer au tout début du bloc données ------------------------------
                // ignorer \r, \n, espaces, tabulations avant @Swp
                while (br.PeekChar() is int c && (c == '\r' || c == '\n' || c == ' ' || c == '\t'))
                    br.ReadByte();

                // 3) balayage(s) ----------------------------------------------------------
                const string SWP = "@Swp";
                var freqs = new List<float>();
                var values = new List<float>();

                while (br.BaseStream.Position < br.BaseStream.Length)
                {
                    // vérifier l'alignement
                    if (Encoding.ASCII.GetString(br.ReadBytes(4)) != SWP)
                        throw new InvalidDataException("Balayage mal aligné (marqueur @Swp absent)");

                    uint id = br.ReadUInt32();           // numéro de courbe
                    uint timestamp = br.ReadUInt32();    // Unix-epoch en ms

                    for (int i = 0; i < numPoints; i++)
                    {
                        short raw = br.ReadInt16();               // 16 bits little-endian
                        float dbm = raw == header.NoDataValue
                                  ? -140f
                                  : raw / (float)(1 << (header.BitWidth - 8));

                        freqs.Add(range.StartFreq + i * range.StepFreq);
                        values.Add(dbm);
                    }

                    // Lire le CRC-16
                    br.ReadUInt16();

                    // Consommer CR/LF s'ils existent
                    while (br.PeekChar() is int c && (c == '\r' || c == '\n'))
                        br.ReadByte();

                    // Vérifier si on a atteint la fin des balayages
                    var next4 = Encoding.ASCII.GetString(br.ReadBytes(4));
                    if (next4 == "@Swp")
                    {
                        // On reste dans la boucle -> sweep suivant
                        br.BaseStream.Position -= 4; // recule pour relire @Swp au prochain tour
                    }
                    else if (next4 == "@Ext")       // début de "@Extended:"
                    {
                        break;                       // fin des sweeps, sortir proprement
                    }
                    else
                    {
                        throw new InvalidDataException($"Séquence inconnue «{next4}»");
                    }
                }

                scanData.FrequenciesJson = JsonSerializer.Serialize(freqs);
                scanData.ValuesJson = JsonSerializer.Serialize(values);
                scanData.IsVisible = true;

                if (freqs.Count() > 0 && values.Count() > 0)
                {
                    scanData.MinFrequency = freqs.Min();
                    scanData.MaxFrequency = freqs.Max();
                    scanData.MinValue = values.Min();
                    scanData.MaxValue = values.Max();
                }

                return scanData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error importing SDB3 file: {ex.Message}");
                throw;
            }
        }

        private class Sdb3Header
        {
            public string AmplUnits { get; set; }
            public List<BinarySchemaItem> BinarySchema { get; set; }
            public int BitWidth { get; set; }
            public string FreqUnits { get; set; }
            public int NoDataValue { get; set; }
            public int ScaleFactor { get; set; }
            public string ScannerModel { get; set; }
            public string ScannerName { get; set; }
            public string StartDate { get; set; }
            public string StartTime { get; set; }
            public string Title { get; set; }
            public string Version { get; set; }
        }

        private class BinarySchemaItem
        {
            public int Bytes { get; set; }
            public string DataValue { get; set; }
            public CurveData Curve { get; set; }
        }

        private class CurveData
        {
            public string Color { get; set; }
            public bool CoordinationSource { get; set; }
            public List<FreqRange> FreqRanges { get; set; }
            public string Name { get; set; }
            public int ResolutionBandWidth { get; set; }
        }

        private class FreqRange
        {
            public float EndFreq { get; set; }
            public float StartFreq { get; set; }
            public float StepFreq { get; set; }
        }

        public bool ExportScan(ScanData scan, string filePath)
        {
            try
            {
                var frequencies = _scansViewModel.GetFrequencies(scan);
                var values = _scansViewModel.GetValues(scan);

                var xmlDoc = new XmlDocument();
                var root = xmlDoc.CreateElement("scan_data_source");
                xmlDoc.AppendChild(root);

                var freqSet = xmlDoc.CreateElement("freq_set");
                foreach (var freq in frequencies)
                {
                    var freqNode = xmlDoc.CreateElement("f");
                    freqNode.InnerText = freq.ToString();
                    freqSet.AppendChild(freqNode);
                }

                var dataSet = xmlDoc.CreateElement("data_set");
                foreach (var value in values)
                {
                    var valueNode = xmlDoc.CreateElement("v");
                    valueNode.InnerText = value.ToString();
                    dataSet.AppendChild(valueNode);
                }

                root.AppendChild(freqSet);
                root.AppendChild(dataSet);

                xmlDoc.Save(filePath);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error exporting scan: {ex.Message}");
                return false;
            }
        }
    }
} 