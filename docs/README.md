# Documentation Assets

This directory contains screenshots and images for the project documentation.

## Required Screenshots

To complete the documentation, add the following screenshots:

### 1. banner.png
- Project banner/hero image
- Recommended size: 1200x400px
- Should include project logo and title

### 2. dashboard.png
- Full dashboard screenshot
- Shows all components: junction, timer, density, history
- Recommended size: 1920x1080px

### 3. junction.png
- Close-up of traffic junction visualization
- Shows 4-way intersection with signals
- Recommended size: 800x800px

### 4. timer.png
- Signal timer component screenshot
- Shows countdown and lane allocations
- Recommended size: 800x600px

### 5. history.png
- Traffic history table screenshot
- Shows multiple log entries
- Recommended size: 1200x400px

### 6. architecture.png
- System architecture diagram
- Can be created using draw.io or similar tool
- Recommended size: 1200x800px

## How to Add Screenshots

1. **Start the application**:
   ```bash
   ./run.sh
   ```

2. **Open browser** at http://localhost:3000

3. **Start video processing** with a demo video

4. **Take screenshots**:
   - macOS: `Cmd + Shift + 4` (select area)
   - Or use browser developer tools

5. **Save screenshots** in this directory

6. **Optimize images**:
   ```bash
   # Install image optimization tools
   brew install imageoptim-cli
   
   # Optimize all PNGs
   imageoptim *.png
   ```

## Creating Architecture Diagram

Use one of these tools:
- **Draw.io**: https://app.diagrams.net/
- **Excalidraw**: https://excalidraw.com/
- **Lucidchart**: https://www.lucidchart.com/
- **Figma**: https://www.figma.com/

Export as PNG at 2x resolution for crisp display.

## Placeholder Images

For now, the documentation references these images. They can be added later without affecting functionality.

The application works perfectly without these screenshots - they are only for documentation purposes.
