# scripts/release.ps1
# MERIDIAN RELEASE ORCHESTRATOR - snapshot + secret scan + logbook + build + deploy
# Run: pwsh -NoProfile -File scripts/release.ps1 [-ApplyDatabase] [-ReleaseNote "text"] [-AllowDirty] [-SkipBuild] [-SkipVercel]
[CmdletBinding()]
param(
  [switch]$ApplyDatabase,
  [string]$ReleaseNote = '',
  [switch]$AllowDirty,
  [switch]$SkipBuild,
  [switch]$SkipVercel
)
$ErrorActionPreference = 'Stop'
if (-not $PSScriptRoot) { throw 'Run as file: pwsh -NoProfile -File scripts/release.ps1' }
$ROOT = if ((Split-Path -Leaf $PSScriptRoot) -eq 'scripts') { Split-Path -Parent $PSScriptRoot } else { $PSScriptRoot }
if (-not (Test-Path (Join-Path $ROOT 'package.json'))) { throw "Project root not found at $ROOT" }

$Lock = Join-Path $ROOT '.meridian-release.lock'
if (Test-Path $Lock) { throw 'Another release is running. Delete .meridian-release.lock if stale.' }
New-Item -ItemType File -Path $Lock -Force | Out-Null

$Eng = Join-Path $ROOT 'engineering'
if (-not (Test-Path $Eng)) { New-Item -ItemType Directory -Path $Eng -Force | Out-Null }
$SrcLog = Join-Path $Eng 'DEPLOYMENT_SOURCE_LOG.txt'
$DepLog = Join-Path $Eng 'DEPLOYMENT_LOG.txt'

function Log($msg, $color) { Write-Host $msg -ForegroundColor $color }
function Fail($msg) {
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('RELEASE FAILED - ' + (Get-Date).ToUniversalTime().ToString('u') + ' - ' + $msg)
  Log ('RELEASE FAILED: ' + $msg) Red
  exit 1
}

try {
  Push-Location $ROOT
  Log '=== MERIDIAN RELEASE ORCHESTRATOR ===' Cyan

  git rev-parse --is-inside-work-tree 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail 'Not a git repository.' }
  $Branch = (git rev-parse --abbrev-ref HEAD).Trim()
  $Sha = (git rev-parse HEAD).Trim()
  $Utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss UTC')
  $Dirty = (git status --porcelain).Trim()
  if ($Dirty -and -not $AllowDirty) { Fail 'Working tree dirty. Commit first or use -AllowDirty.' }
  $ReleaseId = $Sha.Substring(0,7) + '-' + (Get-Date).ToUniversalTime().ToString('yyyyMMddHHmmss')
  Log ('Release ' + $ReleaseId + ' on ' + $Branch) White

  $inc = @('.ts','.tsx','.js','.jsx','.mjs','.cjs','.css','.sql','.ps1','.json','.md')
  $excFiles = @('package-lock.json','DEPLOYMENT_SOURCE_LOG.txt','DEPLOYMENT_LOG.txt')
  $excDirs = @('node_modules','.next','.git','dist','build','coverage','.vercel','engineering','public')
  $files = @()
  $rawList = git ls-files
  foreach ($rel in $rawList) {
    if (-not $rel) { continue }
    $ext = [IO.Path]::GetExtension($rel)
    if ($inc -notcontains $ext) { continue }
    $leaf = [IO.Path]::GetFileName($rel)
    if ($excFiles -contains $leaf) { continue }
    if ($rel -like '.env*') { continue }
    $blocked = $false
    foreach ($part in ($rel -split '/')) { if ($excDirs -contains $part) { $blocked = $true; break } }
    if ($blocked) { continue }
    $full = Join-Path $ROOT ($rel -replace '/', '\')
    if (Test-Path -LiteralPath $full -PathType Leaf) { $files += $full }
  }
  Log ('Eligible source files: ' + $files.Count) Gray

  $patterns = @(
    'eyJ[A-Za-z0-9_-]{10,}',
    'sb_[a-z]+_[A-Za-z0-9]{20,}',
    '-----BEGIN [A-Z ]*PRIVATE KEY-----',
    'AKIA[0-9A-Z]{16}',
    'ghp_[A-Za-z0-9]{36}',
    'github_pat_[A-Za-z0-9_]{20,}',
    'xox[baprs]-[A-Za-z0-9-]{10,}',
    'sk-[A-Za-z0-9]{20,}',
    '(SERVICE_ROLE|service_role)_?(KEY|key)\s*[:=]\s*[''"][A-Za-z0-9_-]{20,}'
  )
  foreach ($f in $files) {
    $c = [IO.File]::ReadAllText($f)
    foreach ($p in $patterns) {
      if ($c -match $p) { Fail ('Secret pattern detected in ' + $f + '. Release aborted; secret NOT copied to logbook.') }
    }
  }
  Log 'Secret scan passed.' Green

  Add-Content -Path $SrcLog -Encoding UTF8 -Value ''
  Add-Content -Path $SrcLog -Encoding UTF8 -Value '================================================================================'
  Add-Content -Path $SrcLog -Encoding UTF8 -Value ('RELEASE SOURCE SNAPSHOT  id=' + $ReleaseId + '  ts=' + $Utc + '  branch=' + $Branch + '  sha=' + $Sha)
  if ($ReleaseNote) { Add-Content -Path $SrcLog -Encoding UTF8 -Value ('NOTE: ' + $ReleaseNote) }
  Add-Content -Path $SrcLog -Encoding UTF8 -Value ('FILES: ' + $files.Count)
  Add-Content -Path $SrcLog -Encoding UTF8 -Value '================================================================================'
  foreach ($f in $files) {
    $rel = $f.Substring($ROOT.Length + 1).Replace('\','/')
    Add-Content -Path $SrcLog -Encoding UTF8 -Value ''
    Add-Content -Path $SrcLog -Encoding UTF8 -Value ('---- FILE: ' + $rel + ' ----')
    Add-Content -Path $SrcLog -Encoding UTF8 -Value ([IO.File]::ReadAllText($f))
  }
  Log 'Source snapshot appended to engineering/DEPLOYMENT_SOURCE_LOG.txt' Green

  $dbResult = 'skipped'
  if ($ApplyDatabase) {
    $sb = Get-Command supabase -ErrorAction SilentlyContinue
    if (-not $sb) {
      Log 'WARNING: supabase CLI not installed. Apply pending migrations via Supabase SQL Editor. Continuing.' Yellow
      $dbResult = 'manual-sql-editor'
    } else {
      supabase db push
      if ($LASTEXITCODE -ne 0) { Fail 'supabase db push failed. Release aborted before build/deploy.' }
      $dbResult = 'applied'
    }
  }

  $buildResult = 'skipped'
  if (-not $SkipBuild) {
    npm run build
    if ($LASTEXITCODE -ne 0) { Fail 'Production build failed.' }
    $buildResult = 'success'
  }

  $depResult = 'skipped'
  if (-not $SkipVercel) {
    vercel deploy --prod --yes
    if ($LASTEXITCODE -ne 0) { Fail 'Vercel deployment failed.' }
    $depResult = 'success'
  }

  Add-Content -Path $DepLog -Encoding UTF8 -Value ''
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('RELEASE ' + $ReleaseId + ' | ' + $Utc + ' | branch=' + $Branch + ' | sha=' + $Sha)
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  note      : ' + $(if ($ReleaseNote) { $ReleaseNote } else { '(none)' }))
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  database  : ' + $dbResult)
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  build     : ' + $buildResult)
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  vercel    : ' + $depResult)
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  files     : ' + $files.Count)
  Add-Content -Path $DepLog -Encoding UTF8 -Value ('  url       : https://meridian-academy-eight.vercel.app')
  Log 'RELEASE COMPLETE - logged to engineering/DEPLOYMENT_LOG.txt' Green
}
finally {
  Remove-Item -LiteralPath $Lock -Force -ErrorAction SilentlyContinue
  Pop-Location
}