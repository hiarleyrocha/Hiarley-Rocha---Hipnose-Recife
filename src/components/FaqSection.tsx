/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ChevronDown, HelpCircle, ShieldAlert, Sparkles, MapPin, ClipboardList } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  tag: string;
}

const FAQS: FAQItem[] = [
  {
    tag: "seguranca",
    q: "Eu vou ficar inconsciente ou perder o controle de mim mesmo durante a hipnose?",
    a: "Absolutamente não. Esse é o maior mito propagado por filmes e shows de TV. Na hipnoterapia clínica, você não dorme e nem fica inconsciente. O transe é simplesmente um estado de foco e relaxamento profundos, similar a quando você fica imerso lendo um livro excelente ou assistindo a um filme e esquece do mundo em sua volta. Você ouve tudo, se lembra de tudo e mantém o controle total sobre o seu comportamento, seus valores éticos e o que escolhe falar."
  },
  {
    tag: "processo",
    q: "Como o Método Resgate Emocional funciona em poucas sessões?",
    a: "Diferente da psicoterapia tradicional de fala livre que costuma durar anos, a hipnose clínica atalha o intelecto lógico (que já sabe racionalmente qual é o problema) e permite que visitemos a mente subconsciente. É lá que estão guardados os padrões automáticos gerados por traumas ou sobrecargas acumuladas. Mapeando e reprocessando esses nós de alerta em um nível biológico, os resultados costumam ser consolidados de forma muito mais rápida, geralmente entre 3 a 5 sessões."
  },
  {
    tag: "indicacao",
    q: "A hipnoterapia é indicada para mente acelerada e ansiedade silenciosa?",
    a: "Sim, é uma das principais indicações. Aquela sensação de estar constantemente funcionando no limite de exaustão, as preocupações obsessivas que perturbam o sono ao deitar e a irritabilidade sem motivo real são frutos de um cérebro que aprendeu a ligar o alerta vermelho. A terapia reabilita as reações automáticas, desativando os sintomas de aperto no peito, falta de ar ou aquela sensação de vazio crônico."
  },
  {
    tag: "local",
    q: "Onde o consultório de Hiarley Rocha está localizado em Recife? Existe atendimento online?",
    a: "O consultório presencial está estrategicamente posicionado com salas confortáveis e privativas em Recife, com locais dedicados para o seu atendimento tanto na Zona Sul quanto na Zona Norte, priorizando o seu fácil acesso e total discrição. Também disponibilizamos o formato online de altíssima fidelidade, extremamente seguro e com a mesma rapidez e eficácia clínica para atender pacientes de todo o Brasil."
  },
  {
    tag: "seguranca",
    q: "A hipnoterapia é regulamentada? Possui fundamentação científica?",
    a: "Sim. A hipnoterapia clínica é reconhecida e regulamentada por diversos conselhos federais de saúde no Brasil (incluindo Psicologia, Medicina, Odontologia, Fisioterapia e Enfermagem). A neurociência moderna estuda e documenta o estado de transe através de exames de imagem cerebral (Fmri), que mostram a redução na atividade da rede de modo padrão (DMN) e aumento de conexões na regulação emocional."
  },
  {
    tag: "preco",
    q: "Como funciona a primeira conversa de avaliação e qual o preço?",
    a: "Não iniciamos tratamentos sem antes realizar uma Sessão de Avaliação Estrutural. Nessa avaliação (presencial ou online), analisamos detalhadamente o seu histórico clínico, mapeamos suas dores, avaliamos seu perfil de resposta neurológica às técnicas clínicas e desenhamos seu plano personalizado, determinando o número de sessões ideal para o seu caso. Para saber o valor da avaliação e horários disponíveis em Recife, basta clicar em qualquer botão desta página e falar com nossa recepção no WhatsApp."
  }
];

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = activeTab === "todos" 
    ? FAQS 
    : FAQS.filter(f => f.tag === activeTab);

  return (
    <section id="faq" className="py-24 bg-neutral-950 relative overflow-hidden border-b border-neutral-900">
      
      {/* Visual background texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] radial-glow opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Text */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
            RESPOSTAS E CLAREZA CIENTÍFICA
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
            Esclarecendo suas dúvidas
          </h2>
          <p className="font-sans text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Sem crenças místicas ou promessas heróicas. Compreenda o funcionamento real da hipnose clínica e tome uma decisão segura sobre sua reabilitação mental.
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: "todos", label: "Todas as dúvidas" },
            { id: "seguranca", label: "Mitos e Verdades" },
            { id: "processo", label: "Frequência e Método" },
            { id: "indicacao", label: "Indicações de Tratamento" },
            { id: "local", label: "Localização em Recife" },
            { id: "preco", label: "Avaliação Primária" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setOpenIdx(null);
              }}
              className={`px-4 py-2 text-[12px] md:text-xs font-medium tracking-wide rounded-full border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-petroleo-900/40 border-petroleo-500 text-petroleo-300 shadow-md"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion Wrapper */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            
            return (
              <div
                key={idx}
                className={`bg-neutral-900 border transition-all duration-300 rounded-sm overflow-hidden ${
                  isOpen 
                    ? "border-petroleo-800/80 shadow-lg shadow-black/20" 
                    : "border-neutral-850/60 hover:border-neutral-800 hover:bg-neutral-850/20"
                }`}
              >
                {/* Header click bar */}
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                      isOpen ? "text-petroleo-400 animate-pulse" : "text-neutral-500"
                    }`} />
                    <span className={`font-display text-sm md:text-base font-semibold tracking-tight transition-colors ${
                      isOpen ? "text-white" : "text-neutral-250 hover:text-white"
                    }`}>
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "transform rotate-180 text-petroleo-400" : ""
                  }`} />
                </button>

                {/* Sub Body Answer */}
                <div
                  className={`transition-all duration-350 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100 border-t border-neutral-850 bg-neutral-950/20" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="p-5 text-neutral-300 text-xs md:text-sm leading-relaxed space-y-3 font-light">
                    <p>{faq.a}</p>
                    <div className="flex items-center gap-1.5 pt-2 text-[11px] text-petroleo-400 font-medium font-mono">
                      {faq.tag === "seguranca" && <ShieldAlert className="w-3.5 h-3.5" />}
                      {faq.tag === "processo" && <ClipboardList className="w-3.5 h-3.5" />}
                      {faq.tag === "indicacao" && <Sparkles className="w-3.5 h-3.5" />}
                      {faq.tag === "local" && <MapPin className="w-3.5 h-3.5" />}
                      <span>
                        {faq.tag === "seguranca" && "Rigor Clínico Garantido"}
                        {faq.tag === "processo" && "Orientado a Resultados Rápidos"}
                        {faq.tag === "indicacao" && "Tratamento Baseado em Evidências"}
                        {faq.tag === "local" && "Recife (Zona Sul/Norte) e Online"}
                        {faq.tag === "preco" && "Avaliação Ética Personalizada"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Badge support details */}
        <div className="mt-12 p-4 bg-neutral-900 border border-neutral-850/80 rounded flex items-start gap-3.5 max-w-2xl mx-auto">
          <HelpCircle className="w-5 h-5 text-petroleo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold font-display text-neutral-200">
              Tem alguma outra pergunta específica sobre seu caso?
            </span>
            <p className="text-[11.5px] text-neutral-400 leading-relaxed font-sans">
              Cada mente possui um funcionamento único. Se você possui histórico de outros transtornos ou quer tirar dúvidas sob absoluto sigilo direto com Hiarley, clique para conversar no WhatsApp gratuitamente.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
