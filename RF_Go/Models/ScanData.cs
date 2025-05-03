using System;
using System.Collections.Generic;
using SQLite;
namespace RF_Go.Models
{
    public class ScanData
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public string Name { get; set; }
        public string SourceFile { get; set; }
        public DateTime ImportDate { get; set; }
        public string FileType { get; set; } // sdb2, sdb3, etc.
        public string Notes { get; set; }
        
        // Store frequencies and values as JSON strings
        public string FrequenciesJson { get; set; }
        public string ValuesJson { get; set; }
        
        // Store min/max frequencies for quick access
        public double MinFrequency { get; set; }
        public double MaxFrequency { get; set; }
        public double MinValue { get; set; }
        public double MaxValue { get; set; }
    }
} 