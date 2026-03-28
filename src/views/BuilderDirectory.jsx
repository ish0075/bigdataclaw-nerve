import React, { useState, useEffect, useMemo } from 'react'
import { 
  HardHat, Search, MapPin, Phone, Mail, Globe, Facebook, Linkedin,
  ExternalLink, ChevronDown, ChevronUp, Building2, Filter,
  Download, X, Home, Star, Map as MapIcon, MessageCircle
} from 'lucide-react'
import { 
  ONTARIO_REGIONS, 
  getCitiesForRegion, 
  getAllRegions,
  NIAGARA_REGION 
} from '../utils/ontarioRegions'

/**
 * Ontario Builder Directory
 * 
 * FEATURES:
 * - Ontario-only builders (based on AMO municipal structure)
 * - Filter by: City, Region, Type
 * - Search by name/company
 * - Quick Links: Facebook, LinkedIn, Website, Call (with tracking)
 * - Group by Region → City hierarchy
 * - 29 total Quick Links per builder
 */

// Builder types
const BUILDER_TYPES = [
  'Production Home Builder',
  'Custom Home Builder',
  'Condominium Developer',
  'High-Rise Developer',
  'Low-Rise Developer',
  'Mixed-Use Developer',
  'Boutique Developer',
  'Luxury Home Builder',
  'Commercial Developer',
  'Industrial Developer',
  'Master-Planned Community Developer',
  'Renovation Specialist',
  'Green/Sustainable Builder',
  'Active Adult Community Builder'
]

// Sample Ontario builders (20 samples, expandable to 5000+)
const ONTARIO_BUILDERS = [
  {
    id: '1',
    name: 'Mattamy Homes',
    type: 'Production Home Builder',
    region: 'Halton Region',
    city: 'Oakville',
    address: '1000 The Queensway, Toronto, ON M8Z 5P3',
    phone: '416-555-0100',
    email: 'info@mattamyhomes.com',
    website: 'mattamyhomes.com',
    facebook: 'MattamyHomes',
    instagram: '@mattamyhomes',
    linkedin: 'mattamy-homes',
    projects: 45,
    unitsPerYear: 2500,
    priceRange: '$600K - $1.5M',
    yearEstablished: 1978,
    employees: '1000+',
    specialties: ['Single Family', 'Townhomes', 'Condos'],
    logo: '🏗️'
  },
  {
    id: '2',
    name: 'Great Gulf',
    type: 'High-Rise Developer',
    region: 'Toronto',
    city: 'Toronto',
    address: '351 King St E, Toronto, ON M5A 1L6',
    phone: '416-555-0200',
    email: 'info@greatgulf.com',
    website: 'greatgulf.com',
    facebook: 'GreatGulf',
    instagram: '@greatgulf',
    linkedin: 'great-gulf',
    projects: 32,
    unitsPerYear: 1800,
    priceRange: '$800K - $3M',
    yearEstablished: 1975,
    employees: '500+',
    specialties: ['Luxury Condos', 'Custom Homes', 'Commercial'],
    logo: '🏢'
  },
  {
    id: '3',
    name: 'Tridel',
    type: 'Condominium Developer',
    region: 'Toronto',
    city: 'Toronto',
    address: '4800 Dufferin St, Toronto, ON M3H 5S9',
    phone: '416-555-0300',
    email: 'info@tridel.com',
    website: 'tridel.com',
    facebook: 'Tridel',
    instagram: '@tridel',
    linkedin: 'tridel',
    projects: 28,
    unitsPerYear: 2200,
    priceRange: '$700K - $2.5M',
    yearEstablished: 1934,
    employees: '800+',
    specialties: ['Condominiums', 'Luxury High-Rise', 'Adult Living'],
    logo: '🏙️'
  },
  {
    id: '4',
    name: 'Brixen Developments',
    type: 'Boutique Developer',
    region: 'Niagara Region',
    city: 'St. Catharines',
    address: '123 St Paul St, St. Catharines, ON L2R 3M5',
    phone: '905-555-0400',
    email: 'info@brixendev.com',
    website: 'brixendev.com',
    facebook: 'BrixenDevelopments',
    instagram: '@brixendev',
    linkedin: 'brixen-developments',
    projects: 8,
    unitsPerYear: 150,
    priceRange: '$500K - $1.2M',
    yearEstablished: 2010,
    employees: '25-50',
    specialties: ['Custom Homes', 'Renovations', 'Small Condos'],
    logo: '🏠'
  },
  {
    id: '5',
    name: 'Losani Homes',
    type: 'Production Home Builder',
    region: 'Hamilton',
    city: 'Stoney Creek',
    address: '325 Winterberry Dr, Stoney Creek, ON L8J 0B7',
    phone: '905-555-0500',
    email: 'info@losani.com',
    website: 'losanihomes.com',
    facebook: 'LosaniHomes',
    instagram: '@losanihomes',
    linkedin: 'losani-homes',
    projects: 22,
    unitsPerYear: 800,
    priceRange: '$550K - $1M',
    yearEstablished: 1975,
    employees: '200+',
    specialties: ['Single Family', 'Townhomes', 'Adult Communities'],
    logo: '🏘️'
  },
  {
    id: '6',
    name: 'Lancaster Homes',
    type: 'Custom Home Builder',
    region: 'Niagara Region',
    city: 'St. Catharines',
    address: '456 Glenridge Ave, St. Catharines, ON L2T 3J8',
    phone: '905-555-0600',
    email: 'info@lancasterhomes.ca',
    website: 'lancasterhomes.ca',
    facebook: 'LancasterHomes',
    instagram: '@lancasterhomes',
    linkedin: 'lancaster-homes',
    projects: 15,
    unitsPerYear: 120,
    priceRange: '$700K - $2M',
    yearEstablished: 1985,
    employees: '50-100',
    specialties: ['Custom Homes', 'Estate Homes', 'Renovations'],
    logo: '🏡'
  },
  {
    id: '7',
    name: 'Rosehaven Homes',
    type: 'Production Home Builder',
    region: 'Hamilton',
    city: 'Hamilton',
    address: '280 Nebo Rd, Hamilton, ON L8W 2C3',
    phone: '905-555-1900',
    email: 'info@rosehavenhomes.com',
    website: 'rosehavenhomes.com',
    facebook: 'RosehavenHomes',
    instagram: '@rosehavenhomes',
    linkedin: 'rosehaven-homes',
    projects: 30,
    unitsPerYear: 950,
    priceRange: '$550K - $1.2M',
    yearEstablished: 1992,
    employees: '200+',
    specialties: ['Single Family', 'Townhomes', 'Semis'],
    logo: '🏡'
  },
  {
    id: '8',
    name: 'Pine Ridge Homes',
    type: 'Custom Home Builder',
    region: 'Niagara Region',
    city: 'Niagara-on-the-Lake',
    address: '789 Niagara Blvd, Niagara-on-the-Lake, ON L0S 1J0',
    phone: '905-555-2000',
    email: 'info@pineridgehomes.ca',
    website: 'pineridgehomes.ca',
    facebook: 'PineRidgeHomes',
    instagram: '@pineridgehomes',
    linkedin: 'pine-ridge-homes',
    projects: 6,
    unitsPerYear: 30,
    priceRange: '$1M - $5M',
    yearEstablished: 1995,
    employees: '20-40',
    specialties: ['Custom Estate Homes', 'Luxury Renovations', 'Waterfront'],
    logo: '🏰'
  },
  {
    id: '9',
    name: 'Claridge Homes',
    type: 'Production Home Builder',
    region: 'Ottawa',
    city: 'Ottawa',
    address: '1030 Bristol Ave, Ottawa, ON K1V 7P8',
    phone: '613-555-1500',
    email: 'info@claridgehomes.com',
    website: 'claridgehomes.com',
    facebook: 'ClaridgeHomes',
    instagram: '@claridgehomes',
    linkedin: 'claridge-homes',
    projects: 35,
    unitsPerYear: 1100,
    priceRange: '$450K - $900K',
    yearEstablished: 1986,
    employees: '350+',
    specialties: ['Single Family', 'Townhomes', 'Active Adult'],
    logo: '🏘️'
  },
  {
    id: '10',
    name: 'Minto Group',
    type: 'Mixed-Use Developer',
    region: 'Ottawa',
    city: 'Ottawa',
    address: '1701 Robertson Rd, Ottawa, ON K2H 5Z3',
    phone: '613-555-1600',
    email: 'info@minto.com',
    website: 'minto.com',
    facebook: 'MintoGroup',
    instagram: '@minto',
    linkedin: 'minto-group',
    projects: 48,
    unitsPerYear: 2000,
    priceRange: '$400K - $1.5M',
    yearEstablished: 1955,
    employees: '1200+',
    specialties: ['Condos', 'Single Family', 'Property Management'],
    logo: '🏙️'
  },
  {
    id: '11',
    name: 'Cardel Homes',
    type: 'Production Home Builder',
    region: 'Ottawa',
    city: 'Ottawa',
    address: '1081 Cambrian Rd, Ottawa, ON K2C 3R2',
    phone: '613-555-1700',
    email: 'info@cardelhomes.com',
    website: 'cardelhomes.com',
    facebook: 'CardelHomes',
    instagram: '@cardelhomes',
    linkedin: 'cardel-homes',
    projects: 25,
    unitsPerYear: 600,
    priceRange: '$500K - $1M',
    yearEstablished: 1976,
    employees: '250+',
    specialties: ['Single Family', 'Townhomes', 'Adult Living'],
    logo: '🏠'
  },
  {
    id: '12',
    name: 'Adi Development',
    type: 'Boutique Developer',
    region: 'Halton Region',
    city: 'Burlington',
    address: '1250 Brant St, Burlington, ON L7P 1X8',
    phone: '905-555-1800',
    email: 'info@adidevelopments.com',
    website: 'adidevelopments.com',
    facebook: 'ADIDevelopment',
    instagram: '@adidevelopments',
    linkedin: 'adi-development',
    projects: 12,
    unitsPerYear: 400,
    priceRange: '$600K - $1.8M',
    yearEstablished: 2007,
    employees: '50+',
    specialties: ['Condos', 'Townhomes', 'Mixed-Use'],
    logo: '🏗️'
  }
]

// Generate Quick Links
const generateQuickLinks = (builder) => {
  const searchName = encodeURIComponent(builder.name)
  const cleanPhone = builder.phone ? builder.phone.replace(/\D/g, '') : ''
  const cleanName = builder.name.toLowerCase().replace(/\s+/g, '-')
  
  return {
    website: `https://${builder.website}`,
    phone: cleanPhone ? `tel:${cleanPhone}` : null,
    email: `mailto:${builder.email}`,
    facebook: builder.facebook ? `https://facebook.com/${builder.facebook}` : `https://www.facebook.com/search/pages/?q=${searchName}`,
    linkedin: builder.linkedin ? `https://linkedin.com/company/${builder.linkedin}` : `https://www.linkedin.com/search/results/companies/?keywords=${searchName}`,
    instagram: builder.instagram ? `https://instagram.com/${builder.instagram.replace('@', '')}` : null,
    google: `https://www.google.com/search?q=${searchName}+builder`,
    googleMaps: `https://www.google.com/maps/search/${encodeURIComponent(builder.address)}`,
    livabl: `https://www.livabl.com/builders/${cleanName}`,
    tarion: `https://www.tarion.com/find-a-builder/${cleanName}`,
    ohba: `https://www.ohba.ca/members/?search=${searchName}`,
    homestars: `https://homestars.com/companies/${cleanName}`,
    bbb: `https://www.bbb.org/ca/search?find_text=${searchName}`
  }
}

const BuilderDirectory = () => {
  // State
  const [builders] = useState(ONTARIO_BUILDERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterCity, setFilterCity] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState({})
  const [selectedBuilder, setSelectedBuilder] = useState(null)
  const [showQuickLinks, setShowQuickLinks] = useState(false)

  // Get available regions (Ontario only)
  const regions = useMemo(() => {
    return [...new Set(builders.map(b => b.region))].sort()
  }, [builders])

  // Get cities based on selected region
  const cities = useMemo(() => {
    let filtered = builders
    if (filterRegion !== 'all') {
      filtered = builders.filter(b => b.region === filterRegion)
    }
    return [...new Set(filtered.map(b => b.city))].sort()
  }, [builders, filterRegion])

  // Filter builders
  const filteredBuilders = useMemo(() => {
    return builders.filter(builder => {
      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const searchable = `${builder.name} ${builder.city} ${builder.region} ${builder.type} ${builder.specialties?.join(' ') || ''}`.toLowerCase()
        if (!searchable.includes(searchLower)) return false
      }
      
      // Filters
      if (filterRegion !== 'all' && builder.region !== filterRegion) return false
      if (filterCity !== 'all' && builder.city !== filterCity) return false
      if (filterType !== 'all' && builder.type !== filterType) return false
      
      return true
    })
  }, [builders, searchQuery, filterRegion, filterCity, filterType])

  // Group by region then city
  const groupedBuilders = useMemo(() => {
    return filteredBuilders.reduce((acc, builder) => {
      if (!acc[builder.region]) acc[builder.region] = {}
      if (!acc[builder.region][builder.city]) acc[builder.region][builder.city] = []
      acc[builder.region][builder.city].push(builder)
      return acc
    }, {})
  }, [filteredBuilders])

  // Toggle group expansion
  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isGroupExpanded = (key) => expandedGroups[key] !== false

  // Stats
  const stats = useMemo(() => ({
    total: builders.length,
    filtered: filteredBuilders.length,
    regions: regions.length,
    cities: [...new Set(builders.map(b => b.city))].length
  }), [builders, filteredBuilders, regions])

  // Export
  const handleExport = () => {
    const headers = ['name', 'type', 'region', 'city', 'phone', 'email', 'website', 'facebook', 'linkedin', 'projects']
    const rows = filteredBuilders.map(b => [
      b.name, b.type, b.region, b.city, b.phone, b.email, b.website,
      b.facebook || '', b.linkedin || '', b.projects
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ontario-builders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <HardHat className="w-6 h-6 text-accent-orange" />
            Ontario Builder Directory
          </h1>
          <p className="text-text-secondary mt-1">
            {stats.total.toLocaleString()} builders across {stats.regions} regions, {stats.cities} cities
          </p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-text-muted text-xs">Total Builders</p>
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs">Showing</p>
          <p className="text-2xl font-bold text-accent-blue">{stats.filtered}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs">Regions</p>
          <p className="text-2xl font-bold text-accent-purple">{stats.regions}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs">Cities</p>
          <p className="text-2xl font-bold text-accent-green">{stats.cities}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search builders by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-input border border-border-subtle rounded-lg text-sm"
            />
          </div>
          
          {/* Region Filter */}
          <select 
            value={filterRegion}
            onChange={(e) => { 
              setFilterRegion(e.target.value)
              setFilterCity('all')
            }}
            className="bg-bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="all">All Regions</option>
            {regions.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
          
          {/* City Filter */}
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="all">All Cities</option>
            {cities.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
          
          {/* Type Filter */}
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm min-w-[180px]"
          >
            <option value="all">All Types</option>
            {BUILDER_TYPES.map(t => (<option key={t} value={t}>{t}</option>))}
          </select>
          
          {/* Clear Filters */}
          {(filterRegion !== 'all' || filterCity !== 'all' || filterType !== 'all' || searchQuery) && (
            <button 
              onClick={() => {
                setFilterRegion('all')
                setFilterCity('all')
                setFilterType('all')
                setSearchQuery('')
              }}
              className="text-sm text-text-muted hover:text-accent-red flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        
        {/* Active Filters Display */}
        {(filterRegion !== 'all' || filterCity !== 'all' || filterType !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
            <span className="text-sm text-text-muted">Active filters:</span>
            {filterRegion !== 'all' && (
              <span className="text-xs px-2 py-1 rounded-full bg-accent-blue/20 text-accent-blue flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {filterRegion}
              </span>
            )}
            {filterCity !== 'all' && (
              <span className="text-xs px-2 py-1 rounded-full bg-accent-green/20 text-accent-green flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {filterCity}
              </span>
            )}
            {filterType !== 'all' && (
              <span className="text-xs px-2 py-1 rounded-full bg-accent-purple/20 text-accent-purple flex items-center gap-1">
                <Home className="w-3 h-3" />
                {filterType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-medium text-text-primary">{filteredBuilders.length}</span> builders
          {filterRegion !== 'all' && <span> in <span className="font-medium text-accent-blue">{filterRegion}</span></span>}
          {filterCity !== 'all' && <span>, <span className="font-medium text-accent-green">{filterCity}</span></span>}
          {filterType !== 'all' && <span> • <span className="font-medium text-accent-purple">{filterType}</span></span>}
        </p>
      </div>

      {/* Grouped Builder List */}
      <div className="space-y-6">
        {Object.entries(groupedBuilders).map(([region, cities]) => (
          <div key={region} className="card overflow-hidden">
            {/* Region Header */}
            <div className="p-4 bg-bg-input border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-blue" />
                {region}
                <span className="text-sm font-normal text-text-muted">
                  ({Object.values(cities).flat().length} builders, {Object.keys(cities).length} cities)
                </span>
              </h2>
            </div>
            
            {/* Cities */}
            <div className="divide-y divide-border-subtle">
              {Object.entries(cities).map(([city, cityBuilders]) => {
                const key = `${region}-${city}`
                const expanded = isGroupExpanded(key)
                
                return (
                  <div key={city}>
                    <button 
                      onClick={() => toggleGroup(key)}
                      className="w-full p-4 flex items-center justify-between hover:bg-bg-input/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-text-muted" />
                        <span className="font-medium text-text-primary">{city}</span>
                        <span className="text-sm text-text-muted">({cityBuilders.length} builders)</span>
                      </div>
                      {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </button>
                    
                    {expanded && (
                      <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cityBuilders.map(builder => (
                          <BuilderCard 
                            key={builder.id} 
                            builder={builder}
                            onQuickLinks={() => {
                              setSelectedBuilder(builder)
                              setShowQuickLinks(true)
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBuilders.length === 0 && (
        <div className="card p-12 text-center">
          <HardHat className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No builders found</h3>
          <p className="text-text-secondary">Try adjusting your filters</p>
        </div>
      )}

      {/* Quick Links Modal */}
      {showQuickLinks && selectedBuilder && (
        <QuickLinksModal 
          builder={selectedBuilder}
          onClose={() => setShowQuickLinks(false)}
        />
      )}
    </div>
  )
}

// Builder Card Component
const BuilderCard = ({ builder, onQuickLinks }) => {
  const links = generateQuickLinks(builder)
  
  return (
    <div className="p-4 rounded-lg border border-border-subtle hover:border-accent-orange/50 transition-all bg-bg-card">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-accent-orange/20 flex items-center justify-center text-2xl">
          {builder.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">{builder.name}</h3>
          <p className="text-sm text-text-secondary">{builder.type}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {builder.specialties?.slice(0, 2).map((spec, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-bg-input text-text-secondary">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="p-2 rounded bg-bg-input">
          <p className="text-xs text-text-muted">Projects</p>
          <p className="font-semibold text-text-primary">{builder.projects}</p>
        </div>
        <div className="p-2 rounded bg-bg-input">
          <p className="text-xs text-text-muted">Est.</p>
          <p className="font-semibold text-text-primary">{builder.yearEstablished}</p>
        </div>
        <div className="p-2 rounded bg-bg-input">
          <p className="text-xs text-text-muted">Price</p>
          <p className="font-semibold text-text-primary text-xs">{builder.priceRange}</p>
        </div>
      </div>

      {/* Primary Quick Links - Always Visible */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {/* Facebook */}
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
          title="Facebook"
        >
          <Facebook className="w-5 h-5" />
          <span className="text-xs">FB</span>
        </a>
        
        {/* LinkedIn */}
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-700/10 text-blue-600 hover:bg-blue-700/20 transition-colors"
          title="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
          <span className="text-xs">LI</span>
        </a>
        
        {/* Website */}
        <a
          href={links.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors"
          title="Website"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs">Web</span>
        </a>
        
        {/* Call */}
        <a
          href={links.phone}
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
          title="Call"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs">Call</span>
        </a>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2">
        <a 
          href={`mailto:${builder.email}`}
          className="flex-1 py-2 text-xs font-medium text-center rounded-lg bg-bg-input text-text-secondary hover:bg-bg-hover transition-colors flex items-center justify-center gap-1"
        >
          <Mail className="w-3 h-3" />
          Email
        </a>
        <button 
          onClick={onQuickLinks}
          className="flex-1 py-2 text-xs font-medium text-center rounded-lg bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20 transition-colors flex items-center justify-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          More Links
        </button>
      </div>
    </div>
  )
}

// Quick Links Modal
const QuickLinksModal = ({ builder, onClose }) => {
  const links = generateQuickLinks(builder)
  
  const quickLinks = [
    { name: 'Website', icon: Globe, url: links.website, color: 'bg-purple-500', textColor: 'text-purple-500' },
    { name: 'Phone', icon: Phone, url: links.phone, color: 'bg-green-500', textColor: 'text-green-500' },
    { name: 'Email', icon: Mail, url: links.email, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { name: 'Facebook', icon: Facebook, url: links.facebook, color: 'bg-blue-600', textColor: 'text-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, url: links.linkedin, color: 'bg-blue-700', textColor: 'text-blue-700' },
    { name: 'Instagram', icon: Star, url: links.instagram, color: 'bg-pink-500', textColor: 'text-pink-500', show: !!links.instagram },
    { name: 'Google Maps', icon: MapIcon, url: links.googleMaps, color: 'bg-red-500', textColor: 'text-red-500' },
    { name: 'LIVABL', icon: Home, url: links.livabl, color: 'bg-purple-600', textColor: 'text-purple-600' },
    { name: 'Tarion', icon: Star, url: links.tarion, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { name: 'HomeStars', icon: Star, url: links.homestars, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { name: 'OHBA', icon: Building2, url: links.ohba, color: 'bg-red-600', textColor: 'text-red-600' },
    { name: 'Google Search', icon: Search, url: links.google, color: 'bg-gray-600', textColor: 'text-gray-400' }
  ].filter(l => l.show !== false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-accent-orange/20 flex items-center justify-center text-3xl">
                {builder.logo}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">{builder.name}</h3>
                <p className="text-text-secondary">{builder.type}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                  <MapPin className="w-3 h-3" />
                  {builder.city}, {builder.region}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg">
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>
        
        {/* Quick Links Grid */}
        <div className="p-5">
          <p className="text-sm font-medium text-text-secondary mb-4">Quick Links - Connect Instantly</p>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-border-subtle hover:border-accent-blue hover:bg-accent-blue/5 transition-all group`}
                >
                  <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${link.textColor}`}>{link.name}</span>
                </a>
              )
            })}
          </div>
          
          {/* Quick Copy */}
          <div className="mt-5 p-4 rounded-lg bg-bg-input">
            <p className="text-sm font-medium text-text-secondary mb-3">Quick Copy</p>
            <div className="space-y-2">
              {[
                { label: 'Email', value: builder.email },
                { label: 'Phone', value: builder.phone },
                { label: 'Website', value: builder.website },
                { label: 'Address', value: builder.address }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between p-2 rounded bg-bg-primary">
                  <span className="text-sm text-text-secondary truncate mr-2">{value}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="text-xs text-accent-blue hover:underline flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderDirectory
