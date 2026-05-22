"use client"

import { IMPU_DATA, type CidadeData } from "@/lib/impu-data"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Extend jsPDF with autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

export interface ExportFilters {
  macrorregiao?: string
  classificacao?: string
  comPD?: boolean | null
  comLUSO?: boolean | null
  obrigadoPD?: boolean | null
  turismo?: boolean | null
}

function filterData(filters: ExportFilters): [string, CidadeData][] {
  return Object.entries(IMPU_DATA).filter(([, data]) => {
    if (filters.macrorregiao && filters.macrorregiao !== "Todas" && data.macro !== filters.macrorregiao) return false
    if (filters.classificacao && filters.classificacao !== "Todas" && data.impu.classif !== filters.classificacao) return false
    if (filters.comPD === true && !data.pd) return false
    if (filters.comPD === false && data.pd) return false
    if (filters.comLUSO === true && !data.luso) return false
    if (filters.comLUSO === false && data.luso) return false
    if (filters.obrigadoPD === true && !data.obrigadoPD) return false
    if (filters.turismo === true && !data.turismo) return false
    return true
  })
}

export function exportToExcel(filters: ExportFilters = {}, filename: string = "relatorio-impd-mt") {
  const filtered = filterData(filters)
  
  const data = filtered.map(([nome, m]) => ({
    "Município": nome,
    "Macrorregião": m.macro,
    "População": m.pop,
    "Faixa Populacional": m.faixaPop,
    "Turismo": m.turismo ? "Sim" : "Não",
    "Obrigado PD": m.obrigadoPD ? "Sim" : "Não",
    "Possui PD": m.pd ? "Sim" : "Não",
    "Lei do PD": m.pdLei || "-",
    "Ano PD": m.pdAno || "-",
    "Link PD": m.pdLink || "-",
    "Possui LUSO": m.luso ? "Sim" : "Não",
    "Lei LUSO": m.lusoLei || "-",
    "Ano LUSO": m.lusoAno || "-",
    "Link LUSO": m.lusoLink || "-",
    "IMPU Dim 1": m.impu.dim1,
    "IMPU Dim 2": m.impu.dim2,
    "IMPU Dim 3": m.impu.dim3,
    "IMPU Total": m.impu.total,
    "Classificação": m.impu.classif,
    "Telefone": m.telefone || "-",
    "Email": m.email || "-",
  }))
  
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Município
    { wch: 15 }, // Macrorregião
    { wch: 12 }, // População
    { wch: 20 }, // Faixa Populacional
    { wch: 8 },  // Turismo
    { wch: 12 }, // Obrigado PD
    { wch: 10 }, // Possui PD
    { wch: 25 }, // Lei do PD
    { wch: 8 },  // Ano PD
    { wch: 50 }, // Link PD
    { wch: 12 }, // Possui LUSO
    { wch: 20 }, // Lei LUSO
    { wch: 10 }, // Ano LUSO
    { wch: 50 }, // Link LUSO
    { wch: 12 }, // IMPU Dim 1
    { wch: 12 }, // IMPU Dim 2
    { wch: 12 }, // IMPU Dim 3
    { wch: 12 }, // IMPU Total
    { wch: 18 }, // Classificação
    { wch: 18 }, // Telefone
    { wch: 35 }, // Email
  ]
  ws["!cols"] = colWidths
  
  XLSX.utils.book_append_sheet(wb, ws, "Municípios")
  
  // Adicionar aba de resumo
  const resumo = [
    { "Indicador": "Total de Municípios", "Valor": filtered.length },
    { "Indicador": "Com Plano Diretor", "Valor": filtered.filter(([, m]) => m.pd).length },
    { "Indicador": "Com Lei de Uso do Solo", "Valor": filtered.filter(([, m]) => m.luso).length },
    { "Indicador": "Obrigados sem PD", "Valor": filtered.filter(([, m]) => m.obrigadoPD && !m.pd).length },
    { "Indicador": "Classificação Crítico", "Valor": filtered.filter(([, m]) => m.impu.classif === "Crítico").length },
    { "Indicador": "Classificação Em Desenvolvimento", "Valor": filtered.filter(([, m]) => m.impu.classif === "Em Desenvolvimento").length },
    { "Indicador": "Classificação Estruturado", "Valor": filtered.filter(([, m]) => m.impu.classif === "Estruturado").length },
    { "Indicador": "População Total", "Valor": filtered.reduce((acc, [, m]) => acc + m.pop, 0) },
    { "Indicador": "Municípios Turísticos", "Valor": filtered.filter(([, m]) => m.turismo).length },
  ]
  const wsResumo = XLSX.utils.json_to_sheet(resumo)
  wsResumo["!cols"] = [{ wch: 35 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo")
  
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportToPDF(filters: ExportFilters = {}, filename: string = "relatorio-impd-mt") {
  const filtered = filterData(filters)
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  
  // Título
  doc.setFontSize(18)
  doc.setTextColor(0, 51, 102)
  doc.text("IMPD-MT - Inventário de Planos Diretores", 148, 15, { align: "center" })
  
  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text("Relatório de Municípios de Mato Grosso", 148, 22, { align: "center" })
  
  doc.setFontSize(9)
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 148, 28, { align: "center" })
  
  // Resumo
  const totalMunicipios = filtered.length
  const comPD = filtered.filter(([, m]) => m.pd).length
  const comLUSO = filtered.filter(([, m]) => m.luso).length
  const obrigadosSemPD = filtered.filter(([, m]) => m.obrigadoPD && !m.pd).length
  
  doc.setFontSize(10)
  doc.setTextColor(0)
  doc.text(`Total: ${totalMunicipios} | Com PD: ${comPD} | Com LUSO: ${comLUSO} | Obrigados sem PD: ${obrigadosSemPD}`, 148, 35, { align: "center" })
  
  // Tabela principal
  const tableData = filtered.map(([nome, m]) => [
    nome,
    m.macro,
    m.pop.toLocaleString("pt-BR"),
    m.pd ? "Sim" : "Não",
    m.luso ? "Sim" : "Não",
    m.impu.total.toString(),
    m.impu.classif,
    m.obrigadoPD ? "Sim" : "Não",
  ])
  
  autoTable(doc, {
    head: [["Município", "Macro", "Pop.", "PD", "LUSO", "IMPU", "Classif.", "Obrig."]],
    body: tableData,
    startY: 42,
    theme: "striped",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 245, 250],
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 15, halign: "center" },
      6: { cellWidth: 35 },
      7: { cellWidth: 15, halign: "center" },
    },
    didDrawCell: (data) => {
      // Colorir célula de classificação
      if (data.column.index === 6 && data.section === "body") {
        const classif = data.cell.raw as string
        if (classif === "Crítico") {
          doc.setFillColor(254, 226, 226)
        } else if (classif === "Em Desenvolvimento") {
          doc.setFillColor(254, 243, 199)
        } else if (classif === "Estruturado") {
          doc.setFillColor(220, 252, 231)
        }
      }
    },
  })
  
  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128)
    doc.text(
      `Página ${i} de ${pageCount} | IMPD-MT | Desenvolvido por Renan Modesto`,
      148,
      doc.internal.pageSize.height - 8,
      { align: "center" }
    )
  }
  
  doc.save(`${filename}.pdf`)
}

export function exportMunicipioPDF(nome: string) {
  const data = IMPU_DATA[nome]
  if (!data) return
  
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  
  // Cabeçalho
  doc.setFillColor(0, 51, 102)
  doc.rect(0, 0, 210, 40, "F")
  
  doc.setFontSize(22)
  doc.setTextColor(255)
  doc.text(nome, 105, 20, { align: "center" })
  
  doc.setFontSize(12)
  doc.text(`Macrorregião ${data.macro} - Mato Grosso`, 105, 30, { align: "center" })
  
  // Informações Gerais
  let yPos = 55
  
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Informações Gerais", 20, yPos)
  yPos += 10
  
  doc.setFontSize(10)
  doc.setTextColor(0)
  
  const info = [
    ["População", data.pop.toLocaleString("pt-BR") + " habitantes"],
    ["Faixa Populacional", data.faixaPop],
    ["Macrorregião", data.macro],
    ["Município Turístico", data.turismo ? "Sim" : "Não"],
    ["Obrigado a ter PD", data.obrigadoPD ? "Sim (>20.000 hab.)" : "Não"],
  ]
  
  autoTable(doc, {
    body: info,
    startY: yPos,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 100 },
    },
  })
  
  yPos = doc.lastAutoTable.finalY + 15
  
  // IMPU
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Índice IMPU", 20, yPos)
  yPos += 10
  
  // Barra de progresso IMPU
  const barWidth = 120
  const barHeight = 20
  const progress = (data.impu.total / 60) * barWidth
  
  // Fundo
  doc.setFillColor(229, 231, 235)
  doc.roundedRect(20, yPos, barWidth, barHeight, 3, 3, "F")
  
  // Progresso
  const color = data.impu.classif === "Crítico" ? [239, 68, 68] : 
                data.impu.classif === "Em Desenvolvimento" ? [245, 158, 11] : [34, 197, 94]
  doc.setFillColor(color[0], color[1], color[2])
  doc.roundedRect(20, yPos, progress, barHeight, 3, 3, "F")
  
  // Texto
  doc.setFontSize(12)
  doc.setTextColor(255)
  doc.text(`${data.impu.total}/60 - ${data.impu.classif}`, 80, yPos + 13, { align: "center" })
  
  yPos += barHeight + 15
  
  // Dimensões
  const dims = [
    ["Dimensão 1 - Plano Diretor", `${data.impu.dim1}/20`],
    ["Dimensão 2 - Lei de Uso do Solo", `${data.impu.dim2}/20`],
    ["Dimensão 3 - Instrumentos Complementares", `${data.impu.dim3}/20`],
  ]
  
  autoTable(doc, {
    body: dims,
    startY: yPos,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 30, halign: "center", fontStyle: "bold" },
    },
  })
  
  yPos = doc.lastAutoTable.finalY + 15
  
  // Plano Diretor
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Plano Diretor", 20, yPos)
  yPos += 10
  
  const pdInfo = [
    ["Possui Plano Diretor", data.pd ? "Sim" : "Não"],
    ["Lei do PD", data.pdLei || "-"],
    ["Ano de Aprovação", data.pdAno || "-"],
    ["Revisão do PD", data.revPd ? `Sim (${data.revPdAno})` : "Não revisado"],
  ]
  
  autoTable(doc, {
    body: pdInfo,
    startY: yPos,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 100 },
    },
  })
  
  yPos = doc.lastAutoTable.finalY + 15
  
  // Lei de Uso do Solo
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Lei de Uso e Ocupação do Solo", 20, yPos)
  yPos += 10
  
  const lusoInfo = [
    ["Possui LUSO", data.luso ? "Sim" : "Não"],
    ["Lei da LUSO", data.lusoLei || "-"],
    ["Ano de Aprovação", data.lusoAno || "-"],
  ]
  
  autoTable(doc, {
    body: lusoInfo,
    startY: yPos,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 100 },
    },
  })
  
  // Rodapé
  doc.setFontSize(8)
  doc.setTextColor(128)
  doc.text(
    `IMPD-MT | Gerado em ${new Date().toLocaleDateString("pt-BR")} | Desenvolvido por Renan Modesto (github.com/RenanModesto0812)`,
    105,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  )
  
  doc.save(`ficha-${nome.toLowerCase().replace(/\s+/g, "-")}.pdf`)
}
