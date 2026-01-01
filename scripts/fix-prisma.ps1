# Fix Prisma permission issues on Windows
Write-Host "Fixing Prisma permission issues..." -ForegroundColor Yellow

# Kill any running Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Blue
taskkill /f /im node.exe 2>$null

# Remove Prisma client
Write-Host "Removing Prisma client..." -ForegroundColor Blue
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

# Regenerate Prisma client
Write-Host "Regenerating Prisma client..." -ForegroundColor Blue
npx prisma generate

Write-Host "Prisma fix completed!" -ForegroundColor Green