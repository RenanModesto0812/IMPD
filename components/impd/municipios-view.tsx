"use client"

import { useState, useMemo } from "react"
import { Search, X, ArrowUpDown } from "lucide-react"
import { type Cidade, fmtN } from "@/lib/impu-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MunicipiosViewProps {
  cidades: Cidade[]
  onOpenCity: (nome: string) => void
}

type SortCol = "nome" | "macro" | "pop" | "impu"

function BadgeClassif({ classif }: { classif: string }) {
  if (classif === "Estruturado") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 whitespace-nowrap">🟢 Estruturado</span>
  }
  if (classif === "Em Desenvolvimento") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 whitespace-nowrap">🟡 Em Desenvolvimento</span>
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 whitespace-nowrap">🔴 Crítico</span>
}

export function MunicipiosView({ cidades, onOpenCity }: MunicipiosViewProps) {
  const [search, setSearch] = useState("")
  const [filtMacro, setFiltMacro] = useState("")
  const [filtClassif, setFiltClassif] = useState("")
  const [filtPD, setFiltPD] = useState("")
  const [filtFaixa, setFiltFaixa] = useState("")
  const [sortCol, setSortCol] = useState<SortCol>("nome")
  const [sortDir, setSortDir] = useState(1)
  
  const macros = useMemo(() => {
    return [...new Set(cidades.map(c => c.macro).filter(Boolean))].sort()
  }, [cidades])
  
  const filtered = useMemo(() => {
    const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    return cidades.filter(c => {
      const nome = c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (q && !nome.includes(q)) return false
      if (filtMacro && c.macro !== filtMacro) return false
      if (filtClassif && c.impu.classif !== filtClassif) return false
      if (filtPD === "sim" && !c.pd) return false
      if (filtPD === "nao" && c.pd) return false
      if (filtFaixa && c.faixaPop !== filtFaixa) return false
      return true
    }).sort((a, b) => {
      let va: string | number = a[sortCol as keyof Cidade] as string | number
      let vb: string | number = b[sortCol as keyof Cidade] as string | number
      if (sortCol === "impu") { va = a.impu.total; vb = b.impu.total }
      if (sortCol === "pop") { va = a.pop || 0; vb = b.pop || 0 }
      if (typeof va === "string") return va.localeCompare(vb as string, "pt-BR") * sortDir
      return ((va as number) - (vb as number)) * sortDir
    })
  }, [cidades, search, filtMacro, filtClassif, filtPD, filtFaixa, sortCol, sortDir])
  
  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d * -1)
    } else {
      setSortCol(col)
      setSortDir(1)
    }
  }
  
  const clearFilters = () => {
    setSearch("")
    setFiltMacro("")
    setFiltClassif("")
    setFiltPD("")
    setFiltFaixa("")
  }
  
  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-6 py-9 pb-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            Municípios de Mato Grosso
          </h1>
          <p className="text-sm text-primary-foreground/70">
            {cidades.length} municípios · Clique em qualquer linha para ver os detalhes completos
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap gap-2.5 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="🔍 Buscar município..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <select
          value={filtMacro}
          onChange={e => setFiltMacro(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todas as macrorregiões</option>
          {macros.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        <select
          value={filtClassif}
          onChange={e => setFiltClassif(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todas classificações</option>
          <option value="Crítico">🔴 Crítico</option>
          <option value="Em Desenvolvimento">🟡 Em Desenvolvimento</option>
          <option value="Estruturado">🟢 Estruturado</option>
        </select>
        
        <select
          value={filtPD}
          onChange={e => setFiltPD(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Plano Diretor (todos)</option>
          <option value="sim">Com PD</option>
          <option value="nao">Sem PD</option>
        </select>
        
        <select
          value={filtFaixa}
          onChange={e => setFiltFaixa(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todas faixas populacionais</option>
          <option value="< 20.000">Abaixo de 20 mil</option>
          <option value="20.000 – 100.000">20 mil a 100 mil</option>
          <option value="> 100.000">Acima de 100 mil</option>
        </select>
        
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Limpar
        </Button>
        
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length < cidades.length 
            ? `${filtered.length} de ${cidades.length} municípios` 
            : `${cidades.length} municípios`}
        </span>
      </div>
      
      {/* Table */}
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="overflow-x-auto rounded shadow-sm">
          <table className="w-full border-collapse bg-card text-sm">
            <thead>
              <tr>
                <th 
                  className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                  onClick={() => handleSort("nome")}
                >
                  <span className="flex items-center gap-1">
                    Município <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th 
                  className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                  onClick={() => handleSort("macro")}
                >
                  <span className="flex items-center gap-1">
                    Macrorregião <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th 
                  className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                  onClick={() => handleSort("pop")}
                >
                  <span className="flex items-center gap-1">
                    População <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                  PD
                </th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                  LUSO
                </th>
                <th 
                  className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                  onClick={() => handleSort("impu")}
                >
                  <span className="flex items-center gap-1">
                    IMPU <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                  Classificação
                </th>
                <th className="bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase text-left p-3 border-b-2 border-border whitespace-nowrap">
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr 
                  key={c.nome} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => onOpenCity(c.nome)}
                >
                  <td className="p-3 border-b border-border">
                    <span className="font-semibold">{c.nome}</span>
                    {c.turismo && <span title="Interesse turístico" className="ml-1 text-xs">🌿</span>}
                  </td>
                  <td className="p-3 border-b border-border">{c.macro || "—"}</td>
                  <td className="p-3 border-b border-border font-mono font-semibold">{fmtN(c.pop)}</td>
                  <td className="p-3 border-b border-border">
                    {c.pd 
                      ? <span className="text-green-600 font-semibold">✔</span>
                      : <span className="text-muted-foreground">✗</span>
                    }
                    {c.pd && c.pdAno && <span className="text-muted-foreground text-xs ml-1">{c.pdAno}</span>}
                  </td>
                  <td className="p-3 border-b border-border">
                    {c.luso 
                      ? <span className="text-green-600 font-semibold">✔</span>
                      : <span className="text-muted-foreground">✗</span>
                    }
                    {c.luso && c.lusoAno && <span className="text-muted-foreground text-xs ml-1">{c.lusoAno}</span>}
                  </td>
                  <td className="p-3 border-b border-border">
                    <span 
                      className="font-mono font-semibold"
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
                  <td className="p-3 border-b border-border">
                    <span className="text-primary text-xs cursor-pointer">Detalhes →</span>
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
