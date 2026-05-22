"use client"

import { useEffect, useState } from "react"

export function GovBar() {
  const [date, setDate] = useState("")
  
  useEffect(() => {
    setDate(new Date().toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }))
  }, [])
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground/90 text-xs py-1.5">
      <div className="mx-auto max-w-7xl px-6 flex items-center gap-2">
        <span className="text-sm">🏛️</span>
        <span>Estado de Mato Grosso · IMEA – Instituto Mato-Grossense de Economia Agropecuária</span>
        <span className="ml-auto tabular-nums opacity-75">{date}</span>
      </div>
    </div>
  )
}
