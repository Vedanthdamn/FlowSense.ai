#!/bin/bash

# FlowSense.ai - AI-Based Adaptive Traffic Signal Control System
# Startup script for macOS Apple Silicon (M-series)

set -e

echo "=================================================="
echo "FlowSense.ai - Traffic Signal Control System"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    echo "Please install Python 3.10 or higher from https://www.python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓ Python and Node.js detected${NC}"
echo ""

# Function to setup backend
setup_backend() {
    echo "Setting up Backend..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Warning: .env file not found${NC}"
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${YELLOW}Please edit backend/.env with your Supabase credentials${NC}"
    fi
    
    cd ..
    echo -e "${GREEN}✓ Backend setup complete${NC}"
    echo ""
}

# Function to setup frontend
setup_frontend() {
    echo "Setting up Frontend..."
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    cd ..
    echo -e "${GREEN}✓ Frontend setup complete${NC}"
    echo ""
}

# Function to generate sample videos
generate_videos() {
    if [ ! -d "sample_videos" ] || [ -z "$(ls -A sample_videos 2>/dev/null)" ]; then
        echo "Generating sample traffic videos..."
        python3 generate_sample_videos.py
        echo -e "${GREEN}✓ Sample videos generated${NC}"
        echo ""
    else
        echo -e "${GREEN}✓ Sample videos already exist${NC}"
        echo ""
    fi
}

# Setup phase
echo "Step 1: Setting up Backend"
echo "----------------------------"
setup_backend

echo "Step 2: Setting up Frontend"
echo "----------------------------"
setup_frontend

echo "Step 3: Generating Sample Videos"
echo "---------------------------------"
generate_videos

# Start services
echo "=================================================="
echo "Starting Services"
echo "=================================================="
echo ""

# Start backend in background
echo "Starting Backend Server (Flask)..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend running on http://localhost:5000${NC}"
echo "  PID: $BACKEND_PID"
echo ""

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting Frontend Server (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend running on http://localhost:3000${NC}"
echo "  PID: $FRONTEND_PID"
echo ""

# Print status
echo "=================================================="
echo "System Status"
echo "=================================================="
echo ""
echo -e "${GREEN}✓ Backend:${NC}  http://localhost:5000"
echo -e "${GREEN}✓ Frontend:${NC} http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""
echo "=================================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "Services stopped."
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Wait for user interrupt
wait
