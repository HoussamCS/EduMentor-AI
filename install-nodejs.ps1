# Download and install Node.js
$NodeVersion = "20.17.0"  # Latest LTS version
$DownloadUrl = "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-x64.msi"
$InstallerPath = "$env:TEMP\node-installer.msi"

Write-Host "Downloading Node.js v$NodeVersion..." -ForegroundColor Green
Invoke-WebRequest -Uri $DownloadUrl -OutFile $InstallerPath

Write-Host "Installing Node.js..." -ForegroundColor Green
Start-Process -FilePath $InstallerPath -ArgumentList "/quiet" -Wait

Write-Host "Verifying installation..." -ForegroundColor Green
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

node --version
npm --version

Write-Host "Node.js installed successfully!" -ForegroundColor Green
