import React from 'react'
import EXAgentRecruiterEnhanced from './EXAgentRecruiterEnhanced'

/**
 * Brokerages View - Dedicated page for brokerage listings
 * This wraps EXAgentRecruiterEnhanced with viewMode preset to 'brokerages'
 */
const BrokeragesView = () => {
  // Force the viewMode to 'brokerages' by passing a prop
  // The EXAgentRecruiterEnhanced component will need to accept this prop
  return <EXAgentRecruiterEnhanced initialViewMode="brokerages" />
}

export default BrokeragesView
