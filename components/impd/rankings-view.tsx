"use client"

import { useState, useMemo } from "react"
import { type Cidade, fmtN } from "@/lib/impu-data"

interface RankingsViewProps {
  cidades: Cidade[]
  onOpenCity: (nome: string) => void
}

type RankType = "pop-maior" | "pop-menor" | "impu-maior" | "impu-menor" | "turisticos" | "sem-pd"

function BadgeClassif({ classif }: { classif: string }) {
  if (classif === "Estruturado") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 whitespace-nowrap">🟢 Estruturado</span>
  }
  if (classif === "Em Desenvolvimento") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 whitespace-nowrap">🟡 Em Desenvolvimento</span>
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 whitespace-nowrap">🔴 Crítico</span>
}

export function RankingsView({ cidades, onOpenCity }: RankingsViewProps) {
  const [rankType, setRankType] = useState<RankType>("pop-maior")
  
  const { lista, valFn, maxVal } = useMemo(() => {
    let lista: Cidade[] = []
    let valFn = (c: Cidade) => fmtN(c.pop) + " hab."
    
    switch (rankType) {
      case "pop-maior":
        lista = [...cidades].sort((a, b) => (b.pop || 0) - (a.pop || 0))
        valFn = c => fmtN(c.pop) + " hab."
        break
      case "pop-menor":
        lista = [...cidades].sort((a, b) => (a.pop || 0) - (b.pop || 0))
        valFn = c => fmtN(c.pop) + " hab."
        break
      case "impu-maior":
        lista = [...cidades].sort((a, b) => b.impu.total - a.impu.total)
        valFn = c => c.impu.total + "/60"
        break
      case "impu-menor":
        lista = [...cidades].sort((a, b) => a.impu.total - b.impu.total)
        valFn = c => c.impu.total + "/60"
        break
      case "turisticos":
        lista = cidades.filter(c => c.turismo).sort((a, b) => (b.pop || 0) - (a.pop || 0))
        valFn = c => fmtN(c.pop) + " hab."
        break
      case "sem-pd":
        lista = cidades.filter(c => c.obrigadoPD && !c.pd).sort((a, b) => (b.pop || 0) - (a.pop || 0))
        valFn = () => "⚠️ Obrigado sem PD"
        break
    }
    
    const maxVal = Math.max(...lista.map(c => {
      if (rankType.includes("pop")) return c.pop || 0
      if (rankType.includes("impu")) return c.impu.total
      return c.pop || 0
    })) || 1
    
    return { lista, valFn, maxVal }
  }, [cidades, rankType])
  
  const medals = ["🥇", "🥈", "🥉"]
  const displayList = rankType === "sem-pd" || rankType === "turisticos" ? lista : lista.slice(0, 20)
  
  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-6 py-9 pb-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            Rankings
          </h1>
          <p className="text-sm text-primary-foreground/70">
            Classificações automáticas dos {cidades.length} municípios de Mato Grosso
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap gap-1.5 mb-6">
          <RankTab active={rankType === "pop-maior"} onClick={() => setRankType("pop-maior")}>👥 Mais populosos</RankTab>
          <RankTab active={rankType === "pop-menor"} onClick={() => setRankType("pop-menor")}>🔹 Menos populosos</RankTab>
          <RankTab active={rankType === "impu-maior"} onClick={() => setRankType("impu-maior")}>🏆 Maior IMPU</RankTab>
          <RankTab active={rankType === "impu-menor"} onClick={() => setRankType("impu-menor")}>⚠️ Menor IMPU</RankTab>
          <RankTab active={rankType === "turisticos"} onClick={() => setRankType("turisticos")}>🌿 Turísticos</RankTab>
          <RankTab active={rankType === "sem-pd"} onClick={() => setRankType("sem-pd")}>📋 Obrigados sem PD</RankTab>
        </div>
        
        {/* Ranking List */}
        <div className="flex flex-col gap-1.5">
          {displayList.map((c, i) => {
            const rawVal = rankType.includes("impu") ? c.impu.total : (c.pop || 0)
            const pct = (rawVal / maxVal * 100).toFixed(0)
            const posClass = i < 3 ? ["text-amber-600", "text-gray-500", "text-amber-700"][i] : "text-muted-foreground"
            
            return (
              <div
                key={c.nome}
                onClick={() => onOpenCity(c.nome)}
                className="flex items-center gap-3 bg-card border rounded px-4 py-3 cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors"
              >
                <span className={`font-mono text-sm font-semibold min-w-[28px] text-center ${posClass}`}>
                  {i < 3 ? medals[i] : i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{c.nome}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    {c.macro || "—"} · <BadgeClassif classif={c.impu.classif} />
                  </div>
                </div>
                <div className="hidden sm:block w-32">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="font-mono font-semibold text-sm text-primary whitespace-nowrap">
                  {valFn(c)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RankTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
        active 
          ? "bg-primary border-primary text-primary-foreground font-semibold" 
          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  )
}
