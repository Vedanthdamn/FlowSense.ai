"""
Generate Sample Traffic Videos for Testing
This script creates synthetic traffic videos for demonstration purposes
"""

import cv2
import numpy as np
import os

def create_traffic_video(filename, duration=30, fps=30, width=1280, height=720):
    """
    Create a synthetic traffic video with moving vehicles
    
    Args:
        filename: Output video filename
        duration: Video duration in seconds
        fps: Frames per second
        width: Video width
        height: Video height
    """
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(filename, fourcc, fps, (width, height))
    
    total_frames = duration * fps
    
    # Define vehicle properties (x, y, width, height, speed, color)
    vehicles = [
        {'x': 100, 'y': height // 2 - 50, 'w': 60, 'h': 40, 'speed': 3, 'color': (255, 0, 0), 'direction': 'horizontal'},
        {'x': 200, 'y': height // 2 - 100, 'w': 50, 'h': 35, 'speed': 2, 'color': (0, 255, 0), 'direction': 'horizontal'},
        {'x': width // 2 - 50, 'y': 100, 'w': 40, 'h': 60, 'speed': 2.5, 'color': (0, 0, 255), 'direction': 'vertical'},
        {'x': width // 2 - 100, 'y': 200, 'w': 45, 'h': 65, 'speed': 2, 'color': (255, 255, 0), 'direction': 'vertical'},
    ]
    
    print(f"Creating {filename}...")
    
    for frame_num in range(total_frames):
        # Create black background
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Draw road lines
        # Horizontal road
        cv2.rectangle(frame, (0, height // 2 - 150), (width, height // 2 + 150), (50, 50, 50), -1)
        # Vertical road
        cv2.rectangle(frame, (width // 2 - 150, 0), (width // 2 + 150, height), (50, 50, 50), -1)
        
        # Draw lane markings
        for i in range(0, width, 40):
            cv2.rectangle(frame, (i, height // 2 - 2), (i + 20, height // 2 + 2), (255, 255, 255), -1)
        for i in range(0, height, 40):
            cv2.rectangle(frame, (width // 2 - 2, i), (width // 2 + 2, i + 20), (255, 255, 255), -1)
        
        # Draw and update vehicles
        for vehicle in vehicles:
            # Draw vehicle as rectangle
            x, y = int(vehicle['x']), int(vehicle['y'])
            w, h = vehicle['w'], vehicle['h']
            cv2.rectangle(frame, (x, y), (x + w, y + h), vehicle['color'], -1)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 2)
            
            # Draw headlights
            if vehicle['direction'] == 'horizontal':
                cv2.circle(frame, (x + w, y + 10), 3, (255, 255, 255), -1)
                cv2.circle(frame, (x + w, y + h - 10), 3, (255, 255, 255), -1)
            else:
                cv2.circle(frame, (x + 10, y + h), 3, (255, 255, 255), -1)
                cv2.circle(frame, (x + w - 10, y + h), 3, (255, 255, 255), -1)
            
            # Update position
            if vehicle['direction'] == 'horizontal':
                vehicle['x'] += vehicle['speed']
                if vehicle['x'] > width:
                    vehicle['x'] = -vehicle['w']
            else:
                vehicle['y'] += vehicle['speed']
                if vehicle['y'] > height:
                    vehicle['y'] = -vehicle['h']
        
        # Add frame counter
        cv2.putText(frame, f"Frame: {frame_num}/{total_frames}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Add sample label
        cv2.putText(frame, "Sample Traffic Video", (width // 2 - 150, height - 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        out.write(frame)
    
    out.release()
    print(f"✓ Created {filename}")

def main():
    """Generate multiple sample videos"""
    output_dir = 'sample_videos'
    os.makedirs(output_dir, exist_ok=True)
    
    print("=" * 50)
    print("Sample Traffic Video Generator")
    print("=" * 50)
    print()
    
    # Generate 3 sample videos with different parameters
    videos = [
        {'name': 'traffic_sample1.mp4', 'duration': 30},
        {'name': 'traffic_sample2.mp4', 'duration': 30},
        {'name': 'traffic_sample3.mp4', 'duration': 30},
    ]
    
    for video in videos:
        filepath = os.path.join(output_dir, video['name'])
        create_traffic_video(filepath, duration=video['duration'])
    
    print()
    print("=" * 50)
    print("All sample videos created successfully!")
    print(f"Location: {output_dir}/")
    print("=" * 50)
    print()
    print("NOTE: These are synthetic demonstration videos.")
    print("For real testing, use actual traffic footage.")
    print()
    print("Alternative sources for real traffic videos:")
    print("1. YouTube (search 'traffic footage')")
    print("2. Pexels: https://www.pexels.com/search/videos/traffic/")
    print("3. Pixabay: https://pixabay.com/videos/search/traffic/")
    print("=" * 50)

if __name__ == '__main__':
    main()
