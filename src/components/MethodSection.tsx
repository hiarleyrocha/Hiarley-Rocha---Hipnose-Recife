/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Compass, RefreshCw, KeyRound, ShieldCheck, ArrowRight, CornerDownRight } from "lucide-react";

const STAGES = [
  {
    num: "01",
    title: "Identificação Emocional Profunda",
    icon: Search,
    subtitle: "Mapeamento minucioso de âncoras e memórias subconscientes.",
    tagline: "Ir diretamente à raiz do nó neurológico em vez de apenas remediar sintomas superficiais.",
    description: "Nessa primeira fase do Método Resgate Emocional, nós não focamos em discussões intelectuais repetitivas. Em vez disso, através de um estado de foco altamente concentrado (transe terapêutico seguro), acessamos os pontos exatos onde seu cérebro instalou seus primeiros alarmes emocionais de alerta e estresse.",
    deliverables: [
      "Isolamento de crenças limitantes geradas na infância ou fases de estresse crônico",
      "Detecção de gatilhos inconscientes que causam a aceleração mental",
      "Clareza real dos motivos pelos quais você reage de forma automática hoje"
    ],
    science: "Análise baseada em neurobiologia das respostas de defesa (luta, fuga ou congelamento) arquivadas no sistema límbico."
  },
  {
    num: "02",
    title: "Reprocessamento Emocional",
    icon: RefreshCw,
    subtitle: "Digerir e dessensibilizar memórias estressoras persistentes.",
    tagline: "Permitir que o cérebro reorganize memórias carregadas de dor ou excesso de cobrança.",
    description: "Nossas experiências difíceis não resolvidas ficam arquivadas com 'carga emocional ativa'. Toda vez que você se sente julgado ou pressionado, essa carga é reativada, gerando o nó físico no corpo. Através do transe hipnótico clínico, nós reprocessamos essas memórias, retirando a carga de dor e esgotamento.",
    deliverables: [
      "Alívio instantâneo do peso emocional ligado a memórias antigas",
      "Dessensibilização de medos profundos, rejeição ou medos de falhar",
      "Percepção calma de fatos que antes causavam crises intensas de pânico ou agitação"
    ],
    science: "Similar aos processos naturais do sono REM (Rapid Eye Movement), onde o cérebro consolida acontecimentos sem a liberação de cortisol."
  },
  {
    num: "03",
    title: "Desativação de Padrões Automáticos",
    icon: Compass,
    subtitle: "Desligamento de loops cerebrais de sobrecarga crônica.",
    tagline: "Ensinar o cérebro que o perigo já passou e o alerta contínuo não é mais necessário.",
    description: "Você tenta desacelerar, mas sua mente não deixa. Isso acontece porque os circuitos de alerta tornaram-se caminhos neurais padrão. Através de intervenções diretas de hipnoterapia, ensinamos seu sistema nervoso a interromper esses loops de autossabotagem, permitindo que o relaxamento volte a ser natural.",
    deliverables: [
      "Interrupção de diálogos internos obsessivos e do autojulgamento contínuo",
      "Fim do ciclo inconsciente de roer unhas, insônia por antecipação ou procrastinação defensiva",
      "Reabilitação dos níveis saudáveis de cortisol e neurotransmissores do bem-estar"
    ],
    science: "Utilização do conceito biológico da neuroplasticidade autodirigida — reconfiguração de conexões sinápticas através da atenção focada."
  },
  {
    num: "04",
    title: "Reconstrução Emocional",
    icon: KeyRound,
    subtitle: "Instalação de hábitos internos de autocompaixão e segurança.",
    tagline: "Consolidar uma nova estrutura de autoestima, firmeza e limites intencionais.",
    description: "Após limpar os excessos e alarmes falsos, estruturamos a sua nova identidade. Você aprende a programar sua mente para operar com base em segurança interna, tranquilidade, autoaceitação compassiva e limites estruturais claros em sua rotina profissional e pessoal.",
    deliverables: [
      "Retorno das rédeas emocionais de forma racional e consciente",
      "Criação de âncoras personalizadas para calmaria em momentos de alta pressão",
      "Sensação contínua de estar em paz e seguro na própria pele"
    ],
    science: "Ancoragem mental e visualização ativa para o fortalecimento do córtex pré-frontal, responsável pelo controle inibitório e regulação de humores."
  }
];

interface MethodSectionProps {
  onOpenBooking: () => void;
}

export default function MethodSection({ onOpenBooking }: MethodSectionProps) {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const activeStage = STAGES[activeStageIdx];

  return (
    <section id="metodo" className="py-24 bg-neutral-900/40 relative overflow-hidden border-t border-b border-petroleo-950/60">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-0 w-80 h-80 radial-glow -translate-x-1/2 opacity-60"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 radial-glow translate-x-1/2 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-petroleo-950/85 border border-petroleo-900/55 rounded-full text-[10px] font-semibold uppercase tracking-wider text-petroleo-300">
            METODOLOGIA HIGH TICKET
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
            Método Resgate Emocional
          </h2>
          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Uma abordagem que integra neurociência, psicologia baseada em evidências e hipnoterapia clínica avançada para reconfigurar padrões ocultos em poucas sessões.
          </p>
        </div>

        {/* Desktop timeline tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Timeline navigation (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-4 relative">
            <div className="absolute left-[25px] top-4 bottom-4 w-0.5 bg-neutral-800 hidden sm:block"></div>
            
            {STAGES.map((stage, idx) => {
              const IconComp = stage.icon;
              const isActive = activeStageIdx === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStageIdx(idx)}
                  className={`w-full text-left p-4 sm:pl-12 rounded-sm transition-all duration-350 flex items-start gap-4 relative cursor-pointer group ${
                    isActive 
                      ? "bg-neutral-800/80 border border-petroleo-900/60 shadow-xl" 
                      : "bg-transparent hover:bg-neutral-850/40 border border-transparent"
                  }`}
                >
                  {/* Step bullet */}
                  <div className={`absolute left-[13px] top-[21px] w-6.5 h-6.5 rounded-full items-center justify-center border-2 hidden sm:flex transition-all duration-300 ${
                    isActive 
                      ? "bg-petroleo-950 border-petroleo-400 text-petroleo-300" 
                      : "bg-neutral-900 border-neutral-700 text-neutral-500 group-hover:border-neutral-500"
                  }`}>
                    <span className="text-[10px] font-mono font-medium">{stage.num}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm shrink-0 transition-colors duration-300 ${
                    isActive ? "bg-petroleo-950 text-petroleo-400" : "bg-neutral-900 text-neutral-400 group-hover:text-neutral-200"
                  }`}>
                    <IconComp className="w-5 h-5 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <span className={`text-xs font-mono tracking-wider ${isActive ? "text-petroleo-400" : "text-neutral-500"}`}>
                      PASSO {stage.num}
                    </span>
                    <h3 className={`font-display text-base font-semibold tracking-tight ${isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
                      {stage.title}
                    </h3>
                    <p className={`text-xs font-sans max-w-xs leading-relaxed line-clamp-1 ${isActive ? "text-neutral-300" : "text-neutral-500"}`}>
                      {stage.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active step content detail box (Right) */}
          <div className="lg:col-span-7 bg-neutral-850/60 border border-neutral-800 rounded-sm p-6 sm:p-8 md:p-10 flex flex-col justify-between relative shadow-2xl">
            <span className="absolute top-5 right-6 font-mono text-7xl font-extrabold text-neutral-800/20 select-none pointer-events-none">
              {activeStage.num}
            </span>

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-widest font-mono text-petroleo-400 uppercase">
                  PILAR DO RESGATE EMOCIONAL
                </span>
                <h4 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
                  {activeStage.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-neutral-300 italic font-light leading-relaxed">
                  &ldquo;{activeStage.subtitle}&rdquo;
                </p>
              </div>

              <div className="py-4 border-t border-b border-neutral-800/80 space-y-3">
                <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed">
                  {activeStage.description}
                </p>
                <div className="p-3.5 bg-neutral-900 border-l-2 border-petroleo-500 rounded-r-sm text-[12px] text-neutral-400 italic">
                  <strong>Por que isso acontece:</strong> {activeStage.tagline}
                </div>
              </div>

              {/* Scope deliverables */}
              <div className="space-y-3">
                <h5 className="font-sans text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  O que alcançamos nessa etapa:
                </h5>
                <ul className="space-y-2" aria-label="Passos da etapa">
                  {activeStage.deliverables.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      <CornerDownRight className="w-4 h-4 text-petroleo-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scientific proof block */}
              <div className="p-3 bg-petroleo-950/20 border border-petroleo-900/30 rounded text-[11.5px] text-neutral-400 font-sans flex items-start gap-2">
                <span className="font-bold text-petroleo-400 shrink-0 font-mono">SUPORTE NEUROCIENTÍFICO:</span>
                <span className="leading-tight">{activeStage.science}</span>
              </div>
            </div>

            {/* Quick action helper within active box */}
            <div className="pt-6 mt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-sans text-neutral-400">
                Tem interesse em passar por esse processo em Recife ou Online?
              </span>
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto bg-transparent hover:bg-petroleo-900/25 border border-petroleo-600 hover:border-petroleo-400 text-petroleo-300 text-xs uppercase font-semibold tracking-wider px-6 py-2.5 rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Conversar sobre este método
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
