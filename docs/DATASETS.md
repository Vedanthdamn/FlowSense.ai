# Traffic Detection Datasets

This document provides links to datasets for training vehicle detection models.

## Recommended Datasets

### 1. COCO Dataset (Pretrained)
**YOLOv8 comes pre-trained on COCO**, which includes vehicle classes:
- car (class 2)
- motorcycle (class 3)
- bus (class 5)
- truck (class 7)

**Link**: https://cocodataset.org/

**Advantage**: No training needed, works out-of-the-box!

---

### 2. Kaggle - Car Object Detection
**Best for: Traffic-specific training**

**Dataset Link**: https://www.kaggle.com/datasets/sshikamaru/car-object-detection

**Details**:
- 10,000+ labeled images
- Multiple vehicle types
- YOLO format annotations
- Good for fine-tuning

**Download Instructions**:
```bash
# Install Kaggle CLI
pip install kaggle

# Setup credentials (get from Kaggle Account Settings)
mkdir ~/.kaggle
# Place kaggle.json in ~/.kaggle/

# Download dataset
kaggle datasets download -d sshikamaru/car-object-detection
unzip car-object-detection.zip -d vehicle_dataset
```

---

### 3. Vehicle Detection Image Dataset
**Best for: Diverse vehicle types**

**Dataset Link**: https://www.kaggle.com/datasets/dataclusterlabs/vehicle-detection-image-dataset

**Details**:
- 5,000+ images
- Cars, trucks, buses, motorcycles
- Multiple angles and lighting conditions
- Good for real-world scenarios

---

### 4. Roboflow Universe - Vehicle Detection
**Best for: Ready-to-use datasets**

**Link**: https://universe.roboflow.com/search?q=vehicle+detection

**Features**:
- Multiple curated datasets
- Pre-processed and augmented
- Direct YOLO export
- Free tier available

**Popular Datasets**:
- Vehicle Detection (15K images): https://universe.roboflow.com/roboflow-100/vehicles-q0gii
- Traffic Detection: https://universe.roboflow.com/traffic-detection/traffic-detection-4i1q9

---

### 5. Berkeley DeepDrive (BDD100K)
**Best for: Comprehensive driving dataset**

**Link**: https://www.bdd100k.com/

**Details**:
- 100,000 driving videos
- Diverse weather/lighting conditions
- Multiple cities and countries
- Requires registration

**Classes**: car, bus, truck, motorcycle, bicycle, pedestrian, traffic light, traffic sign

---

### 6. UA-DETRAC Dataset
**Best for: Traffic surveillance**

**Link**: http://detrac-db.ritt.edu.cn/

**Details**:
- 140,000+ frames
- 8,250 vehicles tracked
- Multiple traffic scenarios
- Research-oriented

---

## Dataset Format

All datasets should be converted to YOLO format:

### Directory Structure
```
dataset/
├── images/
│   ├── train/
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   └── val/
│       ├── image3.jpg
│       └── image4.jpg
└── labels/
    ├── train/
    │   ├── image1.txt
    │   └── image2.txt
    └── val/
        ├── image3.txt
        └── image4.txt
```

### Label Format (YOLO)
Each `.txt` file contains one line per object:
```
class_id center_x center_y width height
```

Example:
```
0 0.5 0.5 0.3 0.4
2 0.7 0.3 0.2 0.3
```

All coordinates are normalized (0-1).

---

## Creating Custom Dataset

### Tools for Annotation

1. **LabelImg** (Recommended)
   - Link: https://github.com/tzutalin/labelImg
   - GUI-based annotation tool
   - Direct YOLO export

2. **Roboflow**
   - Link: https://roboflow.com
   - Web-based platform
   - Auto-augmentation
   - Team collaboration

3. **CVAT**
   - Link: https://www.cvat.ai
   - Open-source annotation tool
   - Video annotation support
   - Multi-format export

### Steps to Create Custom Dataset

1. **Collect Images/Videos**
   - Record traffic footage
   - Download from free stock sites (Pexels, Pixabay)
   - Use dashcam recordings

2. **Extract Frames** (if using video)
```python
import cv2

cap = cv2.VideoCapture('traffic.mp4')
count = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if count % 30 == 0:  # Save every 30th frame
        cv2.imwrite(f'frame_{count}.jpg', frame)
    count += 1
cap.release()
```

3. **Annotate with LabelImg**
   - Open LabelImg
   - Set output format to YOLO
   - Draw bounding boxes
   - Save annotations

4. **Split Dataset**
   - 80% training
   - 20% validation
   - (Optional) 10% testing

5. **Create data.yaml**
```yaml
path: /path/to/dataset
train: images/train
val: images/val

nc: 4  # number of classes
names: ['car', 'motorcycle', 'bus', 'truck']
```

---

## Free Video Sources

### Stock Video Websites
1. **Pexels**: https://www.pexels.com/search/videos/traffic/
2. **Pixabay**: https://pixabay.com/videos/search/traffic/
3. **Videvo**: https://www.videvo.net/free-stock-video-footage/traffic/
4. **Coverr**: https://coverr.co/s/traffic

### YouTube
Search terms:
- "traffic camera live"
- "traffic footage"
- "highway traffic"
- "intersection traffic"

Download using: `youtube-dl` or `yt-dlp`

---

## Dataset Preparation Checklist

Before training:
- [ ] Images are in correct format (JPG/PNG)
- [ ] Labels are in YOLO format (.txt)
- [ ] Directory structure matches YOLO requirements
- [ ] data.yaml is configured correctly
- [ ] Classes are defined consistently
- [ ] Train/val split is reasonable (80/20)
- [ ] Images are properly sized (640x640 recommended)
- [ ] Dataset is balanced (similar number of samples per class)

---

## Performance Tips

1. **Data Augmentation**: Use Roboflow or Albumentations
2. **Image Quality**: Higher resolution = better detection
3. **Variety**: Include different weather, times, angles
4. **Balance**: Equal samples for each vehicle type
5. **Validation**: Always keep a separate validation set

---

## License Considerations

Always check dataset licenses:
- ✅ CC0 (Public Domain): Free for any use
- ✅ CC-BY: Free with attribution
- ⚠️ CC-BY-NC: Non-commercial only
- ❌ Proprietary: Requires permission

**For Academic Projects**: Most datasets allow educational use.

---

## Recommended Approach

**For Quick Start**: Use pretrained YOLOv8 on COCO (no training needed)

**For Better Accuracy**: Fine-tune on Kaggle Car Detection dataset

**For Best Results**: Collect custom traffic footage from target location

---

## References

1. COCO: Lin, T. Y., et al. (2014). "Microsoft COCO: Common objects in context."
2. YOLO: Redmon, J., et al. (2016). "You only look once: Unified, real-time object detection."
3. BDD100K: Yu, F., et al. (2020). "BDD100K: A diverse driving dataset for heterogeneous multitask learning."

---

**Last Updated**: January 2024
