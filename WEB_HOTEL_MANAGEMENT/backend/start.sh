#!/bin/bash

echo "============================================"
echo "  Hotel Management Flask API"
echo "============================================"
echo ""

cd "$(dirname "$0")"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate venv
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""

# Run Flask
echo "============================================"
echo "Starting Flask server..."
echo "API: http://localhost:5000"
echo "============================================"
echo ""
python app.py
