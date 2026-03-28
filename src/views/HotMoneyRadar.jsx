import React, { useState, useMemo } from 'react'
import { useMissionStore } from '../stores/missionStore'
import { Flame, Phone, Mail, ExternalLink, Target, Calendar, MapPin, DollarSign, Filter, Download, X, Check } from 'lucide-react'

const HotMoneyRadar = () => {
  const { hotMoneyLeads } = useMissionStore()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState({
    propertyType: 'all',
    minCash: '',
    maxCash: '',
    location: ''
  })
  
  const sampleLeads = [
    {
      id: '1',
      entity: '2650687 Ontario Ltd',
      cashAmount: 15000000,
      saleDate: 'May 2025',
      location: 'West Lincoln',
      property: 'Thirty Rd, West Lincoln',
      matchScore: 92,
      propertyType: 'Industrial',
      daysAgo: 15,
    },
    {
      id: '2',
      entity: 'Turnberry Holdings Inc',
      cashAmount: 9840000,
      saleDate: 'Jan 2025',
      location: 'Lincoln',
      property: '4556-4568 Lincoln Ave',
      matchScore: 88,
      propertyType: 'Mixed-Use',
      daysAgo: 45,
    },
    {
      id: '3',
      entity: '1863570 Ontario Inc',
      cashAmount: 7000000,
      saleDate: 'Jan 2025',
      location: 'Pelham',
      property: '981 Pelham St',
      matchScore: 85,
      propertyType: 'Industrial',
      daysAgo: 60,
    },
    {
      id: '4',
      entity: 'Landtract Ltd',
      cashAmount: 5600000,
      saleDate: 'Feb 2025',
      location: 'Grimsby',
      property: 'Winston Rd / Kelson Ave N',
      matchScore: 82,
      propertyType: 'Land',
      daysAgo: 30,
    },
    {
      id: '5',
      entity: 'TM Vines Inc',
      cashAmount: 4200000,
      saleDate: 'Oct 2025',
      location: 'Niagara-on-the-Lake',
      property: '1895 Concession 4 Rd',
      matchScore: 90,
      propertyType: 'Agricultural',
      daysAgo: 5,
    },
    {
      id: '6',
      entity: '2258324 Ontario Ltd',
      cashAmount: 3880000,
      saleDate: 'Sep 2025',
      location: 'Pelham',
      property: '325 Church St',
      matchScore: 87,
      propertyType: 'Industrial',
      daysAgo: 12,
    },
  ]
  
  const allLeads = hotMoneyLeads.length > 0 ? hotMoneyLeads : sampleLeads
  
  // Apply filters
  const displayLeads = useMemo(() => {
    return allLeads.filter(lead => {
      if (filters.propertyType !== 'all' && lead.propertyType !== filters.propertyType) return false
      if (filters.minCash && lead.cashAmount < parseInt(filters.minCash)) return false
      if (filters.maxCash && lead.cashAmount > parseInt(filters.maxCash)) return false
      if (filters.location && !lead.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      return true
    })
  }, [allLeads, filters])
  
  const formatCash = (amount) => {
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
    return `$${amount}`
  }
  
  const totalCapital = displayLeads.reduce((sum, l) => sum + (l.cashAmount || 0), 0)
  
  return (
    <>
      <FilterModal 
        show={showFilterModal} 
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Flame className="w-6 h-6 text-accent-red" />
            Hot Money Radar
          </h1>
          <p className="text-text-secondary mt-1">
            Real-time tracking of recent sellers with fresh capital
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilterModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
            {Object.values(filters).some(v => v && v !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-accent-red"></span>
            )}
          </button>
          <ExportButton leads={displayLeads} />
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-text-muted text-sm">Total Hot Money</p>
          <p className="text-3xl font-bold text-accent-red mt-1">{formatCash(totalCapital)}</p>
          <p className="text-xs text-accent-green mt-1">↑ 12% from last week</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Active Alerts</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{displayLeads.length}</p>
          <p className="text-xs text-accent-green mt-1">↑ 3 new today</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Avg Cash Position</p>
          <p className="text-3xl font-bold text-text-primary mt-1">
            {formatCash(totalCapital / displayLeads.length)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Avg Match Score</p>
          <p className="text-3xl font-bold text-accent-green mt-1">
            {Math.round(displayLeads.reduce((sum, l) => sum + (l.matchScore || 0), 0) / displayLeads.length)}
          </p>
        </div>
      </div>
      
      {/* Hot Money List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Hot Money Leads</h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>Sorted by:</span>
              <select className="bg-bg-input border border-border-subtle rounded px-2 py-1">
                <option>Cash Amount (High → Low)</option>
                <option>Date (Newest)</option>
                <option>Match Score</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-border-subtle">
          {displayLeads.map((lead) => (
            <HotMoneyListItem key={lead.id} lead={lead} formatCash={formatCash} />
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

const ExportButton = ({ leads }) => {
  const handleExport = () => {
    // Create CSV content
    const headers = ['Entity', 'Cash Amount', 'Sale Date', 'Location', 'Property', 'Property Type', 'Match Score', 'Days Ago']
    const rows = leads.map(lead => [
      lead.entity,
      lead.cashAmount,
      lead.saleDate,
      lead.location,
      lead.property,
      lead.propertyType,
      lead.matchScore,
      lead.daysAgo
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hot-money-leads-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <button 
      onClick={handleExport}
      className="btn-secondary flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export
    </button>
  )
}

const FilterModal = ({ show, onClose, filters, setFilters }) => {
  if (!show) return null
  
  const propertyTypes = ['all', 'Industrial', 'Retail', 'Office', 'Multi-Family', 'Agricultural', 'Land', 'Mixed-Use']
  
  const clearFilters = () => {
    setFilters({
      propertyType: 'all',
      minCash: '',
      maxCash: '',
      location: ''
    })
  }
  
  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'all')
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent-red" />
            Filter Hot Money Leads
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Property Type */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Property Type</label>
            <select 
              value={filters.propertyType}
              onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="Industrial">Industrial</option>
              <option value="Retail">Retail</option>
              <option value="Office">Office</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Land">Land</option>
              <option value="Mixed-Use">Mixed-Use</option>
            </select>
          </div>
          
          {/* Cash Range */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Cash Amount Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minCash}
                  onChange={(e) => setFilters({...filters, minCash: e.target.value})}
                  className="w-full bg-bg-input border border-border-subtle rounded-lg pl-7 pr-3 py-2"
                />
              </div>
              <span className="text-text-muted">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxCash}
                  onChange={(e) => setFilters({...filters, maxCash: e.target.value})}
                  className="w-full bg-bg-input border border-border-subtle rounded-lg pl-7 pr-3 py-2"
                />
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Location</label>
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t border-border-subtle">
          <button 
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

const HotMoneyListItem = ({ lead, formatCash }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-accent-green'
    if (score >= 70) return 'text-accent-yellow'
    return 'text-accent-red'
  }
  
  return (
    <div className="p-5 hover:bg-bg-input/50 transition-colors group">
      <div className="flex items-start gap-4">
        {/* Hot Badge */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-accent-red/10 border border-accent-red/20 flex flex-col items-center justify-center animate-pulse-red">
            <Flame className="w-5 h-5 text-accent-red" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-text-primary text-lg">{lead.entity}</h4>
                <span className="px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red text-xs font-medium">
                  {lead.daysAgo} days ago
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1.5 text-accent-red font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg">{formatCash(lead.cashAmount)} cash</span>
                </div>
                <span className="text-text-muted">|</span>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Sold {lead.saleDate}</span>
                </div>
                <span className="text-text-muted">|</span>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{lead.location}</span>
                </div>
              </div>
              
              <p className="text-text-muted text-sm mt-1">
                {lead.property} • {lead.propertyType}
              </p>
            </div>
            
            {/* Score & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(lead.matchScore)}`}>
                  {lead.matchScore}
                </div>
                <div className="text-xs text-text-muted">Match Score</div>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-red text-white text-sm font-medium hover:bg-accent-red/90 transition-colors">
                  <Phone className="w-4 h-4" />
                  Contact
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-input text-text-secondary text-sm hover:text-text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Bar */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-subtle">
            <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-green transition-colors">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors">
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors">
              <Target className="w-4 h-4" />
              Add to Deal
            </button>
            <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors ml-auto">
              <ExternalLink className="w-4 h-4" />
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotMoneyRadar
