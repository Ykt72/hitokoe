$ErrorActionPreference = "Stop"

$repoUrl = "https://github.com/Ykt72/hitokoe.git"
$git = "C:\Program Files\Git\cmd\git.exe"

if (!(Test-Path $git)) {
  $git = "git"
}

if (Test-Path ".git" -PathType Container) {
  $gitItems = Get-ChildItem -Force ".git" -Recurse -ErrorAction SilentlyContinue
  if (($gitItems | Measure-Object).Count -eq 0) {
    Remove-Item -LiteralPath ".git" -Force
  } else {
    Write-Host ".git already exists. Please check the current repository state."
    & $git status --short --branch
    exit 1
  }
}

if (!(Test-Path ".git")) {
  & $git init
  & $git branch -M main
}

try {
  & $git credential-manager configure | Out-Null
} catch {
  Write-Host "Skipped Git Credential Manager setup."
}

$remote = (& $git remote 2>$null)
if ($remote -contains "origin") {
  & $git remote set-url origin $repoUrl
} else {
  & $git remote add origin $repoUrl
}

& $git add .

$status = (& $git status --short)
if ($status) {
  & $git commit -m "feat: update hitokoe app implementation"
} else {
  Write-Host "No changes to commit."
}

Write-Host ""
Write-Host "Trying normal push. Please sign in if GitHub asks for authentication."
& $git push -u origin main

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Normal push failed."
  Write-Host "If the remote repository has older code and you want to replace it with this folder, run:"
  Write-Host "git push --force-with-lease -u origin main"
}
