import { Clock, TrendingUp } from 'lucide-react'

function TrafficHistory({ history }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">No traffic history available</p>
        <p className="text-slate-500 text-sm mt-2">
          History will appear here once Supabase logging is configured
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-semibold">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Timestamp</span>
              </div>
            </th>
            <th className="text-left py-3 px-4 text-slate-400 font-semibold">Lane</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">North</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">South</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">East</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">West</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">Signal Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors"
            >
              <td className="py-3 px-4 text-slate-300 text-sm font-mono">
                {formatTimestamp(entry.timestamp)}
              </td>
              <td className="py-3 px-4">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {entry.lane}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-cyan-400 font-mono">
                {entry.north_count || 0}
              </td>
              <td className="py-3 px-4 text-center text-cyan-400 font-mono">
                {entry.south_count || 0}
              </td>
              <td className="py-3 px-4 text-center text-cyan-400 font-mono">
                {entry.east_count || 0}
              </td>
              <td className="py-3 px-4 text-center text-cyan-400 font-mono">
                {entry.west_count || 0}
              </td>
              <td className="py-3 px-4 text-center text-green-400 font-mono font-bold">
                {entry.signal_time}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {history.length > 0 && (
        <div className="mt-4 text-center text-slate-500 text-sm">
          Showing {history.length} recent entries
        </div>
      )}
    </div>
  )
}

export default TrafficHistory
