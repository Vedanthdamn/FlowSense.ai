# 🔧 FlowSense.ai Troubleshooting Guide

This comprehensive guide helps you resolve common issues, especially the **"Cannot connect to backend server"** error.

---

## 📑 Table of Contents

1. [Backend Connection Errors](#backend-connection-errors)
2. [Installation Issues](#installation-issues)
3. [Runtime Errors](#runtime-errors)
4. [Performance Issues](#performance-issues)
5. [Platform-Specific Issues](#platform-specific-issues)
6. [Advanced Debugging](#advanced-debugging)

---

## 🔴 Backend Connection Errors

### ⚠️ Error: "Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000"

This is the most common issue. Follow these steps in order:

#### Step 1: Verify Backend is Running

**Check if the backend process is running:**

```bash
# Check if any process is using port 5000
lsof -i :5000

# Or check for Python/Flask processes
ps aux | grep "python app.py"
```

**Expected output:** You should see a process running `python app.py`

**If no process is found:** The backend is not running. Continue to Step 2.

#### Step 2: Start the Backend Server

**Option A: Using the automated script (Recommended)**

```bash
cd /path/to/FlowSense.ai
./run.sh
```

**Option B: Manual startup**

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# If venv doesn't exist, create it first:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the backend
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

#### Step 3: Verify Backend Health

**Test the backend API directly:**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"Backend server is running","model_loaded":true}
```

**If you get an error or no response:**
- The backend failed to start properly
- Check the backend logs for error messages
- See [Backend Startup Failures](#backend-startup-failures)

#### Step 4: Check Firewall Settings

**macOS:**
```bash
# Check if port 5000 is blocked
sudo lsof -i :5000

# If firewall is blocking, add exception:
# System Preferences → Security & Privacy → Firewall → Firewall Options
# Add Python to allowed applications
```

**Linux:**
```bash
# Check firewall status
sudo ufw status

# Allow port 5000
sudo ufw allow 5000
```

**Windows:**
```bash
# Check if Windows Firewall is blocking
netstat -an | findstr "5000"

# Add firewall rule (PowerShell as Admin):
New-NetFirewallRule -DisplayName "FlowSense Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

#### Step 5: Verify Network Configuration

**Check localhost resolution:**

```bash
# Verify localhost resolves correctly
ping localhost

# Check hosts file
cat /etc/hosts | grep localhost
```

**Expected:** `127.0.0.1 localhost` should be present

**If you're using a different host/port:**

Edit `frontend/.env` (create if doesn't exist):
```env
VITE_API_BASE_URL=http://your-host:your-port
```

Then restart the frontend:
```bash
cd frontend
npm run dev
```

---

## 🛠️ Backend Startup Failures

### Error: "No module named 'flask'"

**Cause:** Python dependencies not installed

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Error: "No module named 'cv2'" or "No module named 'ultralytics'"

**Cause:** OpenCV or YOLOv8 not installed properly

**Solution:**

```bash
cd backend
source venv/bin/activate

# Uninstall any existing OpenCV
pip uninstall opencv-python opencv-python-headless -y

# Install headless version (recommended for servers)
pip install opencv-python-headless

# Reinstall all dependencies
pip install -r requirements.txt
```

### Error: "Address already in use" or "Port 5000 is already in use"

**Cause:** Another process is using port 5000

**Solution:**

```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or on Windows:
# netstat -ano | findstr :5000
# taskkill /PID <PID> /F

# Now start backend again
cd backend
source venv/bin/activate
python app.py
```

### Error: "YOLOv8 model not found"

**Cause:** YOLOv8 model file not downloaded

**Solution:**

```bash
cd backend

# Download YOLOv8 nano model manually
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt

# Or use curl
curl -L https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -o yolov8n.pt

# Verify file exists
ls -lh yolov8n.pt
```

### Error: "ModuleNotFoundError: No module named 'torch'"

**Cause:** PyTorch not installed

**Solution:**

```bash
cd backend
source venv/bin/activate

# For CPU-only systems
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# For systems with CUDA (GPU)
pip install torch torchvision

# For Apple Silicon (M1/M2/M3/M4)
pip install torch torchvision
```

---

## 📦 Installation Issues

### Error: "python3: command not found"

**macOS:**
```bash
# Install via Homebrew
brew install python@3.10

# Add to PATH
echo 'export PATH="/usr/local/opt/python@3.10/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
```

**Windows (WSL):**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
```

### Error: "node: command not found"

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Windows:**
Download from https://nodejs.org/

### Error: "Permission denied" when running `./run.sh`

**Solution:**
```bash
# Make script executable
chmod +x run.sh

# Run the script
./run.sh
```

### Error: "npm ERR! code EACCES" (Permission errors during npm install)

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🏃 Runtime Errors

### Error: "Failed to fetch traffic status"

**Cause:** Backend is not responding or processing failed

**Debug steps:**

1. **Check backend logs:**
   ```bash
   # Backend should be running in a terminal
   # Look for error messages in that terminal
   ```

2. **Verify video source:**
   ```bash
   # Check if sample videos exist
   ls -la sample_videos/
   
   # If missing, generate them:
   python3 generate_sample_videos.py
   ```

3. **Test with a simple video:**
   - Use "Traffic Sample 1" from the dropdown
   - Don't use webcam if it's not available

### Error: "Video file not found" or "Cannot open video"

**Solution:**

```bash
# Generate sample videos
python3 generate_sample_videos.py

# Verify they exist
ls -la sample_videos/

# Expected output:
# traffic_sample1.mp4
# traffic_sample2.mp4
# traffic_sample3.mp4
```

### Frontend shows blank page

**Debug steps:**

1. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   
2. **Verify frontend is running:**
   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   
   # If not running, start frontend:
   cd frontend
   npm run dev
   ```

3. **Clear browser cache:**
   - Hard reload: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

---

## ⚡ Performance Issues

### Issue: Low FPS (frames per second) in detection

**Solutions:**

1. **Use a smaller YOLOv8 model:**
   ```python
   # Edit backend/app.py
   model = YOLO('yolov8n.pt')  # nano - fastest
   # Instead of:
   # model = YOLO('yolov8s.pt')  # small
   # model = YOLO('yolov8m.pt')  # medium
   ```

2. **Reduce video resolution:**
   ```python
   # In backend/app.py, resize frames
   frame = cv2.resize(frame, (640, 480))
   ```

3. **Skip frames:**
   ```python
   # Process every 2nd or 3rd frame
   if frame_count % 2 == 0:
       results = model(frame)
   ```

### Issue: High CPU/Memory usage

**Solutions:**

1. **Close other applications**

2. **Use CPU-only mode (disable GPU):**
   ```bash
   # Edit backend/app.py
   # Add this before model loading:
   import os
   os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
   ```

3. **Limit history size:**
   ```python
   # In backend/app.py
   # Reduce MAX_HISTORY_SIZE
   MAX_HISTORY_SIZE = 50  # Instead of 100
   ```

---

## 💻 Platform-Specific Issues

### macOS Apple Silicon (M1/M2/M3/M4)

#### Issue: "Platform not supported" or TensorFlow/PyTorch errors

**Solution:**
```bash
# Use native Apple Silicon builds
cd backend
source venv/bin/activate

# Install PyTorch with MPS support
pip install torch torchvision

# Verify MPS is available
python3 -c "import torch; print(f'MPS available: {torch.backends.mps.is_available()}')"
```

#### Issue: Rosetta warnings or Intel-based binaries

**Solution:**
```bash
# Ensure you're using native ARM Python
which python3
# Should show: /opt/homebrew/bin/python3 (not /usr/local/bin)

# Reinstall Python via Homebrew ARM
arch -arm64 brew install python@3.10
```

### Linux

#### Issue: "libGL.so.1: cannot open shared object file"

**Solution:**
```bash
# Install OpenGL libraries
sudo apt-get update
sudo apt-get install -y libgl1-mesa-glx libglib2.0-0
```

#### Issue: "GLIBC version" errors

**Solution:**
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade

# Check GLIBC version
ldd --version
```

### Windows (WSL)

#### Issue: "WSL 2 requires an update to its kernel component"

**Solution:**
```powershell
# In PowerShell (Admin)
wsl --update
wsl --shutdown
# Restart WSL
```

#### Issue: Camera/Webcam not accessible

**Solution:**
```bash
# WSL doesn't support direct USB camera access
# Use video files instead of webcam option
```

---

## 🔍 Advanced Debugging

### Enable Detailed Logging

**Backend:**

Edit `backend/app.py` and add at the top:

```python
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

**Frontend:**

Browser console automatically shows all logs. Press F12 → Console tab.

### Test Backend API Manually

```bash
# Test status endpoint
curl -v http://localhost:5000/api/status

# Test start processing
curl -X POST http://localhost:5000/api/start \
  -H "Content-Type: application/json" \
  -d '{"video_path": "sample_videos/traffic_sample1.mp4"}'

# Test stop processing
curl -X POST http://localhost:5000/api/stop

# Test history (requires Supabase)
curl http://localhost:5000/api/history
```

### Check Process Details

```bash
# View all running processes
ps aux | grep -E "python|node"

# Check port usage
netstat -tuln | grep -E "5000|3000"

# On macOS
lsof -i :5000
lsof -i :3000

# Check system resources
top  # Press 'q' to quit
```

### Test with Minimal Setup

Create a simple test file to verify backend basics:

```python
# test_backend.py
import sys
print(f"Python version: {sys.version}")

try:
    import flask
    print(f"✓ Flask installed: {flask.__version__}")
except:
    print("✗ Flask not installed")

try:
    import cv2
    print(f"✓ OpenCV installed: {cv2.__version__}")
except:
    print("✗ OpenCV not installed")

try:
    from ultralytics import YOLO
    print("✓ Ultralytics/YOLOv8 installed")
except:
    print("✗ Ultralytics not installed")

try:
    import torch
    print(f"✓ PyTorch installed: {torch.__version__}")
except:
    print("✗ PyTorch not installed")
```

Run it:
```bash
cd backend
source venv/bin/activate
python test_backend.py
```

### Reset Everything

If nothing works, start fresh:

```bash
# Navigate to project directory
cd FlowSense.ai

# Remove all generated files
rm -rf backend/venv
rm -rf backend/__pycache__
rm -rf frontend/node_modules
rm -rf frontend/dist
rm -rf sample_videos

# Start fresh
./run.sh
```

---

## 📞 Getting Help

If you've tried everything above and still have issues:

1. **Check existing GitHub issues:**
   - https://github.com/Vedanthdamn/FlowSense.ai/issues
   - Search for your error message

2. **Create a new issue with:**
   - Operating system and version
   - Python version (`python3 --version`)
   - Node.js version (`node --version`)
   - Complete error message and stack trace
   - Steps you've already tried
   - Output of `python test_backend.py` (from Advanced Debugging section)

3. **Include system information:**
   ```bash
   # System info
   uname -a
   python3 --version
   node --version
   npm --version
   
   # Port status
   lsof -i :5000
   lsof -i :3000
   
   # Process status
   ps aux | grep -E "python|node"
   ```

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Python 3.10+ is installed: `python3 --version`
- [ ] Node.js 18+ is installed: `node --version`
- [ ] Virtual environment is activated: `which python` (should show venv path)
- [ ] All dependencies are installed: `pip list | grep flask`
- [ ] Backend is running: `lsof -i :5000`
- [ ] Backend responds to health check: `curl http://localhost:5000/api/health`
- [ ] Frontend is running: `lsof -i :3000`
- [ ] Sample videos exist: `ls sample_videos/`
- [ ] Port 5000 is not blocked by firewall
- [ ] No other application is using port 5000 or 3000

---

## 🔄 Common Workflow Issues

### Issue: Changes to backend code not reflected

**Solution:**
```bash
# Stop backend (Ctrl+C)
# Restart backend
cd backend
source venv/bin/activate
python app.py
```

### Issue: Changes to frontend code not reflected

**Solution:**
```bash
# Vite has hot reload, but if it doesn't work:
# Stop frontend (Ctrl+C)
# Clear cache and restart
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Issue: "Module not found" after installing new package

**Solution:**
```bash
# Backend
cd backend
source venv/bin/activate
pip install <package-name>
pip freeze > requirements.txt

# Frontend
cd frontend
npm install <package-name>
```

---

## 📚 Related Documentation

- [README.md](README.md) - Main project documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) - Detailed setup instructions
- [ERROR_HANDLING.md](docs/ERROR_HANDLING.md) - Error handling implementation
- [PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) - Complete technical docs

---

**Last Updated:** October 2024

**Made with ❤️ for the FlowSense.ai community**

---

*If this guide helped you solve your issue, please consider giving the project a ⭐ on GitHub!*
