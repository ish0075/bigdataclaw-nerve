import React, { useState } from 'react'
import { 
  Building2, Search, Phone, Mail, Percent, DollarSign, CheckCircle2, 
  MapPin, Briefcase, TrendingUp, ChevronRight, ExternalLink, Globe,
  Linkedin, ArrowUpRight, Filter, Download, X, Star
} from 'lucide-react'

// Asset Classes for lenders
const ASSET_CLASSES = [
  { id: 'all', label: 'All Asset Classes', color: 'bg-gray-500' },
  { id: 'Industrial', label: 'Industrial', color: 'bg-blue-500' },
  { id: 'Retail', label: 'Retail', color: 'bg-purple-500' },
  { id: 'Office', label: 'Office', color: 'bg-cyan-500' },
  { id: 'Multi-Family', label: 'Multi-Family', color: 'bg-green-500' },
  { id: 'Land', label: 'Land', color: 'bg-amber-500' },
  { id: 'Mixed-Use', label: 'Mixed-Use', color: 'bg-pink-500' },
  { id: 'Hospitality', label: 'Hospitality', color: 'bg-orange-500' },
  { id: 'Construction', label: 'Construction', color: 'bg-indigo-500' },
  { id: 'All Commercial', label: 'All Commercial', color: 'bg-teal-500' },
]

// Lender database sorted by asset class
const lenderDatabase = [
  // Industrial Specialists
  {
    id: '1',
    name: 'RBC Commercial Banking',
    type: 'Bank',
    assetClasses: ['Industrial', 'All Commercial'],
    specialty: 'Industrial',
    minLoan: 1000000,
    maxLoan: 50000000,
    ltv: 75,
    rate: 'Prime + 1.5%',
    term: '5-10 years',
    regions: ['National'],
    contact: 'Sarah Williams',
    phone: '1-800-555-0100',
    email: 'commercial@rbc.com',
    website: 'rbc.com/business',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Caisse de depot (Ivanhoé Cambridge)',
    type: 'Institutional',
    assetClasses: ['Industrial', 'Office'],
    specialty: 'Industrial',
    minLoan: 10000000,
    maxLoan: 500000000,
    ltv: 65,
    rate: '4% - 5.5%',
    term: '7-15 years',
    regions: ['National'],
    contact: 'Pierre Lefebvre',
    phone: '514-555-0200',
    email: 'lending@ivanhoecambridge.com',
    website: 'ivanhoecambridge.com',
    rating: 4.9
  },
  // Retail Specialists
  {
    id: '3',
    name: 'Scotia Commercial',
    type: 'Bank',
    assetClasses: ['Retail', 'All Commercial'],
    specialty: 'Retail',
    minLoan: 1000000,
    maxLoan: 75000000,
    ltv: 70,
    rate: 'Prime + 1.75%',
    term: '5-10 years',
    regions: ['National'],
    contact: 'Jennifer Lee',
    phone: '1-800-555-0400',
    email: 'commercial@scotiabank.com',
    website: 'scotiabank.com/commercial',
    rating: 4.7
  },
  {
    id: '4',
    name: 'First National Financial',
    type: 'Mortgage Investment',
    assetClasses: ['Retail', 'Multi-Family'],
    specialty: 'Retail',
    minLoan: 500000,
    maxLoan: 50000000,
    ltv: 75,
    rate: '4% - 6%',
    term: '5-25 years',
    regions: ['National'],
    contact: 'Robert Taylor',
    phone: '1-800-555-0500',
    email: 'commercial@firstnational.ca',
    website: 'firstnational.ca',
    rating: 4.8
  },
  // Multi-Family Specialists
  {
    id: '5',
    name: 'CMHC Mortgage Programs',
    type: 'Government',
    assetClasses: ['Multi-Family'],
    specialty: 'Multi-Family',
    minLoan: 500000,
    maxLoan: 25000000,
    ltv: 85,
    rate: '3.5% - 4.5%',
    term: '10-25 years',
    regions: ['National'],
    contact: 'Michael Chen',
    phone: '1-800-555-0200',
    email: 'cmhc@cmhc-schl.gc.ca',
    website: 'cmhc.ca',
    rating: 4.9
  },
  {
    id: '6',
    name: 'Canada Life Commercial',
    type: 'Life Insurance',
    assetClasses: ['Multi-Family', 'Office'],
    specialty: 'Multi-Family',
    minLoan: 5000000,
    maxLoan: 100000000,
    ltv: 75,
    rate: '4% - 5%',
    term: '10-20 years',
    regions: ['National'],
    contact: 'Lisa Anderson',
    phone: '1-800-555-0600',
    email: 'realestate@canadalife.com',
    website: 'canadalife.com',
    rating: 4.7
  },
  // Office Specialists
  {
    id: '7',
    name: 'Manulife Real Estate',
    type: 'Life Insurance',
    assetClasses: ['Office', 'All Commercial'],
    specialty: 'Office',
    minLoan: 10000000,
    maxLoan: 200000000,
    ltv: 70,
    rate: '3.8% - 5%',
    term: '7-15 years',
    regions: ['National'],
    contact: 'David Park',
    phone: '416-555-0700',
    email: 'realestate@manulife.com',
    website: 'manulife.com/realestate',
    rating: 4.8
  },
  {
    id: '8',
    name: 'Sun Life Financial',
    type: 'Life Insurance',
    assetClasses: ['Office', 'Retail'],
    specialty: 'Office',
    minLoan: 5000000,
    maxLoan: 150000000,
    ltv: 70,
    rate: '4% - 5.2%',
    term: '5-15 years',
    regions: ['National'],
    contact: 'Michelle Wong',
    phone: '416-555-0800',
    email: 'realestate@sunlife.com',
    website: 'sunlife.com',
    rating: 4.6
  },
  // Land Specialists
  {
    id: '9',
    name: 'Alden Private Capital',
    type: 'Private Lender',
    assetClasses: ['Land', 'Construction'],
    specialty: 'Land',
    minLoan: 2000000,
    maxLoan: 100000000,
    ltv: 65,
    rate: '8% - 12%',
    term: '1-3 years',
    regions: ['Ontario', 'Quebec'],
    contact: 'David Park',
    phone: '416-555-0300',
    email: 'loans@alden.com',
    website: 'alden.com',
    rating: 4.5
  },
  {
    id: '10',
    name: 'Pennant Capital',
    type: 'Private Lender',
    assetClasses: ['Land', 'Construction'],
    specialty: 'Land',
    minLoan: 1000000,
    maxLoan: 50000000,
    ltv: 60,
    rate: '9% - 14%',
    term: '6-24 months',
    regions: ['Ontario', 'BC'],
    contact: 'James Morrison',
    phone: '416-555-0900',
    email: 'info@pennantcapital.com',
    website: 'pennantcapital.com',
    rating: 4.4
  },
  // Construction Specialists
  {
    id: '11',
    name: 'KingSett Capital',
    type: 'Private Equity',
    assetClasses: ['Construction', 'Mixed-Use'],
    specialty: 'Construction',
    minLoan: 10000000,
    maxLoan: 300000000,
    ltv: 75,
    rate: '6% - 9%',
    term: '2-5 years',
    regions: ['National'],
    contact: 'Jon Love',
    phone: '416-555-1000',
    email: 'info@kingsett.ca',
    website: 'kingsett.ca',
    rating: 4.8
  },
  {
    id: '12',
    name: 'Tricon Capital',
    type: 'Alternative Lender',
    assetClasses: ['Construction', 'Multi-Family'],
    specialty: 'Construction',
    minLoan: 5000000,
    maxLoan: 100000000,
    ltv: 80,
    rate: '5% - 8%',
    term: '2-4 years',
    regions: ['National'],
    contact: 'Gary Berman',
    phone: '416-555-1100',
    email: 'lending@triconcapital.com',
    website: 'triconcapital.com',
    rating: 4.7
  },
  // Hospitality Specialists
  {
    id: '13',
    name: 'Hospitality Funding',
    type: 'Specialty Lender',
    assetClasses: ['Hospitality'],
    specialty: 'Hospitality',
    minLoan: 2000000,
    maxLoan: 50000000,
    ltv: 65,
    rate: '7% - 11%',
    term: '3-10 years',
    regions: ['National'],
    contact: 'Maria Santos',
    phone: '416-555-1200',
    email: 'info@hospitalityfunding.ca',
    website: 'hospitalityfunding.ca',
    rating: 4.6
  },
  // Mixed-Use Specialists
  {
    id: '14',
    name: 'Dream Unlimited',
    type: 'Real Estate Company',
    assetClasses: ['Mixed-Use', 'All Commercial'],
    specialty: 'Mixed-Use',
    minLoan: 10000000,
    maxLoan: 200000000,
    ltv: 75,
    rate: '5% - 7%',
    term: '3-10 years',
    regions: ['Ontario', 'Western Canada'],
    contact: 'Michael Cooper',
    phone: '416-555-1300',
    email: 'lending@dream.ca',
    website: 'dream.ca',
    rating: 4.8
  },
  // General Commercial
  {
    id: '15',
    name: 'BMO Commercial Banking',
    type: 'Bank',
    assetClasses: ['All Commercial'],
    specialty: 'All Commercial',
    minLoan: 1000000,
    maxLoan: 100000000,
    ltv: 75,
    rate: 'Prime + 1.5%',
    term: '5-10 years',
    regions: ['National'],
    contact: 'Andrew Thompson',
    phone: '1-800-555-1400',
    email: 'commercial@bmo.com',
    website: 'bmo.com/commercial',
    rating: 4.7
  },
  {
    id: '16',
    name: 'TD Commercial Banking',
    type: 'Bank',
    assetClasses: ['All Commercial'],
    specialty: 'All Commercial',
    minLoan: 1000000,
    maxLoan: 150000000,
    ltv: 75,
    rate: 'Prime + 1.6%',
    term: '5-10 years',
    regions: ['National'],
    contact: 'Rachel Kim',
    phone: '1-800-555-1500',
    email: 'commercial@td.com',
    website: 'td.com/commercial',
    rating: 4.8
  },
  {
    id: '17',
    name: 'CIBC Commercial',
    type: 'Bank',
    assetClasses: ['All Commercial'],
    specialty: 'All Commercial',
    minLoan: 1000000,
    maxLoan: 100000000,
    ltv: 75,
    rate: 'Prime + 1.65%',
    term: '5-10 years',
    regions: ['National'],
    contact: 'Steven Chen',
    phone: '1-800-555-1600',
    email: 'commercial@cibc.com',
    website: 'cibc.com/business',
    rating: 4.6
  },
  {
    id: '18',
    name: 'Canadian Western Bank',
    type: 'Bank',
    assetClasses: ['All Commercial', 'Land'],
    specialty: 'All Commercial',
    minLoan: 500000,
    maxLoan: 50000000,
    ltv: 70,
    rate: 'Prime + 2%',
    term: '3-10 years',
    regions: ['Western Canada'],
    contact: 'Robert Johnson',
    phone: '1-800-555-1700',
    email: 'commercial@cwb.com',
    website: 'cwb.com',
    rating: 4.5
  }
]

// Generate Quick Links for a lender
const generateQuickLinks = (lender) => {
  const searchName = encodeURIComponent(lender.name)
  const cleanPhone = lender.phone ? lender.phone.replace(/\D/g, '') : ''
  
  return {
    website: `https://${lender.website}`,
    google: `https://www.google.com/search?q=${searchName}+commercial+lender`,
    linkedin: `https://www.linkedin.com/search/results/companies/?keywords=${searchName}`,
    email: `mailto:${lender.email}`,
    phone: cleanPhone ? `tel:${cleanPhone}` : null,
    news: `https://www.google.com/search?q=${searchName}+news&tbm=nws`,
    crexi: `https://www.crexi.com/lenders?search=${searchName}`,
    costar: `https://www.costar.com/property/Search?Query=${searchName}`
  }
}

const LenderMatcher = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAssetClass, setFilterAssetClass] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [loanAmount, setLoanAmount] = useState('')
  const [selectedLender, setSelectedLender] = useState(null)
  const [showQuickLinks, setShowQuickLinks] = useState(false)
  
  // Get unique lender types
  const lenderTypes = [...new Set(lenderDatabase.map(l => l.type))].sort()
  
  // Filter lenders
  const filteredLenders = lenderDatabase.filter(lender => {
    if (searchQuery && !lender.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterAssetClass !== 'all' && !lender.assetClasses.includes(filterAssetClass)) return false
    if (filterType !== 'all' && lender.type !== filterType) return false
    if (loanAmount) {
      const amount = parseInt(loanAmount)
      if (amount < lender.minLoan || amount > lender.maxLoan) return false
    }
    return true
  })
  
  // Group by asset class for display
  const groupedByAssetClass = filteredLenders.reduce((acc, lender) => {
    const primaryClass = lender.specialty
    if (!acc[primaryClass]) acc[primaryClass] = []
    acc[primaryClass].push(lender)
    return acc
  }, {})
  
  const formatCurrency = (value) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`
    return `$${value}`
  }

  const handleQuickConnect = (lender, e) => {
    e.stopPropagation()
    setSelectedLender(lender)
    setShowQuickLinks(true)
  }
  
  const QuickLinksModal = ({ lender, onClose }) => {
    const links = generateQuickLinks(lender)
    
    const linkGroups = [
      { name: 'Website', icon: Globe, url: links.website, color: 'bg-blue-500', show: true },
      { name: 'Phone', icon: Phone, url: links.phone, color: 'bg-green-500', show: !!links.phone },
      { name: 'Email', icon: Mail, url: links.email, color: 'bg-blue-600', show: true },
      { name: 'LinkedIn', icon: Linkedin, url: links.linkedin, color: 'bg-blue-700', show: true },
      { name: 'Google Search', icon: Search, url: links.google, color: 'bg-gray-600', show: true },
      { name: 'News', icon: TrendingUp, url: links.news, color: 'bg-orange-500', show: true },
      { name: 'Crexi', icon: Building2, url: links.crexi, color: 'bg-indigo-600', show: true },
      { name: 'CoStar', url: links.costar, color: 'bg-red-600', show: true },
    ]

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-5 border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">{lender.name}</h3>
                <p className="text-text-secondary">{lender.type} • {lender.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                  <span className="text-sm">{lender.rating}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-sm text-text-secondary">{lender.regions.join(', ')}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-sm font-medium text-text-secondary mb-4">Quick Links - Connect Instantly</p>
            <div className="grid grid-cols-2 gap-3">
              {linkGroups.filter(link => link.show).map((link) => {
                const Icon = link.icon || ExternalLink
                return (
                  <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border-subtle hover:border-accent-blue hover:bg-accent-blue/5 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{link.name}</p>
                      <p className="text-xs text-text-muted">Quick Connect</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-blue" />
                  </a>
                )
              })}
            </div>
            
            {/* Quick Copy */}
            <div className="mt-5 p-4 rounded-lg bg-bg-input">
              <p className="text-sm font-medium text-text-secondary mb-3">Quick Copy</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-bg-primary">
                  <span className="text-sm text-text-secondary">{lender.email}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(lender.email)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-primary">
                  <span className="text-sm text-text-secondary">{lender.phone}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(lender.phone)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-primary">
                  <span className="text-sm text-text-secondary">{lender.contact} (Contact)</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(lender.contact)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Building2 className="w-6 h-6 text-accent-green" />
            Lender Matcher
          </h1>
          <p className="text-text-secondary mt-1">Find financing by asset class for your commercial properties</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      
      {/* Asset Class Filter */}
      <div className="card p-4">
        <p className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Filter by Asset Class
        </p>
        <div className="flex flex-wrap gap-2">
          {ASSET_CLASSES.map(asset => (
            <button
              key={asset.id}
              onClick={() => setFilterAssetClass(asset.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterAssetClass === asset.id 
                  ? `${asset.color} text-white shadow-lg` 
                  : 'bg-bg-input text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {asset.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loan Calculator */}
      <div className="card p-5">
        <h3 className="font-semibold text-text-primary mb-4">Loan Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Loan Amount Needed</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="number"
                placeholder="5000000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-input border border-border-subtle rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Lender Type</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              {lenderTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search lenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-input border border-border-subtle rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-text-muted text-sm">Total Lenders</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{lenderDatabase.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Matching Lenders</p>
          <p className="text-3xl font-bold text-accent-green mt-1">{filteredLenders.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Max LTV Available</p>
          <p className="text-3xl font-bold text-accent-red mt-1">{Math.max(...lenderDatabase.map(l => l.ltv))}%</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm">Avg Rate Range</p>
          <p className="text-lg font-bold text-accent-blue mt-1">3.5% - 14%</p>
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-6">
        {Object.entries(groupedByAssetClass).map(([assetClass, lenders]) => {
          const assetConfig = ASSET_CLASSES.find(a => a.id === assetClass) || ASSET_CLASSES[0]
          return (
            <div key={assetClass} className="card overflow-hidden">
              <div className={`p-4 border-b border-border-subtle flex items-center gap-3`}>
                <div className={`w-3 h-3 rounded-full ${assetConfig.color}`} />
                <h2 className="text-lg font-semibold text-text-primary">{assetClass} Lenders</h2>
                <span className="text-sm text-text-muted">({lenders.length})</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {lenders.map(lender => (
                  <div key={lender.id} className="p-5 hover:bg-bg-input/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-text-primary text-lg">{lender.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <span>{lender.type}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
                                <span>{lender.rating}</span>
                              </div>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-sm font-medium">
                            {lender.ltv}% LTV
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-text-muted">Loan Range</p>
                            <p className="font-medium text-text-primary">{formatCurrency(lender.minLoan)} - {formatCurrency(lender.maxLoan)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Rate</p>
                            <p className="font-medium text-accent-red">{lender.rate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Term</p>
                            <p className="font-medium text-text-primary">{lender.term}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Regions</p>
                            <p className="font-medium text-text-primary">{lender.regions.join(', ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-text-muted">Also lends on:</span>
                          {lender.assetClasses.filter(a => a !== lender.specialty).map((asset, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-bg-input text-text-secondary">
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button 
                          onClick={(e) => handleQuickConnect(lender, e)}
                          className="px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 text-sm font-medium flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Quick Links
                        </button>
                        <a 
                          href={`tel:${lender.phone.replace(/\D/g, '')}`}
                          className="px-4 py-2 rounded-lg bg-bg-input hover:bg-accent-green/20 text-text-secondary hover:text-accent-green text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Empty State */}
      {filteredLenders.length === 0 && (
        <div className="card p-12 text-center">
          <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No lenders found</h3>
          <p className="text-text-secondary">Try adjusting your filters or loan amount</p>
        </div>
      )}

      {/* Quick Links Modal */}
      {showQuickLinks && selectedLender && (
        <QuickLinksModal 
          lender={selectedLender} 
          onClose={() => setShowQuickLinks(false)} 
        />
      )}
    </div>
  )
}

export default LenderMatcher
