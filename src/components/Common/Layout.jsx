import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const Layout = ({ children, connected }) => {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar connected={connected} />
        
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
