@echo off
echo Execution de la migration pour ajouter notificationPreferences...
echo.
echo Veuillez entrer les informations de connexion PostgreSQL:
echo.

set /p DB_USER="Nom d'utilisateur (par defaut: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD="Mot de passe: "

set /p DB_NAME="Nom de la base (par defaut: kollecta_db): "
if "%DB_NAME%"=="" set DB_NAME=kollecta_db

echo.
echo Connexion a PostgreSQL...
psql -U %DB_USER% -d %DB_NAME% -f add_notification_preferences.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Migration executee avec succes!
) else (
    echo.
    echo ❌ Erreur lors de l'execution de la migration.
    echo Verifiez vos identifiants de connexion.
)

pause

