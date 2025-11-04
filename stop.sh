#!/bin/bash

# Hotel Management System - Stop Script
# This script stops both backend and frontend servers

echo "======================================"
echo "🛑 Stopping Hotel Management System"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Stop Backend
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🔴 Stopping Backend Server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend server not running${NC}"
    fi
    rm backend.pid
else
    echo -e "${YELLOW}⚠️  Backend PID file not found${NC}"
    # Try to find and kill by port
    BACKEND_PID=$(lsof -ti:5001)
    if [ ! -z "$BACKEND_PID" ]; then
        echo "🔴 Found backend process on port 5001 (PID: $BACKEND_PID), stopping..."
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
fi

# Stop Frontend
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🔴 Stopping Frontend Server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend server not running${NC}"
    fi
    rm frontend.pid
else
    echo -e "${YELLOW}⚠️  Frontend PID file not found${NC}"
    # Try to find and kill by port
    FRONTEND_PID=$(lsof -ti:8000)
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "🔴 Found frontend process on port 8000 (PID: $FRONTEND_PID), stopping..."
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
fi

# Clean up
rm -f .server_info

echo ""
echo "======================================"
echo -e "${GREEN}✅ All servers stopped${NC}"
echo "======================================"
