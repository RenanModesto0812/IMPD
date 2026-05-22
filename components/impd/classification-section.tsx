"use client"

import { useMemo } from "react"
import { type Cidade, fmtN, fmtPct } from "@/lib/impu-data"

interface ClassificationSectionProps {
  cidades: Cidade[]
}

export function ClassificationSection({ cidades }: ClassificationSectionProps) {
  const stats = useMemo(() => {
    const total = cidades.length
    const critico = cidades.filter(c => c.impu.classif === "Crítico").length
    const desenv = cidades.filter(c => c.impu.classif === "Em Desenvolvimento").length
    const estru = cidades.filter(c => c.impu.classif === "Estruturado").length
    return { total, critico, desenv, estru }
  }, [cidades])
  
  const cards = [
    { 
      key: "critico", 
      label: "Crítico", 
      n: stats.critico, 
      desc: "Sem estrutura mínima de planejamento territorial.",
      color: "border-t-red-600",
      badgeClass: "bg-red-50 text-red-700",
      numColor: "text-red-600",
      barColor: "bg-red-600"
    },
    { 
      key: "desenv", 
      label: "Em Desenvolvimento", 
      n: stats.desenv, 
      desc: "Instrumentos existentes, desatualizados ou incompletos.",
      color: "border-t-amber-600",
      badgeClass: "bg-amber-50 text-amber-700",
      numColor: "text-amber-600",
      barColor: "bg-amber-600"
    },
    { 
      key: "estru", 
      label: "Estruturado", 
      n: stats.estru, 
      desc: "Instrumentos mínimos instituídos e atualizados.",
      color: "border-t-green-600",
      badgeClass: "bg-green-50 text-green-700",
      numColor: "text-green-600",
      barColor: "bg-green-600"
    },
  ]
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-xl font-semibold text-foreground mb-1.5 pb-2.5 border-b-2 border-border">
        Situação Geral — IMPU
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        O Índice de Maturidade do Planejamento Urbano classifica cada município em três níveis com base na existência, atualidade e completude dos instrumentos de planejamento.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(card => (
          <div 
            key={card.key}
            className={`bg-card border rounded shadow-sm border-t-4 ${card.color} p-5`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[0.68rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                {card.label}
              </span>
            </div>
            <div className={`font-mono text-4xl font-semibold leading-none mb-1 ${card.numColor}`}>
              {card.n}
            </div>
            <div className="text-sm text-muted-foreground">municípios</div>
            <div className="font-mono text-sm text-muted-foreground/70 mt-1">
              {fmtPct(card.n, stats.total)} do total
            </div>
            <div className="mt-3.5 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${card.barColor} transition-all duration-1000`}
                style={{ width: `${(card.n / stats.total * 100).toFixed(1)}%` }}
              />
            </div>
            <div className="mt-2.5 text-xs text-muted-foreground">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
