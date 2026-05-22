"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { type Cidade, fmtN, classifKey } from "@/lib/impu-data"
import { Button } from "@/components/ui/button"

interface CityModalProps {
  cidade: Cidade
  onClose: () => void
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

export function CityModal({ cidade: c, onClose }: CityModalProps) {
  const key = classifKey(c.impu.classif)
  const pct = (c.impu.total / 60 * 100).toFixed(0)
  
  useEffect(() => {
    document.body.style.overflow = "hidden"
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/45 flex items-start justify-center p-5 pt-[60px] overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card rounded-md shadow-xl w-full max-w-3xl relative animate-in slide-in-from-bottom-4 fade-in duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/20"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
            Mato Grosso · {c.macro || "—"}
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-tight">{c.nome}</h2>
          <div className="text-sm text-muted-foreground mt-1">
            {c.faixaPop || "—"} habitantes · {c.turismo ? "🌿 Interesse turístico" : "Sem destaque turístico"}
            {" · "}
            {c.obrigadoPD 
              ? <span className="text-red-600 text-xs">⚠️ Obrigado por lei</span>
              : <span className="text-xs">Não obrigado</span>
            }
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Informações Gerais */}
          <Section title="Informações Gerais">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="População (Censo 2022)" value={`${fmtN(c.pop)} habitantes`} />
              <InfoItem label="Faixa Populacional" value={c.faixaPop || "—"} />
              <InfoItem label="Macrorregião IMEA" value={c.macro || "—"} />
              <InfoItem label="Turismo" value={c.turismo ? "🌿 Destino de interesse turístico" : "—"} />
            </div>
          </Section>
          
          {/* IMPU */}
          <Section title="IMPU — Índice de Maturidade do Planejamento Urbano">
            <div className="flex items-center gap-4 mb-2.5">
              <div 
                className="font-mono text-4xl font-bold"
                style={{
                  color: key === "estru" ? "#16a34a" : key === "desenv" ? "#d97706" : "#dc2626"
                }}
              >
                {c.impu.total}
                <span className="text-base text-muted-foreground">/60</span>
              </div>
              <BadgeClassif classif={c.impu.classif} />
            </div>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full rounded-full ${
                  key === "estru" ? "bg-green-600" : key === "desenv" ? "bg-amber-600" : "bg-red-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            
            <div className="flex gap-2.5">
              <DimBox label="Dimensão 1" sublabel="Existência PD" value={c.impu.dim1} />
              <DimBox label="Dimensão 2" sublabel="Atualização PD" value={c.impu.dim2} />
              <DimBox label="Dimensão 3" sublabel="LUSO" value={c.impu.dim3} />
            </div>
          </Section>
          
          {/* Plano Diretor */}
          <Section title="📋 Plano Diretor">
            <div className="grid grid-cols-2 gap-3">
              <LegItem 
                label="Plano Diretor" 
                exists={c.pd} 
                lei={c.pdLei} 
                ano={c.pdAno} 
                link={c.pdLink} 
              />
              <LegItem 
                label="Revisão do PD" 
                exists={c.revPd} 
                lei={c.revPdLei} 
                ano={c.revPdAno} 
                link={null} 
              />
            </div>
          </Section>
          
          {/* LUSO */}
          <Section title="🏙 Lei de Uso e Ocupação do Solo">
            <div className="grid grid-cols-2 gap-3">
              <LegItem 
                label="Lei de Uso do Solo (LUSO)" 
                exists={c.luso} 
                lei={c.lusoLei} 
                ano={c.lusoAno} 
                link={c.lusoLink} 
              />
              <LegItem 
                label="Revisão da LUSO" 
                exists={c.revLuso} 
                lei={c.revLusoLei} 
                ano={c.revLusoAno} 
                link={null} 
              />
            </div>
          </Section>
          
          {/* Responsável */}
          {(c.responsavel || c.cargo || c.telefone || c.email) && (
            <Section title="👤 Responsável pelo Planejamento Urbano">
              <div className="grid grid-cols-2 gap-3">
                {c.responsavel && <InfoItem label="Nome" value={c.responsavel} />}
                {c.cargo && <InfoItem label="Cargo" value={c.cargo} />}
                {c.telefone && <InfoItem label="Telefone" value={c.telefone} />}
                {c.email && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">E-mail</span>
                    <a href={`mailto:${c.email}`} className="text-sm font-medium text-primary hover:underline">
                      {c.email}
                    </a>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-1.5 border-b">
        {title}
      </h3>
      {children}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function DimBox({ label, sublabel, value }: { label: string; sublabel: string; value: number }) {
  return (
    <div className="flex-1 bg-muted border rounded p-2.5 text-center">
      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider leading-tight">
        {label}<br/>{sublabel}
      </div>
      <div className="font-mono text-xl font-semibold text-foreground mt-1">{value}</div>
    </div>
  )
}

function LegItem({ 
  label, 
  exists, 
  lei, 
  ano, 
  link 
}: { 
  label: string
  exists: boolean
  lei: string | null
  ano: string | null
  link: string | null
}) {
  if (!exists) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">{label}</span>
        <span className="text-sm text-muted-foreground">Não localizado</span>
      </div>
    )
  }
  
  const txt = [lei ? `Lei nº ${lei}` : "", ano ? `(${ano})` : ""].filter(Boolean).join(" ")
  
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">{label}</span>
      <span className="text-sm font-medium text-foreground">
        {txt || "Sim"}
        {link && (
          <>
            {" "}
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Acessar →
            </a>
          </>
        )}
      </span>
    </div>
  )
}
