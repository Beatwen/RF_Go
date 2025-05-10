namespace RF_Go
{
    public static class VersionInfo
    {
        // Suivre le Semantic Versioning (MAJOR.MINOR.PATCH)
        public const string Version = "1.0.0";
        
        // Date de la dernière mise à jour
        public const string LastUpdated = "2024-05-25";
        
        // Numéro de build (peut être automatisé avec CI/CD)
        public const string BuildNumber = "1";
        
        // Obtenir la version complète avec le numéro de build
        public static string GetFullVersion()
        {
            return $"{Version}+{BuildNumber}";
        }
    }
} 