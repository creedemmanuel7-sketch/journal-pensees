# Copie les icones assets/ vers android/app/src/main/res
$root = Split-Path $PSScriptRoot -Parent
$res = Join-Path $root "android\app\src\main\res"
$assets = Join-Path $root "assets"

$drawable = Join-Path $res "drawable"
New-Item -ItemType Directory -Force -Path $drawable | Out-Null

Copy-Item (Join-Path $assets "android-icon-background.png") (Join-Path $drawable "ic_launcher_background.png") -Force
Copy-Item (Join-Path $assets "android-icon-foreground.png") (Join-Path $drawable "ic_launcher_foreground.png") -Force

$nodpi = Join-Path $res "drawable-nodpi"
New-Item -ItemType Directory -Force -Path $nodpi | Out-Null
Copy-Item (Join-Path $assets "splash-screen.png") (Join-Path $nodpi "splash_screen_image.png") -Force

$icon = Join-Path $assets "icon.png"
foreach ($density in @("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi")) {
    $dir = Join-Path $res "mipmap-$density"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Copy-Item $icon (Join-Path $dir "ic_launcher.png") -Force
    Copy-Item $icon (Join-Path $dir "ic_launcher_round.png") -Force
}

Write-Host "Icones Android synchronisees depuis assets/" -ForegroundColor Green
