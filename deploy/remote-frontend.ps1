# Se ejecuta en la instancia FRONT-APP-G2001 vía SSM (desde S3).
$ErrorActionPreference = 'Stop'
Remove-Item C:\inetpub\wwwroot\* -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path C:\front.zip -DestinationPath C:\inetpub\wwwroot -Force
Write-Output 'frontend desplegado'
