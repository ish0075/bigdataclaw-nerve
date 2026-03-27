import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, Settings, User, Wifi, WifiOff } from 'lucide-react'
import VoiceControl from '../System/VoiceControl'
import UsageMeter from '../System/UsageMeter'

const TopBar = ({ connected }) => {
  const handleVoiceTranscript = (transcript) => {
    // Handle voice commands
    console.log('Voice transcript:', transcript)
    
    // Simple command routing
    const lower = transcript.toLowerCase()
    if (lower.includes('hot money')) {
      window.location.href = '/hotmoney'
    } else if (lower.includes('research') || lower.includes('property')) {
      window.location.href = '/research'
    } else if (lower.includes('deal') || lower.includes('pipeline')) {
      window.location.href = '/pipeline'
    } else if (lower.includes('agent')) {
      window.location.href = '/agents'
    }
  }
  
  return (
    <header className="h-16 bg-bg-card border-b border-border-subtle flex items-center justify-between px-6">
      {/* MacOS Traffic Lights (decorative) */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <>
            <Wifi className="w-4 h-4 text-accent-green" />
            <span className="text-accent-green">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-accent-red" />
            <span className="text-accent-red">Reconnecting...</span>
          </>
        )}
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <VoiceControl onTranscript={handleVoiceTranscript} />
        
        <UsageMeter compact />
        
        <button className="p-2 rounded-lg hover:bg-bg-input transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="w-5 h-5" />
        </button>
        
        <Link 
          to="/settings"
          className="p-2 rounded-lg hover:bg-bg-input transition-colors text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-5 h-5" />
        </Link>
        
        <Link 
          to="/settings"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-input transition-colors text-text-secondary hover:text-text-primary"
        >
          <div className="w-8 h-8 rounded-full bg-accent-red/20 flex items-center justify-center text-lg">
            🦞
          </div>
        </Link>
      </div>
    </header>
  )
}

export default TopBar
