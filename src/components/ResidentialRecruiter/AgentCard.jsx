import React from 'react'
import { 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Linkedin, 
  ExternalLink,
  MessageCircle,
  Building2,
  MapPin,
  MoreHorizontal
} from 'lucide-react'
import { useResidentialAgentStore } from '../../stores/residentialAgentStore'

const STATUS_CONFIG = {
  new: { 
    color: 'border-gray-500', 
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    label: 'New'
  },
  contacted: { 
    color: 'border-yellow-500', 
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    label: 'Contacted'
  },
  added: { 
    color: 'border-blue-500', 
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    label: 'Added'
  },
  friend: { 
    color: 'border-green-500', 
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    label: 'Friend',
    pulse: true
  },
  declined: { 
    color: 'border-red-500', 
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    label: 'Declined'
  }
}

const AgentCard = ({ agent, onClick }) => {
  const { updateStatus } = useResidentialAgentStore()
  const statusConfig = STATUS_CONFIG[agent.status] || STATUS_CONFIG.new
  
  const initials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  const handleActionClick = (e, action) => {
    e.stopPropagation()
    action()
  }
  
  const getRealtorCaUrl = () => {
    if (agent.realtorCaUrl) return agent.realtorCaUrl
    const searchQuery = encodeURIComponent(`${agent.name} ${agent.brokerage}`)
    return `https://www.realtor.ca/agent/#name=${searchQuery}`
  }
  
  return (
    <div 
      onClick={onClick}
      className={`
        card p-4 cursor-pointer transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
        border-l-4 ${statusConfig.color}
        ${agent.status === 'declined' ? 'opacity-60' : ''}
      `}
    >
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
          ${statusConfig.bg} ${statusConfig.text}
          ${statusConfig.pulse ? 'animate-pulse' : ''}
        `}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-text-primary truncate ${agent.status === 'declined' ? 'line-through' : ''}`}>
            {agent.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{agent.brokerage}</span>
          </div>
        </div>
      </div>
      
      {/* Location & Specialties */}
      <div className="space-y-1 mb-3">
        {agent.city && (
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <MapPin className="w-3 h-3" />
            {agent.city}
          </div>
        )}
        {agent.specialties && agent.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.specialties.slice(0, 2).map((spec, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-bg-input text-text-secondary">
                {spec}
              </span>
            ))}
            {agent.specialties.length > 2 && (
              <span className="text-xs px-2 py-0.5 text-text-muted">
                +{agent.specialties.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Quick Action Icons */}
      <div className="flex items-center gap-1 mb-3">
        {agent.email && (
          <a 
            href={`mailto:${agent.email}`}
            onClick={(e) => handleActionClick(e, () => {})}
            className="p-2 rounded-lg bg-bg-input hover:bg-accent-blue/20 text-text-secondary hover:text-accent-blue transition-colors"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {agent.phone && (
          <a 
            href={`tel:${agent.phone}`}
            onClick={(e) => handleActionClick(e, () => {})}
            className="p-2 rounded-lg bg-bg-input hover:bg-accent-green/20 text-text-secondary hover:text-accent-green transition-colors"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {agent.facebook && (
          <a 
            href={agent.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleActionClick(e, () => {})}
            className="p-2 rounded-lg bg-bg-input hover:bg-blue-500/20 text-text-secondary hover:text-blue-400 transition-colors"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
        )}
        {agent.instagram && (
          <a 
            href={`https://instagram.com/${agent.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleActionClick(e, () => {})}
            className="p-2 rounded-lg bg-bg-input hover:bg-pink-500/20 text-text-secondary hover:text-pink-400 transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
        <a 
          href={getRealtorCaUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleActionClick(e, () => {})}
          className="p-2 rounded-lg bg-bg-input hover:bg-accent-red/20 text-text-secondary hover:text-accent-red transition-colors"
          title="View on Realtor.ca"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      {/* Footer with Status */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
        <select
          value={agent.status}
          onChange={(e) => handleActionClick(e, () => updateStatus(agent.id, e.target.value))}
          className={`
            text-xs px-2 py-1 rounded border bg-bg-input
            ${statusConfig.text} border-current
            cursor-pointer hover:opacity-80
          `}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="added">Added</option>
          <option value="friend">Friend</option>
          <option value="declined">Declined</option>
        </select>
        
        {agent.notes.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <MessageCircle className="w-3 h-3" />
            {agent.notes.length}
          </div>
        )}
        
        {agent.lastContacted && (
          <div className="text-xs text-text-muted">
            {new Date(agent.lastContacted).toLocaleDateString('en-CA', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentCard
