import React, { useState } from 'react'
import { Rocket, MapPin, Building2, DollarSign, Maximize2, Map, Search, CheckCircle2 } from 'lucide-react'

const PropertyResearch = () => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    assetClass: 'Industrial',
    price: '',
    size: '',
    region: 'Niagara',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [missionStatus, setMissionStatus] = useState(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setMissionStatus({
      id: 'M-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      phase: 1,
      status: 'running',
    })
    
    setIsSubmitting(false)
  }
  
  const phases = [
    { id: 1, name: 'Transaction Scout', icon: '🎯', status: 'completed' },
    { id: 2, name: 'Hot Money ID', icon: '🔥', status: missionStatus ? 'active' : 'pending' },
    { id: 3, name: 'Portfolio Match', icon: '💼', status: 'pending' },
    { id: 4, name: 'Agent Finder', icon: '👤', status: 'pending' },
    { id: 5, name: 'Lender Match', icon: '🏦', status: 'pending' },
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">New Research Mission</h1>
        <p className="text-text-secondary mt-1">
          Submit property to find qualified buyers, agents & lenders
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-red" />
              Property Input
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Street Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field w-full pr-10"
                      placeholder="1500 Michael Drive, Welland"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Welland"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="L3C 5W3"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Asset Class *
                  </label>
                  <div className="relative">
                    <select
                      className="input-field w-full appearance-none"
                      value={formData.assetClass}
                      onChange={(e) => setFormData({...formData, assetClass: e.target.value})}
                    >
                      <option>Industrial</option>
                      <option>Retail</option>
                      <option>Office</option>
                      <option>Multi-Family</option>
                      <option>Agricultural</option>
                      <option>Land</option>
                    </select>
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Region *
                  </label>
                  <div className="relative">
                    <select
                      className="input-field w-full appearance-none"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                    >
                      <option>Niagara</option>
                      <option>Toronto</option>
                      <option>Hamilton</option>
                      <option>GTA</option>
                      <option>Southwestern Ontario</option>
                    </select>
                    <Map className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input-field w-full pl-8"
                      placeholder="5000000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Size (SF)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input-field w-full"
                      placeholder="80000"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                    />
                    <Maximize2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <input type="checkbox" className="rounded border-border-subtle" />
                <span>Attach documents (COM, photos, OM)</span>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || missionStatus}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Launching Mission...</span>
                  </>
                ) : missionStatus ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Mission Launched</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Launch Mission</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Mission Progress */}
          {missionStatus && (
            <div className="card p-6 animate-slide-up">
              <h3 className="text-lg font-semibold mb-5">Mission Progress</h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-border-subtle">
                  <div 
                    className="h-full bg-accent-blue transition-all duration-500"
                    style={{ width: `${((missionStatus.phase - 1) / (phases.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Phase Nodes */}
                <div className="relative flex justify-between">
                  {phases.map((phase) => (
                    <div key={phase.id} className="flex flex-col items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg
                        border-2 transition-all duration-300 z-10 bg-bg-card
                        ${phase.status === 'completed' ? 'border-accent-green text-accent-green' : ''}
                        ${phase.status === 'active' ? 'border-accent-yellow text-accent-yellow animate-pulse' : ''}
                        ${phase.status === 'pending' ? 'border-border-subtle text-text-muted' : ''}
                      `}>
                        {phase.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{phase.icon}</span>
                        )}
                      </div>
                      <span className={`
                        text-xs mt-2 text-center max-w-[80px]
                        ${phase.status === 'active' ? 'text-accent-yellow font-medium' : 'text-text-secondary'}
                      `}>
                        {phase.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Current Status */}
              <div className="mt-6 p-4 rounded-xl bg-accent-yellow/5 border border-accent-yellow/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
                    <Search className="w-4 h-4 text-accent-yellow" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {phases.find(p => p.status === 'active')?.name || 'Processing'} is running...
                    </p>
                    <p className="text-sm text-text-secondary">
                      Analyzing recent transactions in {formData.city || 'target market'}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mission Config Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Research Depth</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-input cursor-pointer hover:bg-bg-card transition-colors">
                <input type="radio" name="depth" className="text-accent-red" />
                <div>
                  <p className="font-medium text-sm">Quick</p>
                  <p className="text-xs text-text-muted">Top 5 matches</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 cursor-pointer">
                <input type="radio" name="depth" defaultChecked className="text-accent-red" />
                <div>
                  <p className="font-medium text-sm text-accent-red">Standard</p>
                  <p className="text-xs text-text-muted">Top 10 matches</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-input cursor-pointer hover:bg-bg-card transition-colors">
                <input type="radio" name="depth" className="text-accent-red" />
                <div>
                  <p className="font-medium text-sm">Deep</p>
                  <p className="text-xs text-text-muted">Top 25 matches</p>
                </div>
              </label>
            </div>
          </div>
          
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Include</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border-subtle text-accent-red" />
                <span className="text-sm">Hot money analysis</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border-subtle text-accent-red" />
                <span className="text-sm">Portfolio matching</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border-subtle text-accent-red" />
                <span className="text-sm">Agent recommendations</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border-subtle text-accent-red" />
                <span className="text-sm">Lender matching</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded border-border-subtle text-accent-red" />
                <span className="text-sm">Comp analysis</span>
              </label>
            </div>
          </div>
          
          <div className="card p-5 bg-accent-red/5 border-accent-red/20">
            <h3 className="font-semibold text-accent-red mb-2">Estimated Time</h3>
            <p className="text-2xl font-bold">3-5 minutes</p>
            <p className="text-sm text-text-secondary mt-1">
              Based on standard research depth
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyResearch
