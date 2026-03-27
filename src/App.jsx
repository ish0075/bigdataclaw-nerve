import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Common/Layout'
import MissionControl from './views/MissionControl'
import PropertyResearch from './views/PropertyResearch'
import DealPipeline from './views/DealPipeline'
import AgentWorkspace from './views/AgentWorkspace'
import HotMoneyRadar from './views/HotMoneyRadar'
import ObsidianVault from './views/ObsidianVault'
import Settings from './views/Settings'
import { useWebSocket } from './hooks/useWebSocket'

function App() {
  // Initialize WebSocket connection
  const { connected } = useWebSocket()
  
  return (
    <Layout connected={connected}>
      <Routes>
        <Route path="/" element={<MissionControl />} />
        <Route path="/research" element={<PropertyResearch />} />
        <Route path="/pipeline" element={<DealPipeline />} />
        <Route path="/agents" element={<AgentWorkspace />} />
        <Route path="/hotmoney" element={<HotMoneyRadar />} />
        <Route path="/vault" element={<ObsidianVault />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
