"""
Main Flask Application for AI-Based Adaptive Traffic Signal Control System
Handles vehicle detection using YOLOv8 and adaptive signal timing
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
from datetime import datetime
import threading
import time
from collections import defaultdict
from supabase_logger import SupabaseLogger

app = Flask(__name__)
# Configure CORS to allow requests from frontend (localhost:3000)
CORS(app, resources={r"/*": {"origins": "*"}})

# Global variables
model = None
current_lane_counts = {"North": 0, "South": 0, "East": 0, "West": 0}
signal_timings = {"North": 30, "South": 30, "East": 30, "West": 30}
current_active_lane = "North"
signal_start_time = time.time()
traffic_history = []
processing_video = False
video_path = None

# Initialize Supabase logger
supabase_logger = SupabaseLogger()

# Vehicle classes from COCO dataset
VEHICLE_CLASSES = ['car', 'motorcycle', 'bus', 'truck']

def load_model():
    """Load YOLOv8 model"""
    global model
    try:
        # Try to load pretrained YOLOv8 model
        model_path = os.path.join(os.path.dirname(__file__), 'yolov8n.pt')
        if not os.path.exists(model_path):
            print("Downloading YOLOv8 model...")
            from ultralytics import YOLO
            model = YOLO('yolov8n.pt')  # This will auto-download
        else:
            model = YOLO(model_path)
        print("YOLOv8 model loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def count_vehicles(frame):
    """Count vehicles in a frame using YOLOv8"""
    global model
    if model is None:
        return 0
    
    try:
        results = model(frame, verbose=False)
        vehicle_count = 0
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls = int(box.cls[0])
                class_name = model.names[cls]
                if class_name in VEHICLE_CLASSES:
                    vehicle_count += 1
        
        return vehicle_count
    except Exception as e:
        print(f"Error counting vehicles: {e}")
        return 0

def calculate_adaptive_timing(lane_counts):
    """
    Calculate adaptive signal timing based on vehicle counts
    Uses weighted distribution based on traffic density
    """
    total_vehicles = sum(lane_counts.values())
    
    if total_vehicles == 0:
        # Default timing when no vehicles
        return {lane: 30 for lane in lane_counts.keys()}
    
    # Minimum and maximum timing constraints
    MIN_TIME = 15
    MAX_TIME = 90
    TOTAL_CYCLE_TIME = 120
    
    timings = {}
    for lane, count in lane_counts.items():
        # Calculate proportional time
        if total_vehicles > 0:
            proportion = count / total_vehicles
            time_allocated = int(TOTAL_CYCLE_TIME * proportion)
        else:
            time_allocated = TOTAL_CYCLE_TIME // len(lane_counts)
        
        # Apply constraints
        time_allocated = max(MIN_TIME, min(MAX_TIME, time_allocated))
        timings[lane] = time_allocated
    
    return timings

def process_video_stream(video_source):
    """Process video stream and update vehicle counts"""
    global current_lane_counts, signal_timings, processing_video
    
    cap = cv2.VideoCapture(video_source)
    
    # Simulate 4 lanes by dividing frame into quadrants
    lane_positions = {
        "North": (0, 0, 0.5, 0.5),    # Top-left quadrant
        "South": (0.5, 0.5, 1, 1),    # Bottom-right quadrant
        "East": (0.5, 0, 1, 0.5),     # Top-right quadrant
        "West": (0, 0.5, 0.5, 1)      # Bottom-left quadrant
    }
    
    while processing_video and cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            # Loop video
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        
        height, width = frame.shape[:2]
        
        # Process each lane
        for lane, (x1, y1, x2, y2) in lane_positions.items():
            # Extract lane region
            x1_px, y1_px = int(width * x1), int(height * y1)
            x2_px, y2_px = int(width * x2), int(height * y2)
            lane_frame = frame[y1_px:y2_px, x1_px:x2_px]
            
            # Count vehicles in lane
            count = count_vehicles(lane_frame)
            current_lane_counts[lane] = count
        
        # Update signal timings
        signal_timings = calculate_adaptive_timing(current_lane_counts)
        
        # Small delay to prevent excessive processing
        time.sleep(0.5)
    
    cap.release()

def signal_controller():
    """Control traffic signals based on adaptive timing"""
    global current_active_lane, signal_start_time, current_lane_counts, signal_timings
    
    lanes = ["North", "South", "East", "West"]
    lane_index = 0
    
    while True:
        current_active_lane = lanes[lane_index]
        current_time = signal_timings[current_active_lane]
        signal_start_time = time.time()
        
        # Log to Supabase
        log_data = {
            "lane": current_active_lane,
            "vehicle_count": current_lane_counts[current_active_lane],
            "signal_time": current_time,
            "all_counts": current_lane_counts.copy()
        }
        supabase_logger.log_traffic_event(log_data)
        
        # Wait for signal duration
        time.sleep(current_time)
        
        # Move to next lane
        lane_index = (lane_index + 1) % len(lanes)

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current traffic status"""
    elapsed = int(time.time() - signal_start_time)
    remaining = max(0, signal_timings[current_active_lane] - elapsed)
    
    response_data = {
        "success": True,
        "data": {
            "current_lane": current_active_lane,
            "lane_counts": current_lane_counts,
            "signal_timings": signal_timings,
            "remaining_time": remaining,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    # Log API response for debugging
    print(f"[API] GET /api/status - Response: {response_data['data']['current_lane']}, Vehicle counts: {current_lane_counts}")
    
    return jsonify(response_data)

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get traffic history from Supabase"""
    try:
        history = supabase_logger.get_recent_logs(limit=50)
        print(f"[API] GET /api/history - Retrieved {len(history) if history else 0} records")
        return jsonify({
            "success": True,
            "data": history
        })
    except Exception as e:
        print(f"[API] GET /api/history - Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/start', methods=['POST'])
def start_processing():
    """Start video processing"""
    global processing_video, video_path
    
    data = request.json
    video_source = data.get('video_path', 0)  # 0 for webcam
    
    print(f"[API] POST /api/start - Request received with video_source: {video_source}")
    
    if processing_video:
        print("[API] POST /api/start - Already processing, returning 400")
        return jsonify({
            "success": False,
            "message": "Already processing"
        }), 400
    
    processing_video = True
    video_path = video_source
    
    # Start video processing in background thread
    thread = threading.Thread(target=process_video_stream, args=(video_source,))
    thread.daemon = True
    thread.start()
    
    print(f"[API] POST /api/start - Processing started successfully")
    return jsonify({
        "success": True,
        "message": "Processing started"
    })

@app.route('/api/stop', methods=['POST'])
def stop_processing():
    """Stop video processing"""
    global processing_video
    processing_video = False
    
    print("[API] POST /api/stop - Processing stopped")
    return jsonify({
        "success": True,
        "message": "Processing stopped"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    print("[API] GET /api/health - Health check requested")
    return jsonify({
        "status": "ok",
        "message": "Backend is running"
    })

if __name__ == '__main__':
    print("=" * 50)
    print("AI-Based Adaptive Traffic Signal Control System")
    print("=" * 50)
    
    # Load YOLOv8 model
    print("\nLoading YOLOv8 model...")
    load_model()
    
    # Start signal controller in background
    controller_thread = threading.Thread(target=signal_controller)
    controller_thread.daemon = True
    controller_thread.start()
    
    print("\n✅ Flask backend running on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  GET  /api/status   - Get current traffic status")
    print("  GET  /api/history  - Get traffic history")
    print("  POST /api/start    - Start video processing")
    print("  POST /api/stop     - Stop video processing")
    print("  GET  /api/health   - Health check")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
