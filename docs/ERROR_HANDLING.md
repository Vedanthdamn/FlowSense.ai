# Error Handling Documentation

## Overview

This document describes the enhanced error handling implemented in FlowSense.ai to provide better user feedback when the backend server is not accessible.

## Problem Statement

Users were encountering a generic "Failed to fetch traffic status" error message when the backend server was not running or not accessible. This provided insufficient information to diagnose and resolve the issue.

## Solution

We've implemented comprehensive error handling with the following improvements:

### 1. Specific Error Messages

The frontend now provides detailed error messages based on the type of failure:

- **Network Error**: "Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000"
- **Backend Error Response**: Shows the HTTP status code and error message
- **No Response**: "No response from backend. Please check if the backend server is running."
- **Other Errors**: Displays the specific error message

### 2. Connection Status Indicator

A visual indicator in the header shows the current backend connection status:
- **Green "Backend Connected"**: Backend is responding successfully
- **Red "Backend Disconnected"**: Unable to connect to backend

### 3. Helpful Instructions

When an error occurs, the UI displays step-by-step instructions to fix the issue:

1. Make sure the backend server is running
2. Command to start the backend: `cd backend && source venv/bin/activate && python app.py`
3. Check that port 5000 is not blocked by firewall
4. Link to verify backend health at http://localhost:5000/api/health

## Code Changes

### Frontend (App.jsx)

**Added State:**
```javascript
const [isConnected, setIsConnected] = useState(false)
```

**Design Decisions:**
- `fetchStatus()`: Full error handling with user feedback (critical for app functionality)
- `fetchHistory()`: Minimal error handling with console logging only (optional feature, fails gracefully)
- Connection status is based on the critical `fetchStatus()` endpoint
- Errors are categorized by type: Network errors, HTTP errors, timeout errors, and general errors

**Enhanced Error Handling:**
```javascript
const fetchStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`)
    if (response.data.success) {
      setTrafficData(response.data.data)
      setError(null)
      setIsConnected(true)
    } else {
      setError('Backend returned unsuccessful response')
      setIsConnected(false)
    }
  } catch (err) {
    setIsConnected(false)
    // Provide more specific error messages based on error type
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000')
    } else if (err.response) {
      setError(`Backend error: ${err.response.status} - ${err.response.statusText}`)
    } else if (err.request) {
      setError('No response from backend. Please check if the backend server is running.')
    } else {
      setError(`Failed to fetch traffic status: ${err.message}`)
    }
    console.error('Error fetching status:', err)
  }
}
```

**Enhanced Error Display:**
- Warning icon and title
- Detailed error message
- Step-by-step troubleshooting instructions
- Clickable link to test backend health

### Header Component (Header.jsx)

**Added Connection Status:**
```javascript
function Header({ isConnected }) {
  return (
    // ...
    {isConnected ? (
      <div className="...bg-green-500...">
        <span>Backend Connected</span>
      </div>
    ) : (
      <div className="...bg-red-500...">
        <span>Backend Disconnected</span>
      </div>
    )}
  )
}
```

## Testing

To test the error handling:

1. **Test Disconnected State:**
   - Start only the frontend: `cd frontend && npm run dev`
   - Open http://localhost:3000
   - Should show "Backend Disconnected" and error message with instructions

2. **Test Connected State:**
   - Start the backend: `cd backend && source venv/bin/activate && python app.py`
   - The error should automatically clear
   - Should show "Backend Connected" in green

3. **Test Reconnection:**
   - With both servers running, stop the backend
   - Error message should appear within 1 second (polling interval)
   - Restart backend
   - Error should clear automatically

## Benefits

1. **Better User Experience**: Users immediately understand what's wrong
2. **Self-Service**: Clear instructions help users fix issues without support
3. **Visual Feedback**: Connection status is always visible
4. **Automatic Recovery**: UI updates automatically when connection is restored
5. **Detailed Logging**: Console errors provide technical details for debugging

## Future Enhancements

Potential improvements for future versions:

- Add retry button to manually trigger reconnection
- Show connection latency/performance metrics
- Add notifications when connection is restored
- Implement exponential backoff for failed requests
- Add support for custom backend URLs
