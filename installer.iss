#define MyAppName "RF_Go"
#define MyAppVersion "1.0"
#define MyAppPublisher "Travail de Fin d'Étude"
#define MyAppURL "https://github.com/beatwen/RF_Go"
#define MyAppExeName "RF_Go.exe"
#define MyAppDescription "Analyseur de Fréquences Radio"

[Setup]
AppId={{F1280CF3-71B1-40BF-A5C9-2F6267D27C2F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVersionInfoVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=
InfoBeforeFile=
InfoAfterFile=
OutputDir=installer
OutputBaseFilename=RF_Go-Setup
SetupIconFile=
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1
Name: "associatefiles"; Description: "Associer les fichiers .rfgo avec {#MyAppName}"; GroupDescription: "Associations de fichiers:"; Flags: unchecked

[Files]
Source: "publish\win-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion; AfterInstall: ConvertReadmeToTxt

[Registry]
Root: HKCR; Subkey: ".rfgo"; ValueType: string; ValueName: ""; ValueData: "RFGoFile"; Flags: uninsdeletevalue; Tasks: associatefiles
Root: HKCR; Subkey: "RFGoFile"; ValueType: string; ValueName: ""; ValueData: "Fichier RF_Go"; Flags: uninsdeletekey; Tasks: associatefiles
Root: HKCR; Subkey: "RFGoFile\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"; Tasks: associatefiles
Root: HKCR; Subkey: "RFGoFile\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Tasks: associatefiles

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Comment: "{#MyAppDescription}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Comment: "{#MyAppDescription}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]
procedure ConvertReadmeToTxt();
begin
  // Cette procédure peut être utilisée pour des conversions spécifiques si nécessaire
end;

function InitializeSetup(): Boolean;
begin
  Result := True;
  // Vérifier si .NET 8.0 est installé (optionnel, car l'app est self-contained)
end; 