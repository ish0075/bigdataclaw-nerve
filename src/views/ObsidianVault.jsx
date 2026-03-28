import React, { useState, useEffect } from 'react'
import { 
  Database, Plus, Search, FolderOpen, RefreshCw, Settings as SettingsIcon, 
  X, Check, FileText, ExternalLink, Trash2, Download, Edit3 
} from 'lucide-react'
import VaultBrowser from '../components/Obsidian/VaultBrowser'
import NotePreview from '../components/Obsidian/NotePreview'
import SyncStatus from '../components/Obsidian/SyncStatus'

const ObsidianVault = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('2 minutes ago')
  
  // Vault stats with live updates
  const [graphStats, setGraphStats] = useState({
    totalNotes: 1247,
    totalLinks: 3420,
    orphanNotes: 23,
    lastModified: '2 minutes ago',
  })
  
  const recentNotes = [
    { name: 'Seaway Mall Block.md', date: '1 hour ago', tags: ['deal', 'retail'] },
    { name: 'Hot Money Q1 2025.md', date: '3 hours ago', tags: ['analysis', 'hot-money'] },
    { name: 'Dream Industrial Profile.md', date: '1 day ago', tags: ['buyer', 'industrial'] },
    { name: 'Niagara Market Update.md', date: '2 days ago', tags: ['market', 'research'] },
  ]
  
  // Handle sync
  const handleSync = async () => {
    setSyncing(true)
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSyncing(false)
    setLastSync('Just now')
    // Update stats randomly
    setGraphStats(prev => ({
      ...prev,
      totalNotes: prev.totalNotes + Math.floor(Math.random() * 3),
      lastModified: 'Just now'
    }))
  }
  
  // Handle new note
  const handleNewNote = (noteData) => {
    // In a real app, this would create a file
    console.log('Creating new note:', noteData)
    setShowNewNoteModal(false)
    setGraphStats(prev => ({
      ...prev,
      totalNotes: prev.totalNotes + 1,
      lastModified: 'Just now'
    }))
  }
  
  // Handle opening Obsidian
  const handleOpenObsidian = () => {
    // Try to open Obsidian URI
    window.open('obsidian://open?vault=BigDataClaw', '_blank')
  }
  
  // Handle global search
  const handleGlobalSearch = () => {
    const query = prompt('Search all notes:')
    if (query) {
      setSearchQuery(query)
      // In a real app, this would search the vault
      console.log('Searching for:', query)
    }
  }
  
  return (
    <>
      {/* New Note Modal */}
      {showNewNoteModal && (
        <NewNoteModal 
          onClose={() => setShowNewNoteModal(false)}
          onSave={handleNewNote}
        />
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          onClose={() => setShowSettingsModal(false)}
        />
      )}
      
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Database className="w-6 h-6 text-accent-blue" />
              Obsidian Vault
            </h1>
            <p className="text-text-secondary mt-1">
              Browse, search, and sync your research notes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync'}
            </button>
            <button 
              onClick={() => setShowNewNoteModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="text-text-muted text-sm">Total Notes</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
              {graphStats.totalNotes.toLocaleString()}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-text-muted text-sm">Total Links</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
              {graphStats.totalLinks.toLocaleString()}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-text-muted text-sm">Orphan Notes</p>
            <p className="text-3xl font-bold text-accent-yellow mt-1">
              {graphStats.orphanNotes}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-text-muted text-sm">Last Modified</p>
            <p className="text-lg font-bold text-text-primary mt-1">
              {lastSync}
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Vault Browser */}
          <div className="lg:col-span-1">
            <VaultBrowser 
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          {/* Center: Note Preview */}
          <div className="lg:col-span-1">
            <NotePreview 
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onExport={(file) => {
                // Download the note as markdown
                const content = `# ${file.name}\n\nExported from BigDataClaw NERVE\n`
                const blob = new Blob([content], { type: 'text/markdown' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = file.name
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
            />
          </div>
          
          {/* Right: Sync Status & Recent */}
          <div className="lg:col-span-1 space-y-6">
            <SyncStatus onSync={handleSync} syncing={syncing} />
            
            {/* Recent Notes */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Recent Notes</h3>
                <button className="text-sm text-accent-red hover:underline">
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {recentNotes.map((note, i) => (
                  <div 
                    key={i}
                    onClick={() => setSelectedFile({ 
                      id: note.name, 
                      name: note.name, 
                      modified: note.date,
                      size: '12.4 KB'
                    })}
                    className="p-3 rounded-lg bg-bg-input hover:bg-bg-card cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary font-medium">{note.name}</span>
                      <span className="text-xs text-text-muted">{note.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {note.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 rounded bg-accent-red/10 text-accent-red text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleOpenObsidian}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left"
                >
                  <FolderOpen className="w-5 h-5 text-accent-blue" />
                  <div>
                    <p className="text-sm text-text-primary">Open in Obsidian</p>
                    <p className="text-xs text-text-muted">Launch desktop app</p>
                  </div>
                </button>
                <button 
                  onClick={handleGlobalSearch}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left"
                >
                  <Search className="w-5 h-5 text-accent-green" />
                  <div>
                    <p className="text-sm text-text-primary">Global Search</p>
                    <p className="text-xs text-text-muted">Search all notes</p>
                  </div>
                </button>
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left"
                >
                  <SettingsIcon className="w-5 h-5 text-accent-yellow" />
                  <div>
                    <p className="text-sm text-text-primary">Vault Settings</p>
                    <p className="text-xs text-text-muted">Configure sync</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const NewNoteModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    folder: 'Research',
    content: '',
    tags: ''
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent-red" />
            Create New Note
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Note Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Welland Industrial Analysis"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-2">Folder</label>
            <select 
              value={formData.folder}
              onChange={(e) => setFormData({...formData, folder: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            >
              <option value="Research">Research</option>
              <option value="Deals">Deals</option>
              <option value="Buyers">Buyers</option>
              <option value="Templates">Templates</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-2">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., deal, industrial, welland"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-2">Content</label>
            <textarea
              rows={6}
              placeholder="# Note content..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2 font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SettingsModal = ({ onClose }) => {
  const [settings, setSettings] = useState({
    vaultPath: '~/Documents/BDAIV2',
    autoSync: true,
    syncInterval: 5,
    notifications: true,
    backupEnabled: true
  })
  
  const handleSave = () => {
    // Save settings
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h3 className="font-semibold flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-accent-red" />
            Vault Settings
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-input rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Vault Path</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.vaultPath}
                onChange={(e) => setSettings({...settings, vaultPath: e.target.value})}
                className="flex-1 bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
              />
              <button className="p-2 rounded-lg bg-bg-input hover:bg-bg-card transition-colors">
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm">Auto-sync</span>
              <input 
                type="checkbox" 
                checked={settings.autoSync}
                onChange={(e) => setSettings({...settings, autoSync: e.target.checked})}
                className="w-4 h-4 rounded border-border-subtle bg-bg-input"
              />
            </label>
          </div>
          
          {settings.autoSync && (
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Sync Interval (minutes)
              </label>
              <input 
                type="number" 
                min="1" 
                max="60"
                value={settings.syncInterval}
                onChange={(e) => setSettings({...settings, syncInterval: parseInt(e.target.value)})}
                className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2"
              />
            </div>
          )}
          
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm">Enable notifications</span>
              <input 
                type="checkbox" 
                checked={settings.notifications}
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                className="w-4 h-4 rounded border-border-subtle bg-bg-input"
              />
            </label>
          </div>
          
          <div>
            <label className="flex items-center justify-between py-2">
              <span className="text-sm">Enable backups</span>
              <input 
                type="checkbox" 
                checked={settings.backupEnabled}
                onChange={(e) => setSettings({...settings, backupEnabled: e.target.checked})}
                className="w-4 h-4 rounded border-border-subtle bg-bg-input"
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border-subtle">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default ObsidianVault
