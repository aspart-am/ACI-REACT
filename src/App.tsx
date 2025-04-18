import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Indicators from './pages/Indicators'
import Associates from './pages/Associates'
import Missions from './pages/Missions'
import Layout from './components/Layout'
import IndicatorDetail from './pages/IndicatorDetail'
import AssociateDetail from './pages/AssociateDetail'
import MissionDetail from './pages/MissionDetail'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/indicators" element={<Indicators />} />
          <Route path="/indicators/:id" element={<IndicatorDetail />} />
          <Route path="/associates" element={<Associates />} />
          <Route path="/associates/:id" element={<AssociateDetail />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:id" element={<MissionDetail />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
