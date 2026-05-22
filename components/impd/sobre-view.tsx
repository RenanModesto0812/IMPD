"use client"

export function SobreView() {
  return (
    <div>
      {/* Header */}
      <div className="bg-primary px-6 py-9 pb-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            Sobre o IMPD-MT
          </h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SobreCard title="O que é o IMPD-MT?">
            <p className="mb-3">
              O Inventário de Planos Diretores e Leis de Uso e Ocupação do Solo do Estado de Mato Grosso (IMPD-MT) é um instrumento de monitoramento da situação do planejamento urbano nos 142 municípios mato-grossenses.
            </p>
            <p>
              Desenvolvido pelo IMEA — Instituto Mato-Grossense de Economia Agropecuária, o inventário levanta, sistematiza e disponibiliza publicamente informações sobre a existência, vigência e acesso às principais leis urbanísticas municipais.
            </p>
          </SobreCard>
          
          <SobreCard title="Fonte dos dados">
            <ul className="space-y-2">
              <li>
                <strong>Planos Diretores:</strong> leismunicipais.com.br · sites oficiais das prefeituras · câmaras municipais
              </li>
              <li>
                <strong>População:</strong> IBGE · Censo Demográfico 2022
              </li>
              <li>
                <strong>Turismo:</strong> Mapa do Turismo Brasileiro · MTur
              </li>
              <li>
                <strong>Obrigatoriedade PD:</strong> Estatuto da Cidade (Lei 10.257/2001)
              </li>
            </ul>
          </SobreCard>
          
          <SobreCard title="Contato e atualização">
            <p className="mb-3">
              Os dados foram coletados e verificados até <strong>19 de maio de 2026</strong> (v19/05/2026).
            </p>
            <p className="mb-4">
              Para atualizar informações do seu município, entre em contato com o IMEA através dos canais oficiais.
            </p>
            <a 
              href="https://www.imea.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Acessar site do IMEA →
            </a>
          </SobreCard>
          
          <SobreCard title="Legislação de referência">
            <ul className="space-y-2">
              <li>
                <strong>Estatuto da Cidade</strong> — Lei Federal 10.257/2001
              </li>
              <li>
                <strong>Constituição Federal</strong> — Arts. 182 e 183
              </li>
              <li>
                <strong>Código Florestal</strong> — Lei 12.651/2012
              </li>
            </ul>
          </SobreCard>
        </div>
      </div>
    </div>
  )
}

function SobreCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-md p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  )
}
