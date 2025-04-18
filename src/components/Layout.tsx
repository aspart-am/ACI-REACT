import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ACI React App</h1>
          <div className="flex items-center space-x-2">
            <a 
              href="https://github.com/aspart-am/ACI-REACT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <nav className="w-64 bg-card border-r border-border">
          <ul className="py-4">
            <li>
              <Link 
                to="/" 
                className={`block px-4 py-2 ${isActive('/')}`}
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link 
                to="/indicators" 
                className={`block px-4 py-2 ${isActive('/indicators')}`}
              >
                Indicateurs
              </Link>
            </li>
            <li>
              <Link 
                to="/associates" 
                className={`block px-4 py-2 ${isActive('/associates')}`}
              >
                Professionnels
              </Link>
            </li>
            <li>
              <Link 
                to="/missions" 
                className={`block px-4 py-2 ${isActive('/missions')}`}
              >
                Missions
              </Link>
            </li>
          </ul>
        </nav>
        
        <main className="flex-1 p-6 bg-background">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <footer className="bg-muted p-4 text-center text-muted-foreground">
        <p>© 2025 ACI React App - Gestion des Accords Conventionnels Interprofessionnels</p>
      </footer>
    </div>
  )
}

export default Layout
