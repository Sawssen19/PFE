# Script PowerShell pour exécuter la migration PostgreSQL

Write-Host "Execution de la migration pour ajouter notificationPreferences..." -ForegroundColor Cyan
Write-Host ""

# Demander les informations de connexion
$DB_USER = Read-Host "Nom d'utilisateur (par defaut: postgres)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "postgres" }

$DB_PASSWORD = Read-Host "Mot de passe" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

$DB_NAME = Read-Host "Nom de la base (par defaut: kollecta_db)"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "kollecta_db" }

Write-Host ""
Write-Host "Connexion a PostgreSQL..." -ForegroundColor Yellow

# Définir la variable d'environnement pour le mot de passe
$env:PGPASSWORD = $DB_PASSWORD_PLAIN

# Exécuter la migration
psql -U $DB_USER -d $DB_NAME -f add_notification_preferences.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration executee avec succes!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'execution de la migration." -ForegroundColor Red
    Write-Host "Verifiez vos identifiants de connexion." -ForegroundColor Red
}

# Nettoyer la variable d'environnement
Remove-Item Env:\PGPASSWORD

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

