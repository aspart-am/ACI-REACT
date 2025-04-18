import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalIndicators: number
  totalAssociates: number
  totalMissions: number
  completedMissions: number
  inProgressMissions: number
  notStartedMissions: number
  totalCompensation: number
}

interface Indicator {
  id: number
  code: string
  name: string
  type: 'core' | 'optional'
  maxCompensation: number
}

interface Associate {
  id: number
  firstName: string
  lastName: string
  profession: string
}

interface Mission {
  id: number
  associateId: number
  indicatorId: number
  status: 'validated' | 'in_progress' | 'not_validated'
  compensation: number
}

interface DashboardData {
  stats: DashboardStats
  indicators: Indicator[]
  associates: Associate[]
  missions: Mission[]
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    // Simuler un chargement de données depuis l'API
    const fetchData = async () => {
      try {
        setLoading(true)
        // Dans une application réelle, ce serait un appel API
        // const response = await fetch('/api/dashboard')
        // const data = await response.json()
        
        // Pour l'instant, utilisons des données simulées
        const mockData: DashboardData = {
          stats: {
            totalIndicators: 12,
            totalAssociates: 8,
            totalMissions: 24,
            completedMissions: 10,
            inProgressMissions: 12,
            notStartedMissions: 2,
            totalCompensation: 15000
          },
          indicators: [
            { id: 1, code: 'S01', name: 'Accès aux soins', type: 'core', maxCompensation: 2000 },
            { id: 2, code: 'S02', name: 'Travail en équipe', type: 'core', maxCompensation: 1500 },
            { id: 3, code: 'O01', name: 'Système d\'information', type: 'optional', maxCompensation: 1000 }
          ],
          associates: [
            { id: 1, firstName: 'Jean', lastName: 'Dupont', profession: 'doctor' },
            { id: 2, firstName: 'Marie', lastName: 'Martin', profession: 'nurse' }
          ],
          missions: [
            { id: 1, associateId: 1, indicatorId: 1, status: 'validated', compensation: 2000 },
            { id: 2, associateId: 1, indicatorId: 2, status: 'in_progress', compensation: 0 },
            { id: 3, associateId: 2, indicatorId: 1, status: 'in_progress', compensation: 0 }
          ]
        }
        
        setData(mockData)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-muted p-4 rounded-md">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  const { stats, indicators, associates, missions } = data

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord ACI</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium">Indicateurs</h3>
          <p className="text-3xl font-bold">{stats.totalIndicators}</p>
          <Link to="/indicators" className="text-sm text-primary hover:underline">
            Voir tous les indicateurs
          </Link>
        </div>
        
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium">Professionnels</h3>
          <p className="text-3xl font-bold">{stats.totalAssociates}</p>
          <Link to="/associates" className="text-sm text-primary hover:underline">
            Voir tous les professionnels
          </Link>
        </div>
        
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium">Missions</h3>
          <p className="text-3xl font-bold">{stats.totalMissions}</p>
          <div className="text-sm">
            <span className="text-green-500">{stats.completedMissions} terminées</span> • 
            <span className="text-yellow-500 ml-1">{stats.inProgressMissions} en cours</span> • 
            <span className="text-red-500 ml-1">{stats.notStartedMissions} non démarrées</span>
          </div>
        </div>
        
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium">Rémunération totale</h3>
          <p className="text-3xl font-bold">{stats.totalCompensation} €</p>
          <p className="text-sm text-muted-foreground">
            Basée sur les indicateurs validés
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Indicateurs récents</h2>
            <Link to="/indicators" className="text-sm text-primary hover:underline">
              Voir tous
            </Link>
          </div>
          
          <div className="divide-y divide-border">
            {indicators.slice(0, 3).map(indicator => (
              <div key={indicator.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full mr-2 bg-primary/10">
                      {indicator.code}
                    </span>
                    <span className="font-medium">{indicator.name}</span>
                  </div>
                  <span className="text-sm">
                    {indicator.type === 'core' ? 'Socle' : 'Optionnel'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Rémunération max: {indicator.maxCompensation} €
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Professionnels récents</h2>
            <Link to="/associates" className="text-sm text-primary hover:underline">
              Voir tous
            </Link>
          </div>
          
          <div className="divide-y divide-border">
            {associates.slice(0, 3).map(associate => (
              <div key={associate.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">
                      {associate.firstName} {associate.lastName}
                    </span>
                  </div>
                  <span className="text-sm capitalize">
                    {associate.profession === 'doctor' ? 'Médecin' : 
                     associate.profession === 'nurse' ? 'Infirmier(e)' : 
                     associate.profession === 'pharmacist' ? 'Pharmacien' : 
                     associate.profession === 'physiotherapist' ? 'Kinésithérapeute' : 
                     'Autre'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {missions.filter(m => m.associateId === associate.id).length} missions assignées
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ressources</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="/attached_assets/guide-indicateurs-aci-remuneration-structures-pluripro-1.pdf" 
            target="_blank"
            className="p-4 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <h3 className="font-medium">Guide des indicateurs ACI</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Guide complet sur les indicateurs et la rémunération des structures pluriprofessionnelles
            </p>
          </a>
          
          <a 
            href="/attached_assets/calculette-aci-v6.xlsx" 
            className="p-4 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <h3 className="font-medium">Calculette ACI</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Outil Excel pour calculer les montants ACI
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
