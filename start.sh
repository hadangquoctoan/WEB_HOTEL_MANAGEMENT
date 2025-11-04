#!/bin/bash

# Hotel Management System - Startup Script
# This script starts both backend and frontend servers

echo "======================================"
echo "🏨 Hotel Management System Startup"
echo "======================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to get IP address
get_ip() {
    hostname -I | awk '{print $1}'
}

# Check if backend is already running
echo "🔍 Checking if servers are already running..."
if check_port 5001; then
    echo -e "${YELLOW}⚠️  Backend server is already running on port 5001${NC}"
    BACKEND_RUNNING=true
else
    BACKEND_RUNNING=false
fi

if check_port 8000; then
    echo -e "${YELLOW}⚠️  Frontend server is already running on port 8000${NC}"
    FRONTEND_RUNNING=true
else
    FRONTEND_RUNNING=false
fi

echo ""

# Start Backend Server
if [ "$BACKEND_RUNNING" = false ]; then
    echo "🚀 Starting Backend Server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    pip install -q -r requirements.txt
    
    # Start backend in background
    echo -e "${GREEN}✓ Starting Flask backend on http://0.0.0.0:5001${NC}"
    nohup python app.py > backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > backend.pid
    
    cd ..
    sleep 2
else
    echo -e "${GREEN}✓ Backend already running${NC}"
fi

# Start Frontend Server
if [ "$FRONTEND_RUNNING" = false ]; then
    echo ""
    echo "🌐 Starting Frontend Server..."
    echo -e "${GREEN}✓ Starting HTTP server on http://0.0.0.0:8000${NC}"
    nohup python3 -m http.server 8000 > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > frontend.pid
    
    sleep 1
else
    echo -e "${GREEN}✓ Frontend already running${NC}"
fi

# Get IP address
IP_ADDRESS=$(get_ip)

echo ""
echo "======================================"
echo -e "${GREEN}✅ Servers Started Successfully!${NC}"
echo "======================================"
echo ""
echo "📱 Access URLs:"
echo "   Local Machine:"
echo "   - http://localhost:8000"
echo "   - http://127.0.0.1:8000"
echo ""
echo "   Other Machines on Network:"
echo -e "   - ${GREEN}http://${IP_ADDRESS}:8000${NC}"
echo ""
echo "🔧 Backend API:"
echo "   - http://localhost:5001"
echo -e "   - ${GREEN}http://${IP_ADDRESS}:5001${NC}"
echo ""
echo "🔍 Debug Tools:"
echo "   - Test Connection: http://localhost:8000/test_connection.html"
echo "   - Debug Console: http://localhost:8000/debug_booking.html"
echo ""
echo "📋 Pages:"
echo "   - Customer Booking: http://localhost:8000/index.html"
echo "   - Manager Login: http://localhost:8000/manager-login.html"
echo "   - Admin Setup: http://localhost:8000/admin-setup.html"
echo ""
echo "======================================"
echo ""
echo "📝 Log files:"
echo "   - Backend: backend/backend.log"
echo "   - Frontend: frontend.log"
echo ""
echo "🛑 To stop servers, run: ./stop.sh"
echo ""

# Save startup info
cat > .server_info << EOF
Backend PID: $(cat backend.pid 2>/dev/null || echo "N/A")
Frontend PID: $(cat frontend.pid 2>/dev/null || echo "N/A")
IP Address: $IP_ADDRESS
Started: $(date)
EOF

echo -e "${GREEN}✨ System is ready!${NC}"
