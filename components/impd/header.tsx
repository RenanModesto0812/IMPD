"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewType = "inicio" | "municipios" | "impu" | "rankings" | "dashboard" | "sobre"

interface HeaderProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems: { view: ViewType; label: string }[] = [
  { view: "inicio", label: "Início" },
  { view: "municipios", label: "Municípios" },
  { view: "impu", label: "IMPU" },
  { view: "rankings", label: "Rankings" },
  { view: "dashboard", label: "Dashboard" },
  { view: "sobre", label: "Sobre" },
]

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleViewChange = (view: ViewType) => {
    onViewChange(view)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <header className="fixed top-[30px] left-0 right-0 z-40 bg-card border-b-[3px] border-primary shadow-sm">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="font-mono text-xl font-medium text-primary bg-primary/10 px-3 py-1.5 rounded">
            IMPD
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-foreground leading-tight">
              Inventário de Planos Diretores
            </div>
            <div className="text-[0.68rem] text-muted-foreground">
              e Leis de Uso e Ocupação do Solo · Mato Grosso · v19/05/2026
            </div>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-0.5 ml-auto">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`px-3.5 py-1.5 text-sm font-medium border-b-[3px] -mb-[3px] transition-colors whitespace-nowrap ${
                currentView === view
                  ? "text-primary border-primary font-semibold"
                  : "text-muted-foreground border-transparent hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-card px-6 py-4 flex flex-col gap-1">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`px-4 py-2 text-sm font-medium rounded-md text-left transition-colors ${
                currentView === view
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
