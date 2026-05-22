"use client"

import { useMemo } from "react"
import { type Cidade, fmtPct, classifKey } from "@/lib/impu-data"

interface MacroregionTableProps {
  cidades: Cidade[]
}

export function MacroregionTable({ cidades }: MacroregionTableProps) {
  const macros = useMemo(() => {
    const data: Record<string, { total: number; pd: number; luso: number; critico: number; desenv: number; estru: number }> = {}
    
    cidades.forEach(c => {
      const m = c.macro || "Não informado"
      if (!data[m]) {
        data[m] = { total: 0, pd: 0, luso: 0, critico: 0, desenv: 0, estru: 0 }
      }
      data[m].total++
      if (c.pd) data[m].pd++
      if (c.luso) data[m].luso++
      data[m][classifKey(c.impu.classif) as "critico" | "desenv" | "estru"]++
    })
    
    return Object.entries(data)
      .sort((a, b) => b[1].total - a[1].total)
  }, [cidades])
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 pb-16">
      <h2 className="text-xl font-semibold text-foreground mb-1.5 pb-2.5 border-b-2 border-border">
        Panorama por Macrorregião
      </h2>
      
      <div className="mt-6 overflow-x-auto rounded shadow-sm">
        <table className="w-full border-collapse bg-card text-sm">
          <thead>
            <tr>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Macrorregião
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Municípios
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Com PD
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Com LUSO
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Crítico
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Em Desenv.
              </th>
              <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                Estruturado
              </th>
            </tr>
          </thead>
          <tbody>
            {macros.map(([macro, d]) => (
              <tr key={macro} className="hover:bg-muted/50">
                <td className="p-3 border-b border-border font-semibold">{macro}</td>
                <td className="p-3 border-b border-border font-mono font-semibold">{d.total}</td>
                <td className="p-3 border-b border-border">
                  {d.pd} <span className="text-muted-foreground text-xs">({fmtPct(d.pd, d.total)})</span>
                </td>
                <td className="p-3 border-b border-border">
                  {d.luso} <span className="text-muted-foreground text-xs">({fmtPct(d.luso, d.total)})</span>
                </td>
                <td className="p-3 border-b border-border">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                    {d.critico}
                  </span>
                </td>
                <td className="p-3 border-b border-border">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                    {d.desenv}
                  </span>
                </td>
                <td className="p-3 border-b border-border">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                    {d.estru}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
