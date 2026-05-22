"use client"

import { useMemo } from "react"
import { type Cidade, fmtN } from "@/lib/impu-data"

type ViewType = "inicio" | "municipios" | "impu" | "rankings" | "dashboard" | "sobre"

interface HeroSectionProps {
  cidades: Cidade[]
  onViewChange: (view: ViewType) => void
}

export function HeroSection({ cidades, onViewChange }: HeroSectionProps) {
  const stats = useMemo(() => {
    const total = cidades.length
    const comPD = cidades.filter(c => c.pd).length
    const comLUSO = cidades.filter(c => c.luso).length
    const estru = cidades.filter(c => c.impu.classif === "Estruturado").length
    return { total, comPD, comLUSO, estru }
  }, [cidades])
  
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 py-16 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="inline-block bg-white/15 border border-white/30 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase mb-4">
          1º Ciclo de Monitoramento · 2026
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Planejamento Urbano<br />em Mato Grosso
        </h1>
        
        <p className="text-base text-primary-foreground/80 max-w-xl mb-7 leading-relaxed">
          Inventário completo dos Planos Diretores e Leis de Uso e Ocupação do Solo dos 142 municípios mato-grossenses, com índice IMPU de maturidade do planejamento territorial.
        </p>
        
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => onViewChange("municipios")}
            className="bg-white text-primary px-6 py-2.5 rounded font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Consultar Municípios
          </button>
          <button
            onClick={() => onViewChange("impu")}
            className="bg-transparent border border-white/45 text-white px-6 py-2.5 rounded font-medium text-sm hover:bg-white/10 transition-colors"
          >
            Entender o IMPU
          </button>
        </div>
        
        <div className="flex flex-wrap border-t border-white/20 pt-7 gap-0">
          <Stat value={fmtN(stats.total)} label="Municípios" />
          <Stat value={fmtN(stats.comPD)} label="Com Plano Diretor" />
          <Stat value={fmtN(stats.comLUSO)} label="Com Lei de Uso do Solo" />
          <Stat value={fmtN(stats.estru)} label="IMPU Estruturado" />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col pr-8 mr-8 border-r border-white/20 last:border-r-0 last:mr-0 last:pr-0">
      <span className="font-mono text-3xl font-medium text-white leading-none">{value}</span>
      <span className="text-xs text-white/70 mt-1">{label}</span>
    </div>
  )
}
