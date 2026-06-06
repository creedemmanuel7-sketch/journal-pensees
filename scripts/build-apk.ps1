# APK release autonome - chemins reels uniquement (pas de lecteur M:)
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Split-Path $PSScriptRoot -Parent)).Path
if (-not (Test-Path "$ProjectRoot\android\gradlew.bat")) {
    throw "Dossier android introuvable sous $ProjectRoot"
}

# Ancien build via "subst M:" : retirer le lecteur et le cache Gradle corrompu
subst M: /d 2>$null
$env:GRADLE_USER_HOME = "C:\gradle-mespensees"
New-Item -ItemType Directory -Force -Path $env:GRADLE_USER_HOME | Out-Null

Write-Host "Nettoyage cache Gradle (chemins M: obsoletes)..." -ForegroundColor Yellow
Set-Location "$ProjectRoot\android"
& .\gradlew.bat --stop 2>$null

$toRemove = @(
    "$ProjectRoot\android\.gradle",
    "$ProjectRoot\android\build",
    "$ProjectRoot\android\app\build\generated"
)
foreach ($dir in $toRemove) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

& powershell -ExecutionPolicy Bypass -File (Join-Path $ProjectRoot "scripts\sync-android-icons.ps1")
& powershell -ExecutionPolicy Bypass -File (Join-Path $ProjectRoot "scripts\sync-android-sounds.ps1")

Write-Host "Build RELEASE depuis $ProjectRoot\android ..." -ForegroundColor Cyan
Write-Host "Ne lancez pas un autre gradlew en parallele." -ForegroundColor Yellow

& .\gradlew.bat assembleRelease
$code = $LASTEXITCODE

$apk = "$ProjectRoot\android\app\build\outputs\apk\release\app-release.apk"
if ($code -eq 0 -and (Test-Path $apk)) {
    $sizeMb = [math]::Round((Get-Item $apk).Length / 1MB, 1)
    Write-Host ""
    Write-Host "APK autonome pret : $apk" -ForegroundColor Green
    Write-Host "Taille : $sizeMb Mo" -ForegroundColor Green
    Write-Host "Installez avec : adb install -r $apk" -ForegroundColor Cyan
}

exit $code
