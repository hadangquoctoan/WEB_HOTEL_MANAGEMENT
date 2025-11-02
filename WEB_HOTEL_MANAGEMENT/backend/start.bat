@echo off
echo ============================================
echo   Hotel Management Flask API
echo ============================================
echo.

cd /d %~dp0

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate venv
echo Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Run Flask
echo ============================================
echo Starting Flask server...
echo API: http://localhost:5000
echo ============================================
echo.
python app.py

pause
