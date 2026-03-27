import React, { useState } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { Play, Square, Pause, ScrollText, Settings, Terminal, Trash2 } from 'lucide-react'

const AgentWorkspace = () => {
  const { agents, logs, startAgent, stopAgent, pauseAgent } = useAgentStore()
  const [selectedAgent, setSelectedAgent] = useState(null)
  
  const selectedLogs = selectedAgent 
    ? logs.filter(l => l.agentId === selectedAgent.id)
    : []
  
  return (
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
            onStart={() => startAgent(agent.id)}
            onStop={() => stopAgent(agent.id)}
            onPause={() => pauseAgent(agent.id)}
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
            <button className="p-2 rounded-lg hover:bg-bg-input text-text-secondary hover:text-accent-red transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-black p-4 font-mono text-sm h-64 overflow-y-auto scrollbar-thin">
          {selectedLogs.length > 0 ? (
            selectedLogs.map((log, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <span className="text-text-muted whitespace-nowrap">
                  {log.timestamp?.toLocaleTimeString?.() || new Date().toLocaleTimeString()}
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
                ? `No logs for ${selectedAgent.name}. Select an agent to view logs.`
                : 'Select an agent to view logs'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AgentCard = ({ agent, isSelected, onSelect, onStart, onStop, onPause }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-active">ACTIVE</span>
      case 'queued':
        return <span className="status-queued">QUEUED</span>
      case 'error':
        return <span className="status-error">ERROR</span>
      default:
        return <span className="status-idle">IDLE</span>
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
              <span>Running: {agent.activeMissions} missions</span>
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
              <span className="text-accent-red">{agent.alertCount} alerts</span>
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
      <div className="mt-3 flex items-center gap-2">
        <button className="flex-1 py-1.5 px-3 rounded-lg bg-bg-card text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5">
          <ScrollText className="w-3 h-3" />
          Logs
        </button>
        <button className="flex-1 py-1.5 px-3 rounded-lg bg-bg-card text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5">
          <Settings className="w-3 h-3" />
          Config
        </button>
      </div>
    </div>
  )
}

export default AgentWorkspace
