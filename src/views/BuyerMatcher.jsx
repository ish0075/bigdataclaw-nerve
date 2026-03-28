import React, { useState } from 'react'
import { Users, Search, Filter, Phone, Mail, ExternalLink, Target, MapPin, DollarSign, Building2, ChevronRight, Star, Download } from 'lucide-react'

const sampleBuyers = [
  { id: '1', entity: 'Dream Industrial REIT', type: 'Industrial', cash: 50000000, locations: ['Niagara', 'Hamilton', 'GTA'], minDeal: 2000000, maxDeal: 20000000, score: 95, lastActive: '2 days ago', contacts: 3 },
  { id: '2', entity: 'Carttera Private Equities', type: 'Mixed-Use', cash: 100000000, locations: ['Niagara', 'Toronto'], minDeal: 5000000, maxDeal: 50000000, score: 92, lastActive: '5 days ago', contacts: 5 },
  { id: '3', entity: 'Pure Industrial REIT', type: 'Industrial', cash: 75000000, locations: ['Niagara', 'GTA', 'Hamilton'], minDeal: 3000000, maxDeal: 15000000, score: 88, lastActive: '1 week ago', contacts: 2 },
  { id: '4', entity: '2650687 Ontario Ltd', type: 'Industrial', cash: 15000000, locations: ['West Lincoln', 'Welland'], minDeal: 5000000, maxDeal: 15000000, score: 85, lastActive: '3 days ago', contacts: 1 },
  { id: '5', entity: 'Turnberry Holdings Inc', type: 'Retail', cash: 25000000, locations: ['Niagara', 'Lincoln'], minDeal: 2000000, maxDeal: 10000000, score: 82, lastActive: '1 day ago', contacts: 4 },
  { id: '6', entity: 'Stone Eagle Winery', type: 'Agricultural', cash: 12000000, locations: ['NOTL', 'Niagara'], minDeal: 3000000, maxDeal: 8000000, score: 78, lastActive: '4 days ago', contacts: 2 },
]

const BuyerMatcher = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  
  const filteredBuyers = sampleBuyers.filter(buyer => {
    if (searchQuery && !buyer.entity.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterType !== 'all' && buyer.type !== filterType) return false
    return true
  })
  
  const formatCurrency = (value) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    return `$${(value / 1e3).toFixed(0)}K`
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-accent-red" />
            Buyer Matcher
          </h1>
          <p className="text-text-secondary mt-1">Find qualified buyers for your properties</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export List
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-text-muted text-sm">Total Buyers</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{sampleBuyers.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">High Match (90%+)</p>
          <p className="text-3xl font-bold text-accent-green mt-1">{sampleBuyers.filter(b => b.score >= 90).length}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Total Capital</p>
          <p className="text-3xl font-bold text-accent-red mt-1">{formatCurrency(sampleBuyers.reduce((sum, b) => sum + b.cash, 0))}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Avg Match Score</p>
          <p className="text-3xl font-bold text-accent-blue mt-1">{Math.round(sampleBuyers.reduce((sum, b) => sum + b.score, 0) / sampleBuyers.length)}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search buyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-input border border-border-subtle rounded-lg text-sm"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="Industrial">Industrial</option>
            <option value="Retail">Retail</option>
            <option value="Office">Office</option>
            <option value="Mixed-Use">Mixed-Use</option>
            <option value="Agricultural">Agricultural</option>
          </select>
        </div>
      </div>
      
      {/* Buyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuyers.map(buyer => (
          <div key={buyer.id} className="card p-5 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedBuyer(buyer)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary">{buyer.entity}</h3>
                <p className="text-sm text-text-secondary">{buyer.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${buyer.score >= 90 ? 'text-accent-green' : buyer.score >= 80 ? 'text-accent-yellow' : 'text-text-muted'}`}>
                  {buyer.score}
                </p>
                <p className="text-xs text-text-muted">Match</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Cash: {formatCurrency(buyer.cash)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Range: {formatCurrency(buyer.minDeal)} - {formatCurrency(buyer.maxDeal)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{buyer.locations.join(', ')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <span className="text-xs text-text-muted">Active {buyer.lastActive}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-bg-input hover:bg-accent-green/20 text-text-secondary hover:text-accent-green transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-bg-input hover:bg-accent-blue/20 text-text-secondary hover:text-accent-blue transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Buyer Detail Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedBuyer(null)}>
          <div className="card w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <div>
                <h3 className="font-semibold text-text-primary">{selectedBuyer.entity}</h3>
                <p className="text-sm text-text-secondary">{selectedBuyer.type}</p>
              </div>
              <button onClick={() => setSelectedBuyer(null)} className="p-2 hover:bg-bg-input rounded-lg">
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-center">
                <div className={`text-5xl font-bold ${selectedBuyer.score >= 90 ? 'text-accent-green' : 'text-accent-yellow'}`}>
                  {selectedBuyer.score}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bg-input">
                  <p className="text-xs text-text-muted">Cash Position</p>
                  <p className="font-semibold text-text-primary">{formatCurrency(selectedBuyer.cash)}</p>
                </div>
                <div className="p-3 rounded-lg bg-bg-input">
                  <p className="text-xs text-text-muted">Deal Range</p>
                  <p className="font-semibold text-text-primary">{formatCurrency(selectedBuyer.minDeal)} - {formatCurrency(selectedBuyer.maxDeal)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-2">Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBuyer.locations.map(loc => (
                    <span key={loc} className="px-2 py-1 rounded bg-accent-red/10 text-accent-red text-xs">{loc}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyerMatcher
