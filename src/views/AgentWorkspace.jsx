import React, { useState, useEffect } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { Play, Square, Pause, ScrollText, Settings, Terminal, Trash2, X, Check, Activity } from 'lucide-react'

const AgentWorkspace = () => {
  const { agents, logs, startAgent, stopAgent, pauseAgent, clearLogs, addAgentLog } = useAgentStore()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  
  const selectedLogs = selectedAgent 
    ? logs.filter(l => l.agentId === selectedAgent.id)
    : []
  
  // Auto-generate logs when agents are active
  useEffect(() => {
    const interval = setInterval(() => {
      agents.forEach(agent => {
        if (agent.status === 'active') {
          const messages = [
            'Scanning for new transactions...',
            'Analyzing market data...',
            'Checking for updates...',
            'Processing records...',
            'Syncing with database...',
            'Running analysis...',
          ]
          const randomMsg = messages[Math.floor(Math.random() * messages.length)]
          addAgentLog(agent.id, randomMsg, 'info')
        }
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }, [agents, addAgentLog])
  
  const handleStart = (agentId) => {
    startAgent(agentId)
    addAgentLog(agentId, 'Agent started successfully', 'success')
    addAgentLog(agentId, 'Initializing...', 'info')
  }
  
  const handleStop = (agentId) => {
    stopAgent(agentId)
    addAgentLog(agentId, 'Agent stopped', 'warn')
  }
  
  const handlePause = (agentId) => {
    pauseAgent(agentId)
    addAgentLog(agentId, 'Agent paused', 'warn')
  }
  
  const handleClearLogs = () => {
    if (selectedAgent) {
      clearLogs(selectedAgent.id)
    }
  }
  
  return (
    <>
      {/* Config Modal */}
      {showConfig && selectedAgent && (
        <ConfigModal 
          agent={selectedAgent}
          onClose={() => setShowConfig(false)}
        />
      )}
      
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Agent Workspace</h1>
            <p className="text-text-secondary mt-1">
              Manage and monitor your AI research agents
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              {agents.filter(a => a.status === 'active').length} Active
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-yellow" />
              {agents.filter(a => a.status === 'queued').length} Queued
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-text-muted" />
              {agents.filter(a => a.status === 'idle').length} Idle
            </span>
          </div>
        </div>
        
        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onSelect={() => setSelectedAgent(agent)}
              onStart={() => handleStart(agent.id)}
              onStop={() => handleStop(agent.id)}
              onPause={() => handlePause(agent.id)}
              onShowLogs={() => setSelectedAgent(agent)}
              onShowConfig={() => { setSelectedAgent(agent); setShowConfig(true) }}
            />
          ))}
        </div>
        
        {/* Logs Section */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent-red" />
              Agent Logs
            </h3>
            <div className="flex items-center gap-2">
              {selectedAgent && (
                <span className="text-sm text-text-muted">
                  Showing: {selectedAgent.name}
                </span>
              )}
              <button 
                onClick={handleClearLogs}
                disabled={!selectedAgent || selectedLogs.length === 0}
                className="p-2 rounded-lg hover:bg-bg-input text-text-secondary hover:text-accent-red transition-colors disabled:opacity-50"
                title="Clear logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-black p-4 font-mono text-sm h-64 overflow-y-auto scrollbar-thin">
            {selectedLogs.length > 0 ? (
              selectedLogs.map((log, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <span className="text-text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`
                    ${log.level === 'error' ? 'text-accent-red' : ''}
                    ${log.level === 'warn' ? 'text-accent-yellow' : ''}
                    ${log.level === 'success' ? 'text-accent-green' : ''}
                    ${log.level === 'info' ? 'text-text-secondary' : ''}
                  `}>
                    [{log.level?.toUpperCase()}]
                  </span>
                  <span className="text-text-primary">{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-text-muted text-center py-12">
                {selectedAgent 
                  ? `No logs for ${selectedAgent.name}. Start the agent to generate logs.`
                  : 'Select an agent to view logs'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const AgentCard = ({ agent, isSelected, onSelect, onStart, onStop, onPause, onShowLogs, onShowConfig }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium">ACTIVE</span>
      case 'queued':
        return <span className="px-2 py-0.5 rounded-full bg-accent-yellow/20 text-accent-yellow text-xs font-medium">QUEUED</span>
      case 'error':
        return <span className="px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red text-xs font-medium">ERROR</span>
      default:
        return <span className="px-2 py-0.5 rounded-full bg-text-muted/20 text-text-muted text-xs font-medium">IDLE</span>
    }
  }
  
  const getStatusBorder = (status) => {
    switch (status) {
      case 'active':
        return 'border-accent-green/30 ring-1 ring-accent-green/20'
      case 'queued':
        return 'border-accent-yellow/30'
      case 'error':
        return 'border-accent-red/30'
      default:
        return 'border-border-subtle'
    }
  }
  
  return (
    <div 
      onClick={onSelect}
      className={`
        p-5 rounded-xl border cursor-pointer transition-all
        ${getStatusBorder(agent.status)}
        ${isSelected ? 'bg-bg-input ring-2 ring-accent-red/30' : 'bg-bg-card hover:bg-bg-input'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bg-card border border-border-subtle flex items-center justify-center text-2xl">
            {agent.icon}
          </div>
          <div>
            <h4 className="font-medium text-text-primary">{agent.name}</h4>
            {getStatusBadge(agent.status)}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {agent.status === 'idle' ? (
            <button 
              onClick={onStart}
              className="p-2 rounded-lg hover:bg-accent-green/20 text-text-secondary hover:text-accent-green transition-colors"
              title="Start"
            >
              <Play className="w-4 h-4" />
            </button>
          ) : agent.status === 'active' ? (
            <>
              <button 
                onClick={onPause}
                className="p-2 rounded-lg hover:bg-accent-yellow/20 text-text-secondary hover:text-accent-yellow transition-colors"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button 
                onClick={onStop}
                className="p-2 rounded-lg hover:bg-accent-red/20 text-text-secondary hover:text-accent-red transition-colors"
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button 
              onClick={onStop}
              className="p-2 rounded-lg hover:bg-accent-red/20 text-text-secondary hover:text-accent-red transition-colors"
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-text-secondary mt-3">
        {agent.description}
      </p>
      
      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs text-text-muted">
          {agent.status === 'active' && (
            <>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-accent-green animate-pulse" />
                Running: {agent.activeMissions || 0} missions
              </span>
              <span>Completed: {agent.completedMissions || 0}</span>
            </>
          )}
          {agent.status === 'idle' && (
            <>
              <span>Ready to run</span>
              <span>Uptime: {agent.uptime || '99.9%'}</span>
            </>
          )}
          {agent.watchingCount !== undefined && (
            <>
              <span>Watching: {agent.watchingCount}</span>
              <span className={agent.alertCount > 0 ? 'text-accent-red font-medium' : ''}>
                {agent.alertCount} alerts
              </span>
            </>
          )}
          {agent.fileCount && (
            <>
              <span>Files: {agent.fileCount}</span>
              <span>Last: {agent.lastSync || '2m ago'}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onShowLogs}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 ${
            isSelected 
              ? 'bg-accent-red/20 text-accent-red' 
              : 'bg-bg-card text-text-secondary hover:text-text-primary'
          }`}
        >
          <ScrollText className="w-3 h-3" />
          Logs
        </button>
        <button 
          onClick={onShowConfig}
          className="flex-1 py-1.5 px-3 rounded-lg bg-bg-card text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5"
        >
          <Settings className="w-3 h-3" />
          Config
        </button>
      </div>
    </div>
  )
}

const ConfigModal = ({ agent, onClose }) => {
  const [config, setConfig] = useState({
    autoStart: false,
    interval: 5,
    notifications: true,
    ...agent.config
  })
  
  const handleSave = () => {
    // Save config to store
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent-red" />
            {agent.name} Configuration
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm">Auto-start on launch</span>
              <input 
                type="checkbox" 
                checked={config.autoStart}
                onChange={(e) => setConfig({...config, autoStart: e.target.checked})}
                className="w-4 h-4 rounded border-border-subtle bg-bg-input"
              />
            </label>
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Scan Interval (minutes)
            </label>
            <input 
              type="number" 
              min="1" 
              max="60"
              value={config.interval}
              onChange={(e) => setConfig({...config, interval: parseInt(e.target.value)})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm">Enable notifications</span>
              <input 
                type="checkbox" 
                checked={config.notifications}
                onChange={(e) => setConfig({...config, notifications: e.target.checked})}
                className="w-4 h-4 rounded border-border-subtle bg-bg-input"
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border-subtle">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgentWorkspace
