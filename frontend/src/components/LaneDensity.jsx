import { Car } from 'lucide-react'

function LaneDensity({ laneCounts }) {
  const getMaxCount = () => {
    if (!laneCounts) return 1
    const max = Math.max(...Object.values(laneCounts))
    return max || 1
  }

  const getBarColor = (count) => {
    const percentage = (count / getMaxCount()) * 100
    if (percentage >= 75) return 'bg-red-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getDensityLevel = (count) => {
    const percentage = (count / getMaxCount()) * 100
    if (percentage >= 75) return 'High'
    if (percentage >= 50) return 'Medium'
    return 'Low'
  }

  const getDensityColor = (count) => {
    const percentage = (count / getMaxCount()) * 100
    if (percentage >= 75) return 'text-red-500'
    if (percentage >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="space-y-4">
      {laneCounts && Object.entries(laneCounts).map(([lane, count]) => {
        const percentage = (count / getMaxCount()) * 100

        return (
          <div key={lane} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-slate-400" />
                <span className="text-white font-medium">{lane}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-semibold ${getDensityColor(count)}`}>
                  {getDensityLevel(count)}
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {count}
                </span>
              </div>
            </div>

            <div className="relative w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`${getBarColor(count)} h-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Total Vehicles</div>
            <div className="text-white text-2xl font-bold">
              {laneCounts ? Object.values(laneCounts).reduce((a, b) => a + b, 0) : 0}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Avg per Lane</div>
            <div className="text-white text-2xl font-bold">
              {laneCounts 
                ? Math.round(Object.values(laneCounts).reduce((a, b) => a + b, 0) / 4) 
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaneDensity
