param(
  [int]$ApiPort = 3000
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$ip = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
  throw "No LAN IPv4 address found"
}

$env:EXPO_PUBLIC_API_URL = "http://${ip}:${ApiPort}"
Write-Host "API URL for Expo Go: $env:EXPO_PUBLIC_API_URL"

$api = Start-Process -FilePath npm.cmd `
  -ArgumentList @("run", "start") `
  -WorkingDirectory $root `
  -PassThru `
  -WindowStyle Hidden

try {
  Start-Sleep -Seconds 4
  Invoke-WebRequest -UseBasicParsing "$env:EXPO_PUBLIC_API_URL/api/v1/health" | Out-Null
  npm.cmd run start --workspace @smart-ant/mobile -- --host lan
} finally {
  Stop-Process -Id $api.Id -Force -ErrorAction SilentlyContinue
}
