import React from 'react'
import { useMissionStore } from '../stores/missionStore'
import { Flame, Phone, Mail, ExternalLink, Target, Calendar, MapPin, DollarSign, Filter, Download } from 'lucide-react'

const HotMoneyRadar = () => {
  const { hotMoneyLeads } = useMissionStore()
  
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
  
  const displayLeads = hotMoneyLeads.length > 0 ? hotMoneyLeads : sampleLeads
  
  const formatCash = (amount) => {
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
    return `$${amount}`
  }
  
  const totalCapital = displayLeads.reduce((sum, l) => sum + (l.cashAmount || 0), 0)
  
  return (
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
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
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
