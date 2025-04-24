# Créer le dossier d'export
New-Item -ItemType Directory -Force -Path "docs_export"

# Fonction pour nettoyer le contenu Markdown
function Clean-Markdown {
    param (
        [string]$content
    )
    
    # Supprimer les métadonnées YAML
    $content = $content -replace '---[\s\S]*?---', ''
    
    # Convertir les diagrammes Mermaid en texte descriptif
    $content = $content -replace '```mermaid[\s\S]*?```', '[Diagramme Mermaid converti en texte descriptif]'
    
    # Nettoyer les liens relatifs
    $content = $content -replace '\]\(\.\.\/[^)]*\)', ']'
    $content = $content -replace '\]\(\/[^)]*\)', ']'
    
    return $content
}

# Exporter chaque fichier Markdown
Get-ChildItem -Path "docs" -Recurse -Filter "*.md" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $cleanedContent = Clean-Markdown -content $content
    
    # Créer un chemin relatif pour l'export
    $relativePath = $_.FullName.Substring($PWD.Path.Length + 1)
    $exportPath = "docs_export/$relativePath"
    
    # Créer les dossiers nécessaires
    $exportDir = Split-Path -Parent $exportPath
    New-Item -ItemType Directory -Force -Path $exportDir | Out-Null
    
    # Exporter le contenu nettoyé
    $cleanedContent | Out-File -FilePath $exportPath -Encoding utf8
}

Write-Host "Export terminé dans le dossier docs_export" 