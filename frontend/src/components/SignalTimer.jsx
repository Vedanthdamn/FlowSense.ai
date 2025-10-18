import { Clock } from 'lucide-react'

function SignalTimer({ currentLane, remainingTime, signalTimings }) {
  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return '--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!currentLane || !signalTimings || remainingTime === undefined) return 0
    const totalTime = signalTimings[currentLane] || 30
    return ((totalTime - remainingTime) / totalTime) * 100
  }

  return (
    <div className="space-y-6">
      {/* Current active lane */}
      <div className="bg-slate-900/50 border-2 border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-white">Active Lane</h3>
          </div>
          <div className="bg-green-500/20 px-4 py-2 rounded-lg">
            <span className="text-green-500 font-bold text-xl">
              {currentLane || 'None'}
            </span>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="text-center mb-4">
          <div className="text-6xl font-mono font-bold text-white mb-2">
            {formatTime(remainingTime)}
          </div>
          <div className="text-sm text-slate-400">Time Remaining</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* All lane timings */}
      <div className="grid grid-cols-2 gap-4">
        {signalTimings && Object.entries(signalTimings).map(([lane, time]) => (
          <div
            key={lane}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentLane === lane
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-slate-900/30 border-slate-700'
            }`}
          >
            <div className="text-sm text-slate-400 mb-1">{lane}</div>
            <div className={`text-2xl font-bold ${
              currentLane === lane ? 'text-green-500' : 'text-white'
            }`}>
              {time}s
            </div>
            <div className="text-xs text-slate-500">Allocated Time</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SignalTimer
