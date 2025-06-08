namespace Tests_NUnit
{
    /// <summary>
    /// Configuration centrale pour les tests d'intégration RF_Go
    /// </summary>
    public static class TestConfiguration
    {
        /// <summary>
        /// URL base de l'application RF_Go
        /// Modifiez selon votre configuration de développement
        /// </summary>
        public const string BASE_URL = "http://localhost:5000";

        /// <summary>
        /// Timeout par défaut pour les tests (en millisecondes)
        /// </summary>
        public const int DEFAULT_TIMEOUT = 30000;

        /// <summary>
        /// Délai d'attente pour les animations UI (en millisecondes)
        /// </summary>
        public const int UI_ANIMATION_DELAY = 500;

        /// <summary>
        /// Configuration des viewports pour les tests responsifs
        /// </summary>
        public static class Viewports
        {
            public static readonly (int Width, int Height) Desktop = (1920, 1080);
            public static readonly (int Width, int Height) Tablet = (768, 1024);
            public static readonly (int Width, int Height) Mobile = (375, 667);
        }

        /// <summary>
        /// Sélecteurs CSS couramment utilisés dans RF_Go
        /// </summary>
        public static class Selectors
        {
            // Navigation
            public const string Navigation = "nav, .navbar";
            public const string MainContent = "main, .main-content";
            
            // Dispositifs
            public const string DevicesTab = "[data-testid='devices-tab'], .devices-nav, text=Dispositifs";
            public const string AddDeviceButton = "[data-testid='add-device-btn'], .add-device, text=Ajouter";
            public const string DevicesList = ".device-list, [data-testid='devices-list']";
            
            // Formulaires
            public const string BrandInput = "#brand-input, [data-testid='device-brand']";
            public const string ModelInput = "#model-input, [data-testid='device-model']";
            public const string NameInput = "#name-input, [data-testid='device-name']";
            public const string SaveButton = "#save-btn, [data-testid='save-device'], text=Sauvegarder";
            
            // Calculs
            public const string CalculateButton = "[data-testid='calculate-freq-btn'], text=Calculer";
            public const string CalculationResults = "[data-testid='calculation-results'], .freq-results";
            
            // Découverte
            public const string DiscoveryTab = "[data-testid='discovery-tab'], text=Découverte";
            public const string StartDiscoveryButton = "[data-testid='start-discovery'], text=Découvrir";
            public const string DiscoveredDevice = "[data-testid='discovered-device'], .discovered-device";
            
            // Scans
            public const string ScansTab = "[data-testid='scans-tab'], text=Scans";
            public const string ImportSection = "[data-testid='import-section'], .import-scan";
            public const string FileInput = "input[type='file'], [data-testid='file-input']";
            public const string Chart = "#chart, [data-testid='frequency-chart'], .chart";
            
            // États et erreurs
            public const string ErrorMessage = ".error, .alert-danger";
            public const string LoadingIndicator = ".loading, .spinner, [data-testid='loading']";
        }

        /// <summary>
        /// Données de test pour les dispositifs RF
        /// </summary>
        public static class TestData
        {
            public static readonly (string Brand, string Model, string Name) SennheiserIEM = 
                ("Sennheiser", "IEM G4", "IEM-Test-001");
                
            public static readonly (string Brand, string Model, string Name) ShurePSM = 
                ("Shure", "PSM 1000", "PSM-Test-001");
                
            public static readonly (string Brand, string Model, string Name) AudioTechnicaIEM = 
                ("Audio-Technica", "M3000", "AT-Test-001");
        }
    }
} 