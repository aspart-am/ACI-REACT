import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Ces routes seront implémentées ultérieurement */}
          {/* <Route path="/indicators" element={<Indicators />} /> */}
          {/* <Route path="/indicators/:id" element={<IndicatorDetail />} /> */}
          {/* <Route path="/associates" element={<Associates />} /> */}
          {/* <Route path="/associates/:id" element={<AssociateDetail />} /> */}
          {/* <Route path="/missions" element={<Missions />} /> */}
          {/* <Route path="/missions/:id" element={<MissionDetail />} /> */}
        </Routes>
      </Layout>
    </div>
  )
}

export default App
