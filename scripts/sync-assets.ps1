$ErrorActionPreference = "Stop"
$webRoot = Split-Path $PSScriptRoot -Parent
$diyRoot = Split-Path $webRoot -Parent
$androidRoot = Join-Path $diyRoot "manabi_zukan\app\src\main"
$jsonSrc = Join-Path $androidRoot "assets\zukan.json"
$illSrc = Join-Path $androidRoot "res\drawable-nodpi"
$assetsDst = Join-Path $webRoot "public\assets"
$illDst = Join-Path $assetsDst "illustrations"

if (-not (Test-Path $jsonSrc)) {
    Write-Error "zukan.json not found: $jsonSrc"
}
if (-not (Test-Path $illSrc)) {
    Write-Error "drawable-nodpi not found: $illSrc"
}

New-Item -ItemType Directory -Force -Path $illDst | Out-Null
Copy-Item $jsonSrc (Join-Path $assetsDst "zukan.json") -Force

$copied = 0
Get-ChildItem $illSrc -Filter "ill_*.png" | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $illDst $_.Name) -Force
    $copied++
}

Write-Host "Synced zukan.json and $copied illustration PNGs to public/assets"
