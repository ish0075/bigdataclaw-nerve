import React from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Layout from './components/Common/Layout'
import MissionControl from './views/MissionControl'
import PropertyResearch from './views/PropertyResearch'
import DealPipeline from './views/DealPipeline'
import AgentWorkspace from './views/AgentWorkspace'
import HotMoneyRadar from './views/HotMoneyRadar'
import ObsidianVault from './views/ObsidianVault'
import MyListings from './views/MyListings'
import BuyerMatcher from './views/BuyerMatcher'
import AgentMatcher from './views/AgentMatcher'
import LenderMatcher from './views/LenderMatcher'
import BuilderDirectory from './views/BuilderDirectory'
import PropertyUpload from './views/PropertyUpload'
import SkillsAndAgents from './views/SkillsAndAgents'
import MapView from './views/MapView'
import Settings from './views/Settings'
import EXAgentRecruiterUpdated from './views/EXAgentRecruiterUpdated'
import DataManager from './views/DataManager'
import Opportunities from './views/Opportunities'
import GlobalSearch from './components/GlobalSearch'
import { useWebSocket } from './hooks/useWebSocket'

function App() {
  // Initialize WebSocket connection
  const { connected } = useWebSocket()
  const navigate = useNavigate()
  
  const handleSearchResult = (result) => {
    // Navigate to the module with search parameter
    if (result?.display?.route) {
      const searchParam = result.display.route.includes('?') ? '&' : '?'
      navigate(`${result.display.route}${searchParam}search=${encodeURIComponent(result.display.title)}`)
    }
  }
  
  return (
    <Layout 
      connected={connected}
      globalSearch={
        <GlobalSearch 
          onResultClick={handleSearchResult}
          placeholder="Search builders, agents, lenders, properties..."
        />
      }
    >
      <Routes>
        <Route path="/" element={<MissionControl />} />
        <Route path="/research" element={<PropertyResearch />} />
        <Route path="/pipeline" element={<DealPipeline />} />
        <Route path="/agents" element={<AgentWorkspace />} />
        <Route path="/hotmoney" element={<HotMoneyRadar />} />
        <Route path="/vault" element={<ObsidianVault />} />
        <Route path="/listings" element={<MyListings />} />
        <Route path="/buyers" element={<BuyerMatcher />} />
        <Route path="/buyer-matcher" element={<BuyerMatcher />} />
        <Route path="/agents-matcher" element={<AgentMatcher />} />
        <Route path="/lenders" element={<LenderMatcher />} />
        <Route path="/builders" element={<BuilderDirectory />} />
        <Route path="/upload" element={<PropertyUpload />} />
        <Route path="/skills" element={<SkillsAndAgents />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/exp-agent-recruiter" element={<EXAgentRecruiterUpdated />} />
        <Route path="/residential-recruiter" element={<Navigate to="/exp-agent-recruiter" replace />} />
        <Route path="/data-manager" element={<DataManager />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </Layout>
  )
}

export default App
