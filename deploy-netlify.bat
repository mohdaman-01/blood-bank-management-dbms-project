@echo off
echo 🚀 Building Blood Bank Frontend for Netlify...
echo.

echo ✅ Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Building for production...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 🎉 Build completed successfully!
echo.
echo 📁 Built files are in the 'dist' folder
echo 🌐 Ready for Netlify deployment!
echo.
echo Next steps:
echo 1. Go to https://netlify.com
echo 2. Drag the 'dist' folder to deploy
echo 3. Or connect your Git repository
echo.
pause