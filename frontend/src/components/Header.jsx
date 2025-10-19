import { Activity } from 'lucide-react'

function Header({ isConnected }) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                FlowSense.ai
              </h1>
              <p className="text-slate-400 text-sm">
                AI-Based Adaptive Traffic Signal Control
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-sm font-medium">Backend Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-500 text-sm font-medium">Backend Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
