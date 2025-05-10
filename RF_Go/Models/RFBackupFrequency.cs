using System.ComponentModel;
using System.Runtime.CompilerServices;
using SQLite;
namespace RF_Go.Models
{
    public class RFBackupFrequency : INotifyPropertyChanged
    {
        
        private int _id;
        private string _brand;
        private string _model;
        private string _frequency;
        private int _channelIndex;
        private int _backupFrequency;
        private bool _isUsed;
        private int _minRange;
        private int _maxRange;
        private int _step;
        [PrimaryKey, AutoIncrement]

        public int ID
        {
            get => _id;
            set => SetField(ref _id, value);
        }

        public string Brand
        {
            get => _brand;
            set => SetField(ref _brand, value);
        }

        public string Model
        {
            get => _model;
            set => SetField(ref _model, value);
        }

        public string Frequency
        {
            get => _frequency;
            set => SetField(ref _frequency, value);
        }

        public int ChannelIndex
        {
            get => _channelIndex;
            set => SetField(ref _channelIndex, value);
        }

        public int BackupFrequency
        {
            get => _backupFrequency;
            set => SetField(ref _backupFrequency, value);
        }

        public bool IsUsed
        {
            get => _isUsed;
            set => SetField(ref _isUsed, value);
        }

        public int MinRange
        {
            get => _minRange;
            set => SetField(ref _minRange, value);
        }

        public int MaxRange
        {
            get => _maxRange;
            set => SetField(ref _maxRange, value);
        }

        public int Step
        {
            get => _step;
            set => SetField(ref _step, value);
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        protected bool SetField<T>(ref T field, T value, [CallerMemberName] string propertyName = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value)) return false;
            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
} 