# Quick Setup Guide - macOS Apple Silicon

## Prerequisites Check

Before starting, ensure you have:

- [ ] macOS Ventura or later
- [ ] Apple Silicon (M1/M2/M3/M4) Mac
- [ ] At least 8GB RAM
- [ ] 5GB free disk space
- [ ] Internet connection for initial setup

## Step-by-Step Installation

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Python 3.10+

```bash
# Check current Python version
python3 --version

# If version < 3.10, install via Homebrew
brew install python@3.10
```

### 3. Install Node.js

```bash
# Install Node.js (LTS version)
brew install node

# Verify installation
node --version
npm --version
```

### 4. Clone Repository

```bash
# Clone the project
git clone https://github.com/Vedanthdamn/FlowSense.ai.git
cd FlowSense.ai
```

### 5. Run Automated Setup

```bash
# Make script executable
chmod +x run.sh

# Run the setup and start script
./run.sh
```

This script will:
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Install all Node.js dependencies  
- ✅ Generate sample traffic videos
- ✅ Start backend server on port 5000
- ✅ Start frontend server on port 3000

### 6. Access the Application

Open your browser and navigate to:
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/status

## Manual Setup (Alternative)

If the automated script doesn't work, follow these manual steps:

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run backend
python app.py
```

### Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Generate Sample Videos

```bash
# In a new terminal (from project root)
python3 generate_sample_videos.py
```

## Configuration

### Optional: Supabase Setup

1. Create a free account at https://supabase.com
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL and anon key
5. Edit `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
```

6. Run the SQL to create the table (see README.md)

## Troubleshooting

### Problem: "command not found: python3"
**Solution**: Install Python via Homebrew
```bash
brew install python@3.10
```

### Problem: "command not found: node"
**Solution**: Install Node.js via Homebrew
```bash
brew install node
```

### Problem: "No module named 'cv2'"
**Solution**: Reinstall opencv-python
```bash
pip uninstall opencv-python
pip install opencv-python-headless
```

### Problem: YOLOv8 not downloading
**Solution**: Manual download
```bash
cd backend
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

### Problem: Port already in use
**Solution**: Kill processes on ports
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Problem: npm install fails
**Solution**: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Testing the System

1. **Start the system** using `./run.sh`
2. **Open dashboard** at http://localhost:3000
3. **Select a demo video** from the dropdown (Sample 1, 2, or 3)
4. **Click "Start Processing"**
5. **Watch the dashboard** update in real-time

## Stopping the System

Press `Ctrl+C` in the terminal where you ran `./run.sh`

Or manually:
```bash
# Find and kill backend
ps aux | grep "python app.py"
kill <PID>

# Find and kill frontend
ps aux | grep "vite"
kill <PID>
```

## Next Steps

- Read the full [README.md](../README.md)
- Check [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
- Explore the code in `backend/` and `frontend/`
- Try training a custom model with `train.ipynb`

## Getting Help

- Check the [README.md](../README.md) for detailed documentation
- Open an issue on GitHub
- Review the code comments

---

**Estimated Setup Time**: 15-30 minutes (including downloads)

**System Requirements**:
- macOS with Apple Silicon
- 8GB RAM minimum
- 5GB free disk space
- Internet connection for initial setup
