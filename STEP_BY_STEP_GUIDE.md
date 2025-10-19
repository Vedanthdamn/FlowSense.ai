# 📖 Complete Step-by-Step Guide for FlowSense.ai

Welcome to FlowSense.ai! This comprehensive guide will walk you through every step from installation to contribution.

---

## 📋 Table of Contents

1. [Prerequisites Setup](#1-prerequisites-setup)
2. [Installation](#2-installation)
3. [Configuration](#3-configuration)
4. [Running the Application](#4-running-the-application)
5. [Using the Dashboard](#5-using-the-dashboard)
6. [Training Custom Models](#6-training-custom-models)
7. [Making Changes & Contributing](#7-making-changes--contributing)
8. [Testing Your Changes](#8-testing-your-changes)
9. [Submitting Your Work](#9-submitting-your-work)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites Setup

### Step 1.1: Check Your System

Before starting, verify you have:
- macOS, Linux, or Windows with WSL
- At least 8GB RAM
- 5GB free disk space
- Internet connection

```bash
# Check system info
uname -a
free -h  # Check available RAM
df -h    # Check disk space
```

### Step 1.2: Install Python

**macOS:**
```bash
# Check if Python is installed
python3 --version

# If not installed or version < 3.10
brew install python@3.10

# Verify installation
python3 --version  # Should show 3.10 or higher
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
```

**Windows (WSL):**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
```

### Step 1.3: Install Node.js

**macOS:**
```bash
# Install Node.js
brew install node

# Verify installation
node --version   # Should show v18 or higher
npm --version    # Should show 9 or higher
```

**Linux:**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### Step 1.4: Install Git

**macOS:**
```bash
# Git is usually pre-installed, check with:
git --version

# If not installed:
brew install git
```

**Linux:**
```bash
sudo apt install git
git --version
```

### Step 1.5: (Optional) Install Jupyter Notebook

Only needed if you plan to train custom models:

```bash
pip3 install jupyter notebook
jupyter --version
```

---

## 2. Installation

### Step 2.1: Clone the Repository

```bash
# Create a directory for your projects (optional)
mkdir -p ~/projects
cd ~/projects

# Clone the repository
git clone https://github.com/Vedanthdamn/FlowSense.ai.git

# Navigate into the project
cd FlowSense.ai

# List files to verify
ls -la
```

You should see:
- `backend/` - Python Flask API
- `frontend/` - React dashboard
- `docs/` - Documentation
- `run.sh` - Automated setup script
- `README.md` - Main documentation

### Step 2.2: Automated Setup (Recommended)

The easiest way to set up everything:

```bash
# Make the script executable
chmod +x run.sh

# Run the automated setup
./run.sh
```

The script will:
1. Create Python virtual environment
2. Install all Python dependencies (Flask, YOLOv8, OpenCV)
3. Install all Node.js dependencies (React, Vite, Tailwind)
4. Generate 3 sample traffic videos
5. Start the backend server on port 5000
6. Start the frontend server on port 3000

**⏱ Estimated time:** 5-10 minutes

**Skip to [Section 5: Using the Dashboard](#5-using-the-dashboard) if automated setup succeeds!**

### Step 2.3: Manual Backend Setup (Alternative)

If the automated script fails, follow these manual steps:

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows (WSL):
source venv/bin/activate

# Your prompt should now show (venv)

# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# This installs:
# - Flask (web framework)
# - opencv-python (computer vision)
# - ultralytics (YOLOv8)
# - torch (deep learning)
# - numpy (numerical computing)
# - supabase (database client)
# - python-dotenv (environment variables)
```

**⏱ Estimated time:** 3-5 minutes

### Step 2.4: Manual Frontend Setup (Alternative)

In a **new terminal window**:

```bash
# Navigate to frontend directory
cd FlowSense.ai/frontend

# Install dependencies
npm install

# This installs:
# - React (UI library)
# - Vite (build tool)
# - Tailwind CSS (styling)
# - Axios (HTTP client)
# - Lucide React (icons)
```

**⏱ Estimated time:** 2-3 minutes

### Step 2.5: Generate Sample Videos

In another **new terminal window**:

```bash
# From project root
cd FlowSense.ai

# Generate sample traffic videos
python3 generate_sample_videos.py
```

This creates 3 sample videos in `sample_videos/` directory:
- `traffic_sample1.mp4` - Light traffic
- `traffic_sample2.mp4` - Medium traffic
- `traffic_sample3.mp4` - Heavy traffic

**⏱ Estimated time:** 1-2 minutes

---

## 3. Configuration

### Step 3.1: Basic Configuration (Optional)

The system works out-of-the-box, but you can customize settings:

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit the file (use any text editor)
nano .env
# or
vim .env
# or
code .env  # If you have VS Code
```

### Step 3.2: Supabase Setup (Optional)

To enable historical traffic logging and analytics:

**Step 3.2.1:** Create a Supabase account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be ready (2-3 minutes)

**Step 3.2.2:** Create the database table

1. In your Supabase project, go to the SQL Editor
2. Create a new query
3. Paste and run this SQL:

```sql
CREATE TABLE traffic_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lane TEXT NOT NULL,
  vehicle_count INTEGER NOT NULL,
  signal_time INTEGER NOT NULL,
  north_count INTEGER DEFAULT 0,
  south_count INTEGER DEFAULT 0,
  east_count INTEGER DEFAULT 0,
  west_count INTEGER DEFAULT 0
);

-- Add index for faster queries
CREATE INDEX idx_traffic_logs_timestamp ON traffic_logs(timestamp DESC);
```

**Step 3.2.3:** Get API credentials

1. Go to Project Settings → API
2. Copy the following:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - `anon` / `public` API key

**Step 3.2.4:** Update configuration

```bash
cd backend
nano .env
```

Add your credentials:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
FLASK_ENV=development
FLASK_DEBUG=0
```

Save the file (Ctrl+O, Enter, Ctrl+X in nano)

### Step 3.3: Verify Configuration

```bash
# Check if .env file exists and has correct format
cd backend
cat .env

# Should show your Supabase credentials (if configured)
```

---

## 4. Running the Application

### Step 4.1: Start the Backend Server

**If you used automated setup**, the servers are already running! Skip to [Section 5](#5-using-the-dashboard).

**For manual setup:**

```bash
# Open Terminal 1
cd FlowSense.ai/backend

# Activate virtual environment
source venv/bin/activate

# Run the backend
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

**✅ Backend is now running!** Keep this terminal open.

### Step 4.2: Start the Frontend Server

```bash
# Open Terminal 2 (new terminal window)
cd FlowSense.ai/frontend

# Start development server
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

**✅ Frontend is now running!** Keep this terminal open too.

### Step 4.3: Verify Both Services

Open a **third terminal** and test the API:

```bash
# Test backend health
curl http://localhost:5000/api/health

# Should return:
# {"status":"healthy","model_loaded":true,...}

# Test backend status
curl http://localhost:5000/api/status

# Should return traffic data JSON
```

---

## 5. Using the Dashboard

### Step 5.1: Access the Dashboard

1. Open your web browser (Chrome, Safari, or Firefox recommended)
2. Navigate to: **http://localhost:3000**
3. You should see the FlowSense.ai dashboard

### Step 5.2: Understanding the Dashboard

The dashboard has 4 main sections:

1. **Header** - Project title and description
2. **Control Panel** - Start/stop video processing
3. **Traffic Junction View** - Visual representation of the 4-way intersection
4. **Statistics Panel** - Signal timer, lane density, and history

### Step 5.3: Start Processing Video

**Step 5.3.1:** Select a video source

In the Control Panel, you'll see a dropdown menu with options:
- **Traffic Sample 1** - Light traffic scenario
- **Traffic Sample 2** - Medium traffic scenario
- **Traffic Sample 3** - Heavy traffic scenario
- **Webcam** - Use your computer's camera (if available)
- **Custom Path** - Enter a path to your own video file

Select "Traffic Sample 1" for your first test.

**Step 5.3.2:** Click "Start Processing"

Click the green "Start Processing" button. You should see:
1. The button changes to "Stop Processing" (red)
2. Traffic junction lights start updating
3. Signal timer starts counting down
4. Vehicle counts appear in the density bars
5. (If Supabase configured) History table populates

**Step 5.3.3:** Observe the system in action

Watch how the system works:
- **North lane** gets green light first
- **Vehicle counts** are detected and displayed
- **Signal timing** adapts based on traffic density
  - More vehicles = longer green light (up to 90 seconds)
  - Fewer vehicles = shorter green light (minimum 15 seconds)
- **Timer** counts down the remaining time
- After North completes, it moves to **South**, then **East**, then **West**
- The cycle repeats continuously

### Step 5.4: Monitor Different Lanes

Each lane shows:
- **Current signal state** (Green, Red, or Yellow transition)
- **Vehicle count** (detected by YOLOv8)
- **Allocated time** (in seconds)
- **Density bar** (visual representation)

### Step 5.5: View Traffic History

If you configured Supabase, scroll down to see the **Traffic History** table:
- **Timestamp** - When the signal changed
- **Lane** - Which lane was active
- **Vehicle Count** - Number of vehicles detected
- **Signal Time** - Duration of green light
- **All Lanes** - Counts from all four directions

### Step 5.6: Stop Processing

When you're done observing:
1. Click the red "Stop Processing" button
2. Video processing stops
3. All counters freeze at their last values

---

## 6. Training Custom Models

If you want to train YOLOv8 on your own vehicle dataset:

### Step 6.1: Prepare Your Dataset

**Option 1: Use a public dataset**

```bash
# Install Kaggle CLI
pip install kaggle

# Setup Kaggle credentials
mkdir -p ~/.kaggle
# Place your kaggle.json in ~/.kaggle/
# Get it from: https://www.kaggle.com/settings/account

# Download a vehicle dataset
kaggle datasets download -d sshikamaru/car-object-detection
unzip car-object-detection.zip -d vehicle_dataset
```

**Option 2: Use Roboflow datasets**
- Visit https://universe.roboflow.com/
- Search for "vehicle detection"
- Download in YOLO format

**Option 3: Create your own dataset**
- Use [LabelImg](https://github.com/tzutalin/labelImg) to annotate
- Save annotations in YOLO format

### Step 6.2: Organize Dataset

Your dataset should be structured:
```
vehicle_dataset/
├── data.yaml
├── images/
│   ├── train/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   └── val/
│       ├── image1.jpg
│       └── ...
└── labels/
    ├── train/
    │   ├── image1.txt
    │   ├── image2.txt
    │   └── ...
    └── val/
        ├── image1.txt
        └── ...
```

### Step 6.3: Open Training Notebook

```bash
# From project root
cd FlowSense.ai

# Start Jupyter Notebook
jupyter notebook train.ipynb
```

Your browser will open with the Jupyter interface.

### Step 6.4: Configure Training

In the notebook:

1. **Cell 1:** Install dependencies (run it)
2. **Cell 2:** Create `data.yaml` file - edit the paths:

```yaml
path: /path/to/your/vehicle_dataset
train: images/train
val: images/val

nc: 4  # Number of classes
names: ['car', 'motorcycle', 'bus', 'truck']
```

3. **Cell 3:** Load YOLOv8 model (run it)

### Step 6.5: Start Training

```python
# In the notebook, run the training cell
results = model.train(
    data='data.yaml',
    epochs=50,              # Number of training cycles
    imgsz=640,              # Image size
    batch=16,               # Batch size (reduce if out of memory)
    name='vehicle_detection',
    device='mps'            # 'mps' for Apple Silicon, 'cuda' for NVIDIA GPU, 'cpu' for CPU
)
```

**⏱ Training time:** 2-6 hours depending on:
- Dataset size
- Number of epochs
- Hardware (GPU > MPS > CPU)

### Step 6.6: Monitor Training

Watch the output for:
- **Loss values** decreasing (good sign)
- **mAP (mean Average Precision)** increasing (good sign)
- **Training plots** saved to `runs/detect/vehicle_detection/`

### Step 6.7: Use Your Custom Model

After training completes:

```bash
# Copy the best model weights
cp runs/detect/vehicle_detection/weights/best.pt backend/yolov8_custom.pt

# Edit backend/app.py
cd backend
nano app.py
```

Find this line:
```python
model = YOLO('yolov8n.pt')
```

Change it to:
```python
model = YOLO('yolov8_custom.pt')
```

Save and restart the backend server.

---

## 7. Making Changes & Contributing

### Step 7.1: Understand Git Workflow

```bash
# Check current branch
git branch

# See what's changed
git status

# View differences
git diff
```

### Step 7.2: Create a New Branch

**Never work directly on `main` branch!**

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes:
git checkout -b fix/your-bug-fix

# Verify you're on the new branch
git branch
# Should show * next to your new branch
```

### Step 7.3: Make Your Changes

**Example 1: Modify signal timing parameters**

```bash
# Edit the backend code
cd backend
nano app.py

# Find the timing constants (around line 20):
MIN_TIME = 15  # Change to your desired minimum
MAX_TIME = 90  # Change to your desired maximum
TOTAL_CYCLE_TIME = 120  # Change total cycle time

# Save and exit (Ctrl+O, Enter, Ctrl+X)
```

**Example 2: Add a new vehicle class**

```bash
# Edit the vehicle detection classes
cd backend
nano app.py

# Find the vehicle classes list:
vehicle_classes = [2, 3, 5, 7]  # car, motorcycle, bus, truck

# Add more classes if needed (see COCO classes)
# Save the file
```

**Example 3: Modify the dashboard UI**

```bash
# Edit frontend components
cd frontend/src/components
nano TrafficJunction.jsx

# Make your UI changes
# Save the file
```

### Step 7.4: Test Your Changes

**For backend changes:**
```bash
cd backend
source venv/bin/activate
python app.py

# In another terminal, test the API
curl http://localhost:5000/api/status
```

**For frontend changes:**
```bash
cd frontend
npm run dev

# Open browser and check http://localhost:3000
```

### Step 7.5: Check Code Quality

**Python code:**
```bash
cd backend
pip install black flake8

# Format code
black .

# Check for errors
flake8 .
```

**JavaScript code:**
```bash
cd frontend
npm run lint
npm run build  # Ensure no build errors
```

---

## 8. Testing Your Changes

### Step 8.1: Manual Testing

1. **Start both servers** (backend and frontend)
2. **Open the dashboard** in your browser
3. **Test the specific feature** you changed
4. **Try different scenarios**:
   - All sample videos
   - Different traffic conditions
   - Edge cases (empty lanes, all lanes full, etc.)

### Step 8.2: API Testing

```bash
# Test status endpoint
curl -X GET http://localhost:5000/api/status

# Test start endpoint
curl -X POST http://localhost:5000/api/start \
  -H "Content-Type: application/json" \
  -d '{"video_path": "sample_videos/traffic_sample1.mp4"}'

# Test stop endpoint
curl -X POST http://localhost:5000/api/stop

# Test health endpoint
curl -X GET http://localhost:5000/api/health
```

### Step 8.3: Integration Testing

Test the complete flow:
1. Start processing
2. Watch for 2-3 complete cycles
3. Verify all lanes get proper timing
4. Check if Supabase logging works (if configured)
5. Stop processing
6. Restart and verify it works again

---

## 9. Submitting Your Work

### Step 9.1: Review Your Changes

```bash
# See what files changed
git status

# Review the actual changes
git diff

# Check all changes including staged files
git diff HEAD
```

### Step 9.2: Stage Your Changes

```bash
# Stage specific files
git add backend/app.py
git add frontend/src/components/TrafficJunction.jsx

# Or stage all changes (be careful!)
git add .

# Verify what's staged
git status
```

### Step 9.3: Commit Your Changes

```bash
# Commit with a clear message
git commit -m "feat: add emergency vehicle priority detection"

# Or for bug fixes:
git commit -m "fix: resolve memory leak in video processing"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Step 9.4: Push to Your Fork

```bash
# First time pushing this branch
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### Step 9.5: Create a Pull Request

1. Go to https://github.com/Vedanthdamn/FlowSense.ai
2. You'll see a banner: "Compare & pull request" - click it
3. Fill in the PR template:
   - **Title:** Clear, descriptive title
   - **Description:** 
     - What changes did you make?
     - Why are these changes needed?
     - How to test the changes?
     - Screenshots (if UI changes)
     - Related issues (if any)
4. Click "Create Pull Request"

### Step 9.6: Respond to Review Feedback

After submitting:
1. **Wait for review** from maintainers
2. **Address feedback** if changes are requested
3. **Make additional commits** to the same branch
4. **Push updates** - they'll automatically appear in the PR
5. **Thank the reviewers** for their time

---

## 10. Troubleshooting

### Issue 1: Python Not Found

**Symptom:**
```
bash: python3: command not found
```

**Solution:**
```bash
# macOS
brew install python@3.10

# Linux
sudo apt update
sudo apt install python3.10
```

### Issue 2: Node Not Found

**Symptom:**
```
bash: node: command not found
```

**Solution:**
```bash
# macOS
brew install node

# Linux
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Issue 3: Port Already in Use

**Symptom:**
```
Address already in use
Port 5000 is already in use
```

**Solution:**
```bash
# Find process using the port
lsof -ti:5000  # For backend
lsof -ti:3000  # For frontend

# Kill the process
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Issue 4: Module Not Found

**Symptom:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
```bash
# Make sure virtual environment is activated
cd backend
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 5: OpenCV Issues on macOS

**Symptom:**
```
ImportError: cannot import name 'cv2'
```

**Solution:**
```bash
# Uninstall existing opencv
pip uninstall opencv-python opencv-python-headless

# Install headless version (works better on macOS)
pip install opencv-python-headless
```

### Issue 6: YOLOv8 Model Download Fails

**Symptom:**
```
Error downloading yolov8n.pt
```

**Solution:**
```bash
# Manual download (Note: v0.0.0 is the official release tag used by Ultralytics)
cd backend
curl -L https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -o yolov8n.pt

# Or use wget
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt

# Alternatively, let Ultralytics auto-download on first run
python3 -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### Issue 7: npm Install Fails

**Symptom:**
```
npm ERR! code ENOENT
```

**Solution:**
```bash
cd frontend

# Clear npm cache
npm cache clean --force

# Remove old files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 8: Supabase Connection Error

**Symptom:**
```
Error connecting to Supabase
```

**Solution:**
```bash
# Check .env file
cd backend
cat .env

# Verify:
# 1. SUPABASE_URL is correct
# 2. SUPABASE_KEY is the anon/public key (not service_role)
# 3. No extra spaces or quotes
# 4. Table exists in Supabase
```

### Issue 9: Video Not Processing

**Symptom:**
Dashboard starts but no vehicle counts appear

**Solution:**
1. Check if sample videos exist:
```bash
ls -la sample_videos/
```

2. Generate them if missing:
```bash
python3 generate_sample_videos.py
```

3. Check backend logs in terminal
4. Try a different video source

### Issue 10: High CPU Usage

**Symptom:**
Computer fan runs loud, system is slow

**Solution:**
1. Stop the processing when not actively testing
2. Reduce frame processing rate in `app.py`:
```python
# Add frame skip
frame_count = 0
while True:
    frame_count += 1
    if frame_count % 2 == 0:  # Process every 2nd frame
        continue
```

3. Use smaller model:
```python
model = YOLO('yolov8n.pt')  # Nano - fastest
# Instead of yolov8s.pt, yolov8m.pt, etc.
```

### Issue 11: Browser Not Loading Dashboard

**Symptom:**
`http://localhost:3000` shows "Unable to connect"

**Solution:**
1. Check if frontend is running:
```bash
curl http://localhost:3000
```

2. Check terminal logs for errors
3. Restart frontend:
```bash
cd frontend
npm run dev
```

4. Try different browser
5. Clear browser cache

### Issue 12: Git Push Fails

**Symptom:**
```
! [rejected] feature/xyz -> feature/xyz (fetch first)
```

**Solution:**
```bash
# Pull latest changes
git pull origin feature/xyz

# If conflicts, resolve them
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "Resolve merge conflicts"

# Push again
git push
```

---

## 📚 Additional Resources

### Documentation
- **Main README:** [README.md](README.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Setup Guide:** [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- **Project Docs:** [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)

### External Resources
- **YOLOv8 Docs:** https://docs.ultralytics.com/
- **Flask Docs:** https://flask.palletsprojects.com/
- **React Docs:** https://react.dev/
- **Supabase Docs:** https://supabase.com/docs

### Support
- **GitHub Issues:** https://github.com/Vedanthdamn/FlowSense.ai/issues
- **Discussions:** Check the Discussions tab on GitHub

---

## ✅ Quick Reference Commands

```bash
# SETUP
git clone https://github.com/Vedanthdamn/FlowSense.ai.git
cd FlowSense.ai
chmod +x run.sh
./run.sh

# MANUAL START
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python app.py

# Terminal 2 - Frontend  
cd frontend && npm run dev

# TESTING
curl http://localhost:5000/api/health
curl http://localhost:5000/api/status

# DEVELOPMENT
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: description"
git push -u origin feature/my-feature

# TROUBLESHOOTING
lsof -ti:5000 | xargs kill -9  # Kill backend
lsof -ti:3000 | xargs kill -9  # Kill frontend
```

---

## 🎯 Summary Checklist

After completing this guide, you should be able to:

- [x] Install all prerequisites (Python, Node.js, Git)
- [x] Clone and set up the FlowSense.ai repository
- [x] Run both backend and frontend servers
- [x] Access and use the dashboard
- [x] Process traffic videos and see adaptive signals
- [x] (Optional) Configure Supabase for logging
- [x] (Optional) Train custom YOLOv8 models
- [x] Make code changes in a new branch
- [x] Test your changes
- [x] Submit a pull request
- [x] Troubleshoot common issues

---

**Congratulations!** 🎉 You now have a complete understanding of FlowSense.ai from installation to contribution!

For questions or issues, please open a GitHub issue or check the documentation.

**Happy Coding!** 🚦💻
