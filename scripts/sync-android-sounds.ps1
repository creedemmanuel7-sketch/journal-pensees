# Copie les ambiances vers res/raw (lecture fiable via RNFS.copyFileRes + MediaPlayer)
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "assets\sounds"
$raw = Join-Path $root "android\app\src\main\res\raw"

if (-not (Test-Path $src)) {
    Write-Warning "Dossier assets/sounds introuvable."
    exit 0
}

New-Item -ItemType Directory -Force -Path $raw | Out-Null

$map = @{
    "pluie.m4a" = "pluie.m4a"
    "foret.m4a" = "foret.m4a"
    "cafe.wav"  = "cafe.wav"
    "feu.wav"   = "feu.wav"
}

foreach ($entry in $map.GetEnumerator()) {
    $from = Join-Path $src $entry.Key
    if (-not (Test-Path $from)) {
        Write-Warning "Fichier manquant : $from"
        continue
    }
    Copy-Item $from (Join-Path $raw $entry.Value) -Force
}

Write-Host "Ambiances copiees vers android/app/src/main/res/raw/" -ForegroundColor Green
