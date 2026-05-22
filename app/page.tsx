"use client"

import { useState, useMemo } from "react"
import { GovBar } from "@/components/impd/gov-bar"
import { Header } from "@/components/impd/header"
import { HeroSection } from "@/components/impd/hero-section"
import { ClassificationSection } from "@/components/impd/classification-section"
import { MacroregionTable } from "@/components/impd/macroregion-table"
import { MunicipiosView } from "@/components/impd/municipios-view"
import { IMPUView } from "@/components/impd/impu-view"
import { RankingsView } from "@/components/impd/rankings-view"
import { DashboardView } from "@/components/impd/dashboard-view"
import { SobreView } from "@/components/impd/sobre-view"
import { CityModal } from "@/components/impd/city-modal"
import { getCidades, type Cidade } from "@/lib/impu-data"

type ViewType = "inicio" | "municipios" | "impu" | "rankings" | "dashboard" | "sobre"

export default function IMPDPage() {
  const [currentView, setCurrentView] = useState<ViewType>("inicio")
  const [selectedCity, setSelectedCity] = useState<Cidade | null>(null)
  
  const cidades = useMemo(() => getCidades(), [])
  
  const handleOpenCityModal = (nome: string) => {
    const cidade = cidades.find(c => c.nome === nome)
    if (cidade) {
      setSelectedCity(cidade)
    }
  }
  
  const handleCloseCityModal = () => {
    setSelectedCity(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <GovBar />
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="pt-[94px]">
        {/* View: Início */}
        {currentView === "inicio" && (
          <div>
            <HeroSection cidades={cidades} onViewChange={setCurrentView} />
            <ClassificationSection cidades={cidades} />
            <MacroregionTable cidades={cidades} />
          </div>
        )}
        
        {/* View: Municípios */}
        {currentView === "municipios" && (
          <MunicipiosView cidades={cidades} onOpenCity={handleOpenCityModal} />
        )}
        
        {/* View: IMPU */}
        {currentView === "impu" && (
          <IMPUView cidades={cidades} onOpenCity={handleOpenCityModal} />
        )}
        
        {/* View: Rankings */}
        {currentView === "rankings" && (
          <RankingsView cidades={cidades} onOpenCity={handleOpenCityModal} />
        )}
        
        {/* View: Dashboard */}
        {currentView === "dashboard" && (
          <DashboardView cidades={cidades} />
        )}
        
        {/* View: Sobre */}
        {currentView === "sobre" && (
          <SobreView />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            IMPD-MT · Inventário de Planejamento Urbano de Mato Grosso
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dados coletados até 19/05/2026 · Fonte: IMEA · IBGE Censo 2022 · leismunicipais.com.br
          </p>
        </div>
      </footer>
      
      {/* City Modal */}
      {selectedCity && (
        <CityModal cidade={selectedCity} onClose={handleCloseCityModal} />
      )}
    </div>
  )
}
