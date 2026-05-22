"use client"

import { useMemo } from "react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { type Cidade, fmtN } from "@/lib/impu-data"

interface DashboardViewProps {
  cidades: Cidade[]
}

const COLORS = {
  critico: "#dc2626",
  desenv: "#d97706", 
  estru: "#16a34a",
  comPD: "#003366",
  semPD: "#9ca3af"
}

export function DashboardView({ cidades }: DashboardViewProps) {
  const stats = useMemo(() => {
    const critico = cidades.filter(c => c.impu.classif === "Crítico").length
    const desenv = cidades.filter(c => c.impu.classif === "Em Desenvolvimento").length
    const estru = cidades.filter(c => c.impu.classif === "Estruturado").length
    
    // Macros
    const macros: Record<string, { total: number; pd: number }> = {}
    cidades.forEach(c => {
      const m = c.macro || "N/I"
      if (!macros[m]) macros[m] = { total: 0, pd: 0 }
      macros[m].total++
      if (c.pd) macros[m].pd++
    })
    
    // Faixas populacionais
    const faixas: Record<string, number> = {}
    cidades.forEach(c => {
      const f = c.faixaPop || "N/I"
      faixas[f] = (faixas[f] || 0) + 1
    })
    
    // Obrigados
    const obrigados = cidades.filter(c => c.obrigadoPD)
    const obrigadosComPD = obrigados.filter(c => c.pd).length
    const obrigadosSemPD = obrigados.length - obrigadosComPD
    
    // Top 30 IMPU
    const top30 = [...cidades]
      .sort((a, b) => b.impu.total - a.impu.total)
      .slice(0, 30)
    
    return {
      classif: [
        { name: "🔴 Crítico", value: critico, color: COLORS.critico },
        { name: "🟡 Em Desenvolvimento", value: desenv, color: COLORS.desenv },
        { name: "🟢 Estruturado", value: estru, color: COLORS.estru },
      ],
      macros: Object.entries(macros)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([name, d]) => ({
          name,
          comPD: d.pd,
          semPD: d.total - d.pd
        })),
      faixas: Object.entries(faixas).map(([name, value]) => ({ name, value })),
      obrigados: [
        { name: "Com PD", value: obrigadosComPD, color: COLORS.comPD },
        { name: "Sem PD", value: obrigadosSemPD, color: COLORS.semPD },
      ],
      top30: top30.map(c => ({
        name: c.nome.length > 12 ? c.nome.substring(0, 12) + "…" : c.nome,
        impu: c.impu.total,
        color: c.impu.classif === "Estruturado" ? COLORS.estru : c.impu.classif === "Em Desenvolvimento" ? COLORS.desenv : COLORS.critico
      }))
    }
  }, [cidades])
  
  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-6 py-9 pb-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            Dashboard Estatístico
          </h1>
          <p className="text-sm text-primary-foreground/70">
            Análise consolidada do planejamento urbano nos {cidades.length} municípios
          </p>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Classificação IMPU */}
          <ChartCard title="Classificação IMPU">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.classif}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(" ")[1] || name}: ${value}`}
                  labelLine={false}
                >
                  {stats.classif.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value} municípios`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          
          {/* PD por Macrorregião */}
          <ChartCard title="PD por Macrorregião">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.macros} layout="vertical" margin={{ left: 80, right: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={75} />
                <Tooltip />
                <Legend />
                <Bar dataKey="comPD" name="Com PD" stackId="a" fill={COLORS.comPD} />
                <Bar dataKey="semPD" name="Sem PD" stackId="a" fill={COLORS.semPD} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          
          {/* Distribuição Populacional */}
          <ChartCard title="Distribuição Populacional">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.faixas}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {stats.faixas.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={["#003366", "#0066cc", "#3399ff"][i % 3]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} municípios`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          
          {/* Municípios Obrigados */}
          <ChartCard title="Municípios Obrigados com e sem PD">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.obrigados}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {stats.obrigados.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value} municípios`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          
          {/* Top 30 IMPU */}
          <div className="md:col-span-2">
            <ChartCard title="IMPU por Município (Top 30)">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.top30} margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 9, angle: -45, textAnchor: "end" }} 
                    interval={0}
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 60]} />
                  <Tooltip formatter={(value) => [`${value}/60`, "IMPU"]} />
                  <Bar dataKey="impu" name="IMPU">
                    {stats.top30.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-md p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  )
}
