import React, { useState, useEffect, useMemo } from 'react'
import { 
  HardHat, Search, MapPin, Phone, Mail, Globe, Facebook, Linkedin,
  ExternalLink, ChevronDown, ChevronUp, Building2, Filter,
  Download, X, Home, Star, Map as MapIcon, MessageCircle,
  Instagram, MoreHorizontal, Share2, MessageSquare
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

// Import builder data from JSON
import buildersData from '../builders_data.json'

// Sample Ontario builders (fallback)
const SAMPLE_BUILDERS = [
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
  const cleanName = builder.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-')
  const websiteDomain = builder.website ? builder.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
  
  // Helper to safely create URLs
  const safeUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `https://${url}`
  }
  
  return {
    // Primary Links
    website: safeUrl(builder.website),
    phone: cleanPhone ? `tel:${cleanPhone}` : null,
    email: builder.email ? `mailto:${builder.email}` : null,
    
    // Social Media
    facebook: builder.facebook ? safeUrl(builder.facebook) : `https://www.facebook.com/search/pages/?q=${searchName}`,
    linkedin: builder.linkedin ? `https://linkedin.com/company/${builder.linkedin}` : `https://www.linkedin.com/search/results/companies/?keywords=${searchName}`,
    instagram: builder.instagram ? `https://instagram.com/${builder.instagram.replace('@', '')}` : `https://www.google.com/search?q=${searchName}+instagram`,
    
    // Search & Discovery
    google: `https://www.google.com/search?q=${searchName}`,
    googleBuilder: `https://www.google.com/search?q=${searchName}+builder`,
    googleNews: `https://www.google.com/search?q=${searchName}&tbm=nws`,
    
    // Maps & Location
    googleMaps: builder.address ? `https://www.google.com/maps/search/${encodeURIComponent(builder.address)}` : null,
    
    // Builder Platforms
    livabl: `https://livabl.com/search?q=${searchName}`,
    tarion: `https://www.google.com/search?q=${searchName}+tarion+warranty`,
    ohba: `https://www.google.com/search?q=${searchName}+OHBA+Ontario`,
    homestars: `https://www.google.com/search?q=${searchName}+HomeStars`,
    bbb: `https://www.bbb.org/ca/search?find_text=${searchName}`,
    
    // Property & Commercial
    loopnet: `https://www.loopnet.com/search?q=${searchName}`,
    costar: `https://www.google.com/search?q=${searchName}+CoStar`,
    
    // New Construction
    newHomes: `https://www.google.com/search?q=${searchName}+new+homes+construction`,
    pastProjects: `https://www.google.com/search?q=${searchName}+past+projects+developments`,
    
    // Reviews & Ratings
    reviews: `https://www.google.com/search?q=${searchName}+reviews`,
    
    // Contact Discovery
    contactPage: `https://www.google.com/search?q=${searchName}+"contact"`,
    linkedinPresident: `https://www.google.com/search?q=${searchName}+President+OR+CEO+linkedin`
  }
}

// Quick Link Button Component
const QuickLinkButton = ({ href, icon, label, color, fullWidth = false }) => {
  const isMailto = href?.startsWith('mailto:');
  const isTel = href?.startsWith('tel:');
  
  // Don't render if no href
  if (!href) return null;
  
  return (
    <a
      href={href}
      target={isMailto || isTel ? undefined : '_blank'}
      rel={isMailto || isTel ? undefined : 'noopener noreferrer'}
      className={`
        flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-white text-[10px] font-medium
        ${color} hover:opacity-90 transition-opacity whitespace-nowrap
        ${fullWidth ? 'w-full' : 'min-w-0'}
      `}
      title={label}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </a>
  );
};

const BuilderDirectory = () => {
  // State - use imported JSON data (4,149 builders!)
  const [builders] = useState(buildersData.length > 0 ? buildersData : SAMPLE_BUILDERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [displayLimit, setDisplayLimit] = useState(100) // Limit initial display
  const [filterCity, setFilterCity] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState({})
  const [expandedQuickLinks, setExpandedQuickLinks] = useState({})

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

  // Limit builders for display performance
  const limitedBuilders = useMemo(() => {
    return filteredBuilders.slice(0, displayLimit)
  }, [filteredBuilders, displayLimit])

  // Group by region then city
  const groupedBuilders = useMemo(() => {
    return limitedBuilders.reduce((acc, builder) => {
      if (!acc[builder.region]) acc[builder.region] = {}
      if (!acc[builder.region][builder.city]) acc[builder.region][builder.city] = []
      acc[builder.region][builder.city].push(builder)
      return acc
    }, {})
  }, [limitedBuilders])

  // Toggle group expansion
  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isGroupExpanded = (key) => expandedGroups[key] !== false

  // Toggle quick links expansion
  const toggleQuickLinks = (builderId) => {
    setExpandedQuickLinks(prev => ({
      ...prev,
      [builderId]: !prev[builderId]
    }))
  }

  // Stats
  const stats = useMemo(() => ({
    total: builders.length,
    filtered: limitedBuilders.length,
    totalFiltered: filteredBuilders.length,
    regions: regions.length,
    cities: [...new Set(builders.map(b => b.city))].length
  }), [builders, limitedBuilders, filteredBuilders, regions])

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
              placeholder="Search builders by name... (Press Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setExpandedQuickLinks({})
                }
              }}
              className="w-full pl-10 pr-20 py-2 bg-bg-input border border-border-subtle rounded-lg text-sm"
            />
            {/* Search Button */}
            <button
              onClick={() => {
                setExpandedQuickLinks({})
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-accent-blue hover:bg-accent-blue/80 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              Search
            </button>
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
          Showing <span className="font-medium text-text-primary">{limitedBuilders.length}</span> of <span className="font-medium text-text-primary">{filteredBuilders.length}</span> builders
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
                            onQuickLinksToggle={toggleQuickLinks}
                            isExpanded={expandedQuickLinks[builder.id]}
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

      {/* Load More Button */}
      {filteredBuilders.length > displayLimit && (
        <div className="flex justify-center py-4">
          <button 
            onClick={() => setDisplayLimit(prev => prev + 100)}
            className="btn-secondary flex items-center gap-2"
          >
            Load More Builders ({filteredBuilders.length - displayLimit} remaining)
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredBuilders.length === 0 && (
        <div className="card p-12 text-center">
          <HardHat className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No builders found</h3>
          <p className="text-text-secondary">Try adjusting your filters</p>
        </div>
      )}

    </div>
  )
}

// Builder Card Component
const BuilderCard = ({ builder, onQuickLinksToggle, isExpanded }) => {
  const links = generateQuickLinks(builder)
  
  return (
    <div className="p-4 rounded-lg border border-border-subtle hover:border-accent-orange/50 transition-all bg-bg-card overflow-hidden">
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
      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-2">
          {/* Facebook */}
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors group"
          >
            <Facebook className="w-5 h-5 text-[#1877F2]" />
            <span className="text-[10px] text-text-secondary group-hover:text-[#1877F2]">FB</span>
          </a>
          
          {/* Website */}
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors group"
          >
            <Globe className="w-5 h-5 text-purple-500" />
            <span className="text-[10px] text-text-secondary group-hover:text-purple-400">Web</span>
          </a>
          
          {/* Instagram */}
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors group"
          >
            <Instagram className="w-5 h-5 text-pink-400" />
            <span className="text-[10px] text-text-secondary group-hover:text-pink-400">IG</span>
          </a>
          
          {/* Call */}
          <a
            href={links.phone}
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors group"
            title={builder.phone ? `Call: ${builder.phone}` : 'No phone'}
          >
            <Phone className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] text-text-secondary group-hover:text-emerald-400">Call</span>
          </a>
        </div>
      </div>
      
      {/* Expand Quick Links Button */}
      <button
        onClick={() => onQuickLinksToggle(builder.id)}
        className="w-full py-2 bg-bg-input/50 hover:bg-bg-input border-t border-border-subtle flex items-center justify-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Quick Links
          </>
        ) : (
          <>
            <MoreHorizontal className="w-4 h-4" />
            Quick Links
          </>
        )}
      </button>
      
      {/* Expanded Quick Links Section */}
      {isExpanded && (
        <div className="border-t border-border-subtle bg-bg-input/30 p-4 space-y-4">
          {/* Primary Quick Links */}
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              Primary Links
            </p>
            <div className="grid grid-cols-4 gap-2">
              {links.website && (
                <QuickLinkButton 
                  href={links.website} 
                  icon={<Globe className="w-3.5 h-3.5" />} 
                  label="Website"
                  color="bg-purple-500"
                />
              )}
              {links.phone && (
                <QuickLinkButton 
                  href={links.phone} 
                  icon={<Phone className="w-3.5 h-3.5" />} 
                  label="Call"
                  color="bg-green-500"
                />
              )}
              {links.email && (
                <QuickLinkButton 
                  href={links.email} 
                  icon={<Mail className="w-3.5 h-3.5" />} 
                  label="Email"
                  color="bg-blue-500"
                />
              )}
              {links.googleMaps && (
                <QuickLinkButton 
                  href={links.googleMaps} 
                  icon={<MapIcon className="w-3.5 h-3.5" />} 
                  label="Maps"
                  color="bg-red-500"
                />
              )}
            </div>
          </div>
          
          {/* Social Media Section */}
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Share2 className="w-3 h-3" />
              Social Media
            </p>
            <div className="grid grid-cols-3 gap-2">
              <QuickLinkButton 
                href={links.facebook} 
                icon={<Facebook className="w-3.5 h-3.5" />} 
                label="Facebook"
                color="bg-[#1877F2]"
              />
              <QuickLinkButton 
                href={links.linkedin} 
                icon={<Linkedin className="w-3.5 h-3.5" />} 
                label="LinkedIn"
                color="bg-[#0A66C2]"
              />
              <QuickLinkButton 
                href={links.instagram} 
                icon={<Instagram className="w-3.5 h-3.5" />} 
                label="Instagram"
                color="bg-gradient-to-br from-purple-500 to-pink-500"
              />
            </div>
          </div>
          
          {/* Builder Platforms Section */}
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Home className="w-3 h-3" />
              Builder Platforms
            </p>
            <div className="grid grid-cols-3 gap-2">
              <QuickLinkButton 
                href={links.livabl} 
                icon={<Search className="w-3.5 h-3.5" />} 
                label="LIVABL"
                color="bg-purple-600"
              />
              <QuickLinkButton 
                href={links.tarion} 
                icon={<Star className="w-3.5 h-3.5" />} 
                label="Tarion"
                color="bg-orange-500"
              />
              <QuickLinkButton 
                href={links.homestars} 
                icon={<Star className="w-3.5 h-3.5" />} 
                label="HomeStars"
                color="bg-yellow-500"
              />
              <QuickLinkButton 
                href={links.ohba} 
                icon={<Building2 className="w-3.5 h-3.5" />} 
                label="OHBA"
                color="bg-red-600"
              />
              <QuickLinkButton 
                href={links.bbb} 
                icon={<Search className="w-3.5 h-3.5" />} 
                label="BBB"
                color="bg-slate-600"
              />
              <QuickLinkButton 
                href={links.newHomes} 
                icon={<Home className="w-3.5 h-3.5" />} 
                label="New Homes"
                color="bg-teal-500"
              />
            </div>
          </div>
          
          {/* Commercial Real Estate Section */}
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Building2 className="w-3 h-3" />
              Commercial Real Estate
            </p>
            <div className="grid grid-cols-2 gap-2">
              <QuickLinkButton 
                href={links.loopnet} 
                icon={<Search className="w-3.5 h-3.5" />} 
                label="LOOPNET"
                color="bg-indigo-600"
                fullWidth
              />
              <QuickLinkButton 
                href={links.costar} 
                icon={<Search className="w-3.5 h-3.5" />} 
                label="CoStar"
                color="bg-blue-700"
                fullWidth
              />
            </div>
          </div>
          
          {/* Research Section */}
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Search className="w-3 h-3" />
              Research
            </p>
            <div className="grid grid-cols-2 gap-2">
              <QuickLinkButton 
                href={links.google} 
                icon={<Search className="w-3.5 h-3.5" />} 
                label="Google"
                color="bg-slate-600"
                fullWidth
              />
              <QuickLinkButton 
                href={links.googleNews} 
                icon={<MessageSquare className="w-3.5 h-3.5" />} 
                label="News"
                color="bg-amber-600"
                fullWidth
              />
              <QuickLinkButton 
                href={links.reviews} 
                icon={<Star className="w-3.5 h-3.5" />} 
                label="Reviews"
                color="bg-yellow-600"
                fullWidth
              />
              <QuickLinkButton 
                href={links.linkedinPresident} 
                icon={<Linkedin className="w-3.5 h-3.5" />} 
                label="CEO/President"
                color="bg-[#0A66C2]"
                fullWidth
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuilderDirectory
