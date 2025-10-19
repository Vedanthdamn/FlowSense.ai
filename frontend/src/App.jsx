import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import TrafficJunction from './components/TrafficJunction'
import SignalTimer from './components/SignalTimer'
import LaneDensity from './components/LaneDensity'
import TrafficHistory from './components/TrafficHistory'
import ControlPanel from './components/ControlPanel'

// Use environment variable for API base URL, fallback to localhost:5000
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`

console.log('[FlowSense] API Base URL:', API_BASE_URL)

function App() {
  const [trafficData, setTrafficData] = useState(null)
  const [history, setHistory] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const checkBackendHealth = async () => {
    try {
      console.log(`[FlowSense] Checking backend health at: ${API_BASE_URL}/health`)
      const response = await axios.get(`${API_BASE_URL}/health`)
      console.log('[FlowSense] Health check response:', response.data)
      if (response.data.status === 'ok') {
        console.log('✅ Backend connection successful:', response.data.message)
        setIsConnected(true)
      } else {
        console.warn('⚠️ Backend health check returned unexpected status:', response.data)
        setIsConnected(false)
      }
    } catch (err) {
      console.error('❌ Backend health check failed:', err)
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        console.error('[FlowSense] Cannot connect to backend at:', API_BASE_URL)
        console.error('[FlowSense] Please ensure Flask backend is running on http://localhost:5000')
      }
      setIsConnected(false)
    }
  }

  useEffect(() => {
    // Check backend health on startup
    checkBackendHealth()
    
    // Poll for status updates every 1 second
    const interval = setInterval(fetchStatus, 1000)
    
    // Fetch history every 10 seconds
    const historyInterval = setInterval(fetchHistory, 10000)
    
    // Initial fetch
    fetchStatus()
    fetchHistory()

    return () => {
      clearInterval(interval)
      clearInterval(historyInterval)
    }
  }, [])

  const fetchStatus = async () => {
    try {
      console.log(`[FlowSense] Fetching status from: ${API_BASE_URL}/status`)
      const response = await axios.get(`${API_BASE_URL}/status`)
      console.log('[FlowSense] Status response received:', {
        success: response.data.success,
        currentLane: response.data.data?.current_lane,
        laneCounts: response.data.data?.lane_counts,
        timestamp: response.data.data?.timestamp
      })
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
        console.error('[FlowSense] Network error - cannot connect to backend:', API_BASE_URL)
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000')
      } else if (err.response) {
        // Backend responded with an error status
        console.error('[FlowSense] Backend error response:', err.response.status, err.response.statusText)
        setError(`Backend error: ${err.response.status} - ${err.response.statusText}`)
      } else if (err.request) {
        // Request was made but no response received
        console.error('[FlowSense] No response from backend:', err.request)
        setError('No response from backend. Please check if the backend server is running.')
      } else {
        console.error('[FlowSense] Error fetching status:', err.message)
        setError(`Failed to fetch traffic status: ${err.message}`)
      }
      console.error('[FlowSense] Full error details:', err)
    }
  }

  const fetchHistory = async () => {
    try {
      console.log(`[FlowSense] Fetching history from: ${API_BASE_URL}/history`)
      const response = await axios.get(`${API_BASE_URL}/history`)
      if (response.data.success) {
        console.log(`[FlowSense] History response received: ${response.data.data?.length || 0} records`)
        setHistory(response.data.data)
      }
    } catch (err) {
      console.error('[FlowSense] Error fetching history:', err)
    }
  }

  const handleStartProcessing = async (videoPath) => {
    try {
      console.log(`[FlowSense] Starting video processing with path: ${videoPath || 'webcam'}`)
      const response = await axios.post(`${API_BASE_URL}/start`, {
        video_path: videoPath || 0
      })
      if (response.data.success) {
        console.log('[FlowSense] Processing started successfully')
        setIsProcessing(true)
        setError(null)
      }
    } catch (err) {
      console.error('[FlowSense] Error starting processing:', err)
      setError('Failed to start processing')
    }
  }

  const handleStopProcessing = async () => {
    try {
      console.log('[FlowSense] Stopping video processing')
      const response = await axios.post(`${API_BASE_URL}/stop`)
      if (response.data.success) {
        console.log('[FlowSense] Processing stopped successfully')
        setIsProcessing(false)
        setError(null)
      }
    } catch (err) {
      console.error('[FlowSense] Error stopping processing:', err)
      setError('Failed to stop processing')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header isConnected={isConnected} />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
            <div className="font-semibold mb-2">⚠️ Connection Error</div>
            <div className="mb-3">{error}</div>
            <div className="text-sm mt-3 pt-3 border-t border-red-500/30">
              <div className="font-semibold mb-2">To fix this issue:</div>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Make sure the backend server is running</li>
                <li>Run <code className="bg-red-500/20 px-2 py-1 rounded">cd backend && source venv/bin/activate && python app.py</code> in a terminal</li>
                <li>Check that port 5000 is not blocked by firewall</li>
                <li>Verify the backend is accessible at <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-300">http://localhost:5000/api/health</a></li>
              </ol>
            </div>
          </div>
        )}

        <ControlPanel
          isProcessing={isProcessing}
          onStart={handleStartProcessing}
          onStop={handleStopProcessing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
                Traffic Junction
              </span>
            </h2>
            <TrafficJunction 
              currentLane={trafficData?.current_lane}
              laneCounts={trafficData?.lane_counts}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
                  Signal Timer
                </span>
              </h2>
              <SignalTimer 
                currentLane={trafficData?.current_lane}
                remainingTime={trafficData?.remaining_time}
                signalTimings={trafficData?.signal_timings}
              />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Lane Density
                </span>
              </h2>
              <LaneDensity laneCounts={trafficData?.lane_counts} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
              Traffic History
            </span>
          </h2>
          <TrafficHistory history={history} />
        </div>
      </main>

      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>FlowSense.ai - AI-Based Adaptive Traffic Signal Control System</p>
          <p className="text-sm mt-2">Powered by YOLOv8 & React</p>
        </div>
      </footer>
    </div>
  )
}

export default App
