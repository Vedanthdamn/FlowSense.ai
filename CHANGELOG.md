# Changelog

All notable changes to FlowSense.ai will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced error handling with specific, actionable error messages
- Connection status indicator in the header (Backend Connected/Disconnected)
- Step-by-step troubleshooting instructions when backend is not accessible
- Clickable link to test backend health endpoint
- Automatic connection status updates based on API responses
- Comprehensive error handling documentation in `docs/ERROR_HANDLING.md`

### Changed
- Improved error messages to distinguish between different types of failures (network errors, backend errors, timeouts)
- Updated Header component to display dynamic connection status
- Error display now includes visual warning icon and structured layout

### Fixed
- "Failed to fetch traffic status" error now provides clear guidance on how to resolve the issue
- Users can now easily identify when the backend server is not running
- Connection status updates automatically when backend becomes available

## [1.0.0] - Initial Release

### Added
- AI-based adaptive traffic signal control system
- YOLOv8 vehicle detection
- Real-time traffic monitoring dashboard
- 4-way junction simulation
- Adaptive signal timing based on traffic density
- Historical data logging with Supabase integration
- React-based web interface with Tailwind CSS
- Flask REST API backend
- Support for video files and webcam input
- Control panel for starting/stopping video processing
- Live traffic junction visualization
- Signal timer with countdown
- Lane density visualization
- Traffic history table

[Unreleased]: https://github.com/Vedanthdamn/FlowSense.ai/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Vedanthdamn/FlowSense.ai/releases/tag/v1.0.0
