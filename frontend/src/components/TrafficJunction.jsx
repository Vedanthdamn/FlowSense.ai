function TrafficJunction({ currentLane, laneCounts }) {
  const lanes = {
    North: { position: 'top-0 left-1/2 -translate-x-1/2', direction: '↓' },
    South: { position: 'bottom-0 left-1/2 -translate-x-1/2', direction: '↑' },
    East: { position: 'right-0 top-1/2 -translate-y-1/2', direction: '←' },
    West: { position: 'left-0 top-1/2 -translate-y-1/2', direction: '→' }
  }

  const getSignalColor = (lane) => {
    if (!currentLane) return 'bg-gray-500'
    return currentLane === lane ? 'bg-green-500' : 'bg-red-500'
  }

  const getSignalGlow = (lane) => {
    if (!currentLane) return ''
    return currentLane === lane 
      ? 'shadow-lg shadow-green-500/50 animate-pulse' 
      : 'shadow-lg shadow-red-500/30'
  }

  return (
    <div className="relative w-full aspect-square bg-slate-900/50 rounded-xl border-2 border-slate-700">
      {/* Center intersection */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/20 border-4 border-yellow-500/30 rounded-lg">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-4xl font-bold text-yellow-500/50">+</div>
        </div>
      </div>

      {/* Road lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-500/30"></div>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-yellow-500/30"></div>

      {/* Traffic signals for each lane */}
      {Object.entries(lanes).map(([lane, config]) => (
        <div
          key={lane}
          className={`absolute ${config.position} p-4`}
        >
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-3 min-w-[120px]">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-white font-bold text-sm">{lane}</div>
              
              {/* Traffic light */}
              <div className={`w-12 h-12 rounded-full ${getSignalColor(lane)} ${getSignalGlow(lane)} flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">
                  {currentLane === lane ? '●' : '●'}
                </span>
              </div>
              
              {/* Vehicle count */}
              <div className="bg-slate-700 px-3 py-1 rounded-full">
                <span className="text-cyan-400 font-mono font-bold">
                  {laneCounts?.[lane] || 0}
                </span>
                <span className="text-slate-400 text-xs ml-1">vehicles</span>
              </div>
              
              {/* Direction arrow */}
              <div className="text-2xl text-slate-500">{config.direction}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-3">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Green = Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Red = Waiting</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficJunction
