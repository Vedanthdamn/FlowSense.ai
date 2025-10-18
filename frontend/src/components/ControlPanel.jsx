import { useState } from 'react'
import { Play, Square, Video, Upload } from 'lucide-react'

function ControlPanel({ isProcessing, onStart, onStop }) {
  const [videoPath, setVideoPath] = useState('')
  const [selectedDemo, setSelectedDemo] = useState('sample1')

  const demoVideos = {
    sample1: '../sample_videos/traffic_sample1.mp4',
    sample2: '../sample_videos/traffic_sample2.mp4',
    sample3: '../sample_videos/traffic_sample3.mp4',
    webcam: 0
  }

  const handleStart = () => {
    const source = videoPath || demoVideos[selectedDemo]
    onStart(source)
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Video className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white">Control Panel</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-slate-400">
            {isProcessing ? 'Processing' : 'Idle'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo video selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Select Demo Video
          </label>
          <select
            value={selectedDemo}
            onChange={(e) => setSelectedDemo(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          >
            <option value="sample1">Traffic Sample 1</option>
            <option value="sample2">Traffic Sample 2</option>
            <option value="sample3">Traffic Sample 3</option>
            <option value="webcam">Webcam (Live)</option>
          </select>
        </div>

        {/* Custom video path */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Custom Video Path (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={videoPath}
              onChange={(e) => setVideoPath(e.target.value)}
              placeholder="/path/to/your/video.mp4"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center space-x-4 mt-6">
        {!isProcessing ? (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
          >
            <Play className="w-5 h-5" />
            <span>Start Processing</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
          >
            <Square className="w-5 h-5" />
            <span>Stop Processing</span>
          </button>
        )}

        <div className="text-sm text-slate-400">
          {isProcessing 
            ? 'Processing video and detecting vehicles...'
            : 'Click Start to begin traffic analysis'
          }
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
