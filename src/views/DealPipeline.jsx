import React, { useState } from 'react'
import { useDealStore } from '../stores/dealStore'
import { Plus, Phone, Mail, Linkedin, MoreHorizontal, Calendar, Filter, Download } from 'lucide-react'

const stages = [
  { id: 'new', label: 'New', color: 'blue', icon: '🔵' },
  { id: 'contacted', label: 'Contacted', color: 'yellow', icon: '🟡' },
  { id: 'offer', label: 'Offer Out', color: 'orange', icon: '🟠' },
  { id: 'closing', label: 'Closing', color: 'green', icon: '🟢' },
]

const DealPipeline = () => {
  const { deals, moveDeal } = useDealStore()
  const [draggedDeal, setDraggedDeal] = useState(null)
  
  const getDealsForStage = (stageId) => {
    return deals.filter(d => d.stage === stageId)
  }
  
  const handleDragStart = (deal) => {
    setDraggedDeal(deal)
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  const handleDrop = (e, stageId) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== stageId) {
      moveDeal(draggedDeal.id, stageId)
      setDraggedDeal(null)
    }
  }
  
  const formatCurrency = (value) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`
    return `$${value}`
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Deal Pipeline</h1>
          <p className="text-text-secondary mt-1">
            Track your active deals from lead to close
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>
      
      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id)
          
          return (
            <div
              key={stage.id}
              className="card flex flex-col max-h-[calc(100vh-280px)]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-border-subtle bg-${stage.color}-500/5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{stage.icon}</span>
                    <span className="font-semibold">{stage.label}</span>
                  </div>
                  <span className="text-sm text-text-muted">({stageDeals.length})</span>
                </div>
              </div>
              
              {/* Deals */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    formatCurrency={formatCurrency}
                    onDragStart={() => handleDragStart(deal)}
                  />
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border-subtle rounded-xl">
                    No deals in {stage.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Pipeline Stats */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Pipeline Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-bg-input">
            <p className="text-text-muted text-sm">Total Pipeline Value</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg-input">
            <p className="text-text-muted text-sm">Active Deals</p>
            <p className="text-2xl font-bold mt-1">{deals.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-input">
            <p className="text-text-muted text-sm">Avg Match Score</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(deals.reduce((sum, d) => sum + d.matchScore, 0) / deals.length)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg-input">
            <p className="text-text-muted text-sm">Closing This Month</p>
            <p className="text-2xl font-bold mt-1">
              {getDealsForStage('closing').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DealCard = ({ deal, formatCurrency, onDragStart }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-accent-green'
    if (score >= 70) return 'text-accent-yellow'
    return 'text-accent-red'
  }
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="p-4 rounded-xl bg-bg-input border border-border-subtle cursor-move hover:border-accent-red/30 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-text-primary truncate">{deal.entity}</h4>
          <p className="text-sm text-text-secondary mt-0.5">
            {formatCurrency(deal.value)} • {deal.type}
          </p>
          <p className="text-xs text-text-muted mt-1">{deal.location}</p>
        </div>
        
        <div className={`text-lg font-bold ${getScoreColor(deal.matchScore)}`}>
          {deal.matchScore}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-accent-green transition-colors" title="Call">
          <Phone className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-accent-blue transition-colors" title="Email">
          <Mail className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-accent-blue transition-colors" title="LinkedIn">
          <Linkedin className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-text-primary transition-colors ml-auto" title="More">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Last Activity */}
      <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
        <Calendar className="w-3 h-3" />
        <span>Updated {new Date(deal.lastActivity).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default DealPipeline
