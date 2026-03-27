import React, { useState } from 'react'
import { Database, Plus, Search, FolderOpen, RefreshCw, Settings as SettingsIcon } from 'lucide-react'
import VaultBrowser from '../components/Obsidian/VaultBrowser'
import NotePreview from '../components/Obsidian/NotePreview'
import SyncStatus from '../components/Obsidian/SyncStatus'

const ObsidianVault = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock graph data for visualization
  const graphStats = {
    totalNotes: 1247,
    totalLinks: 3420,
    orphanNotes: 23,
    lastModified: '2 minutes ago',
  }
  
  const recentNotes = [
    { name: 'Seaway Mall Block.md', date: '1 hour ago', tags: ['deal', 'retail'] },
    { name: 'Hot Money Q1 2025.md', date: '3 hours ago', tags: ['analysis', 'hot-money'] },
    { name: 'Dream Industrial Profile.md', date: '1 day ago', tags: ['buyer', 'industrial'] },
    { name: 'Niagara Market Update.md', date: '2 days ago', tags: ['market', 'research'] },
  ]
  
  return (
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
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync
          </button>
          <button className="btn-primary flex items-center gap-2">
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
            {graphStats.lastModified}
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
          />
        </div>
        
        {/* Center: Note Preview */}
        <div className="lg:col-span-1">
          <NotePreview 
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onExport={(file) => console.log('Export:', file.name)}
          />
        </div>
        
        {/* Right: Sync Status & Recent */}
        <div className="lg:col-span-1 space-y-6">
          <SyncStatus />
          
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
                  onClick={() => setSelectedFile({ name: note.name, modified: note.date })}
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
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left">
                <FolderOpen className="w-5 h-5 text-accent-blue" />
                <div>
                  <p className="text-sm text-text-primary">Open in Obsidian</p>
                  <p className="text-xs text-text-muted">Launch desktop app</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left">
                <Search className="w-5 h-5 text-accent-green" />
                <div>
                  <p className="text-sm text-text-primary">Global Search</p>
                  <p className="text-xs text-text-muted">Search all notes</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-input hover:bg-bg-card transition-colors text-left">
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
  )
}

export default ObsidianVault
