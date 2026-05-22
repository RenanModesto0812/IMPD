"use client"

import { useState, useMemo } from "react"
import { type Cidade } from "@/lib/impu-data"

interface IMPUViewProps {
  cidades: Cidade[]
  onOpenCity: (nome: string) => void
}

function BadgeClassif({ classif }: { classif: string }) {
  if (classif === "Estruturado") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 whitespace-nowrap">🟢 Estruturado</span>
  }
  if (classif === "Em Desenvolvimento") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 whitespace-nowrap">🟡 Em Desenvolvimento</span>
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 whitespace-nowrap">🔴 Crítico</span>
}

export function IMPUView({ cidades, onOpenCity }: IMPUViewProps) {
  const [filtClassif, setFiltClassif] = useState("")
  
  const filtered = useMemo(() => {
    const lista = filtClassif 
      ? cidades.filter(c => c.impu.classif === filtClassif)
      : cidades
    return [...lista].sort((a, b) => b.impu.total - a.impu.total)
  }, [cidades, filtClassif])
  
  const counts = useMemo(() => ({
    all: cidades.length,
    critico: cidades.filter(c => c.impu.classif === "Crítico").length,
    desenv: cidades.filter(c => c.impu.classif === "Em Desenvolvimento").length,
    estru: cidades.filter(c => c.impu.classif === "Estruturado").length,
  }), [cidades])
  
  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-6 py-9 pb-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            IMPU — Índice de Maturidade do Planejamento Urbano
          </h1>
          <p className="text-sm text-primary-foreground/70">
            Metodologia de avaliação do 1º Ciclo · Fonte: IMEA 2026
          </p>
        </div>
      </div>
      
      {/* Methodology */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="bg-primary/10 border-l-4 border-primary rounded-r-md p-4 mb-7">
          <p className="text-sm text-foreground">
            O IMPU avalia a maturidade do planejamento urbano municipal com base em três dimensões, com pontuação máxima de <strong>60 pontos</strong>.
          </p>
        </div>
        
        {/* Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DimensionCard
            number={1}
            title="Existência e Obrigatoriedade do Plano Diretor"
            weight="40%"
            rows={[
              { label: "Obrigado e não possui PD", pts: 0, color: "red" },
              { label: "Não obrigado e não possui PD", pts: 5, color: "yellow" },
              { label: "Possui Plano Diretor", pts: 20, color: "green" },
            ]}
          />
          <DimensionCard
            number={2}
            title="Atualização do Plano Diretor"
            weight="30%"
            rows={[
              { label: "Plano inexistente", pts: 0, color: "red" },
              { label: "Revisão superior a 10 anos", pts: 10, color: "yellow" },
              { label: "Revisado nos últimos 10 anos", pts: 20, color: "green" },
            ]}
          />
          <DimensionCard
            number={3}
            title="Lei de Uso e Ocupação do Solo (LUSO)"
            weight="30%"
            rows={[
              { label: "Não possui LUSO", pts: 0, color: "red" },
              { label: "LUSO parcialmente atualizada", pts: 10, color: "yellow" },
              { label: "LUSO vigente e compatível", pts: 20, color: "green" },
            ]}
          />
        </div>
        
        {/* Classification Legend */}
        <div className="bg-card border rounded-md p-5 mb-8 shadow-sm">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Faixas de Classificação
          </h3>
          <div className="flex flex-col gap-3 mb-4">
            <LegendItem color="red" range="0 – 20" label="🔴 Crítico" desc="Município sem estrutura mínima de planejamento territorial." />
            <LegendItem color="yellow" range="21 – 40" label="🟡 Em Desenvolvimento" desc="Instrumentos existentes, porém desatualizados ou incompletos." />
            <LegendItem color="green" range="41 – 60" label="🟢 Estruturado" desc="Instrumentos mínimos de planejamento urbano instituídos e atualizados." />
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            <strong>⚠️ Critério automático de criticidade:</strong> O município é classificado automaticamente como <strong>Crítico</strong> quando for legalmente obrigado e não possuir Plano Diretor, ou quando possuir PD sem revisão há mais de 15 anos.
          </div>
        </div>
        
        {/* Tabs */}
        <h2 className="text-xl font-semibold text-foreground mb-4 pb-2.5 border-b-2 border-border">
          Lista Completa por IMPU
        </h2>
        
        <div className="flex flex-wrap gap-1.5 mb-5">
          <TabBtn active={filtClassif === ""} onClick={() => setFiltClassif("")}>
            Todos ({counts.all})
          </TabBtn>
          <TabBtn active={filtClassif === "Crítico"} onClick={() => setFiltClassif("Crítico")}>
            🔴 Crítico ({counts.critico})
          </TabBtn>
          <TabBtn active={filtClassif === "Em Desenvolvimento"} onClick={() => setFiltClassif("Em Desenvolvimento")}>
            🟡 Em Desenvolvimento ({counts.desenv})
          </TabBtn>
          <TabBtn active={filtClassif === "Estruturado"} onClick={() => setFiltClassif("Estruturado")}>
            🟢 Estruturado ({counts.estru})
          </TabBtn>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto rounded shadow-sm">
          <table className="w-full border-collapse bg-card text-sm">
            <thead>
              <tr>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Município</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Macrorregião</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Dim. 1</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Dim. 2</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Dim. 3</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Total</th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border">Classificação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr 
                  key={c.nome} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => onOpenCity(c.nome)}
                >
                  <td className="p-3 border-b border-border font-semibold">{c.nome}</td>
                  <td className="p-3 border-b border-border">{c.macro || "—"}</td>
                  <td className="p-3 border-b border-border font-mono font-semibold">{c.impu.dim1}</td>
                  <td className="p-3 border-b border-border font-mono font-semibold">{c.impu.dim2}</td>
                  <td className="p-3 border-b border-border font-mono font-semibold">{c.impu.dim3}</td>
                  <td className="p-3 border-b border-border">
                    <span 
                      className="font-mono font-bold"
                      style={{ 
                        color: c.impu.classif === "Estruturado" 
                          ? "#16a34a" 
                          : c.impu.classif === "Em Desenvolvimento" 
                            ? "#d97706" 
                            : "#dc2626" 
                      }}
                    >
                      {c.impu.total}
                    </span>
                  </td>
                  <td className="p-3 border-b border-border">
                    <BadgeClassif classif={c.impu.classif} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DimensionCard({ 
  number, 
  title, 
  weight, 
  rows 
}: { 
  number: number
  title: string
  weight: string
  rows: { label: string; pts: number; color: "red" | "yellow" | "green" }[]
}) {
  return (
    <div className="bg-card border rounded-md p-5 shadow-sm">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-xs font-bold tracking-wider uppercase text-primary">DIMENSÃO {number}</span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Peso: {weight}</span>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-4 leading-snug">{title}</h3>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-muted-foreground font-semibold uppercase text-left pb-1 border-b border-border">Situação</th>
            <th className="text-muted-foreground font-semibold uppercase text-left pb-1 border-b border-border">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="py-1.5 border-b border-muted">{row.label}</td>
              <td className={`py-1.5 border-b border-muted font-mono font-bold text-center ${
                row.color === "red" ? "text-red-600" : row.color === "yellow" ? "text-amber-600" : "text-green-600"
              }`}>
                {row.pts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LegendItem({ color, range, label, desc }: { color: "red" | "yellow" | "green"; range: string; label: string; desc: string }) {
  const badgeClass = color === "red" 
    ? "bg-red-50 text-red-700" 
    : color === "yellow" 
      ? "bg-amber-50 text-amber-700" 
      : "bg-green-50 text-green-700"
      
  return (
    <div className="flex items-start gap-3.5">
      <span className={`font-mono text-sm font-semibold px-2.5 py-0.5 rounded whitespace-nowrap ${badgeClass}`}>
        {range}
      </span>
      <div>
        <strong className="text-foreground">{label}</strong>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded text-xs font-medium border transition-colors ${
        active 
          ? "bg-primary border-primary text-primary-foreground font-semibold" 
          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  )
}
