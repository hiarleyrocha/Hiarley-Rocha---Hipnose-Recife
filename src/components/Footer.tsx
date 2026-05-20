/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, MapPin, Clock, ShieldAlert, Award, Calendar } from "lucide-react";

interface FooterProps {
  onOpenBooking: (message?: string) => void;
  onOpenAssessment: () => void;
}

export default function Footer({ onOpenBooking, onOpenAssessment }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900/80 pt-20 pb-10 text-neutral-400 font-sans text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-neutral-900">
          
          {/* Col 1: Brand details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">
                HIARLEY <span className="text-petroleo-400">ROCHA</span>
              </span>
              <p className="font-sans text-[10px] tracking-[0.2em] font-medium text-neutral-500 uppercase">
                Hipnoterapia Clínica & Reprocessamento Emocional
              </p>
            </div>
            
            <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed max-w-sm">
              Especialista em auxiliar mentes brilhantes, executivos de alta performance e pessoas sobrecarregadas a desativarem alarmes emocionais automáticos, recuperarem o foco, a calmaria e o equilíbrio através de atendimento online para todo o Brasil e presencial em Recife (Zona Sul e Zona Norte).
            </p>

            <div className="flex items-center gap-3.5 pt-2">
              <div className="p-2.5 bg-neutral-900 border border-neutral-850 rounded">
                <Award className="w-4.5 h-4.5 text-petroleo-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-300">
                  Formação de Elite Clinica
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  Certificações Internacionais com respaldo em Neurociência cognitiva
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation link shortcuts */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-xs tracking-widest text-neutral-100 uppercase pb-2 border-b border-neutral-900">
              Serviços & Navegação
            </h4>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => document.getElementById("introducao")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Mente Acelerada e Exaustão
              </button>
              <button 
                onClick={() => document.getElementById("sintomas-invisiveis")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-450 hover:text-white transition-colors cursor-pointer"
              >
                Dores & Sintomas Invisíveis
              </button>
              <button 
                onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Como funciona a Hipnose
              </button>
              <button 
                onClick={() => document.getElementById("metodo")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Método Resgate Emocional
              </button>
              <button 
                onClick={() => document.getElementById("localizacao")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-450 hover:text-white transition-colors cursor-pointer"
              >
                Localização do Consultório (Map)
              </button>
              <button 
                onClick={onOpenAssessment}
                className="text-left text-xs text-petroleo-300 hover:text-petroleo-200 font-semibold transition-colors cursor-pointer"
              >
                Realizar Diagnóstico Rápido
              </button>
              <button 
                onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Dúvidas Frequentes
              </button>
            </div>
          </div>

          {/* Col 3: Practical localization context (Pina / Boa Viagem) */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-display font-semibold text-xs tracking-widest text-neutral-100 uppercase pb-2 border-b border-neutral-900 font-bold">
              Consultório Recife & Contato
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-petroleo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-neutral-200 font-medium font-sans text-xs">
                    Atendimento Online & Presencial em Recife
                  </span>
                  <address className="not-italic text-xs text-neutral-400 leading-relaxed">
                    Consultórios na Zona Sul e Zona Norte do Recife<br />
                    Foco e reprocessamento clínico de forma presencial e virtual para todo o Brasil
                  </address>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-petroleo-400 shrink-0" />
                <span className="text-xs text-neutral-400">
                  Segunda a Sexta: 08:00 às 20:00 • Sábado (Agendamento prévio)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-petroleo-400 shrink-0" />
                <span className="text-xs text-neutral-400 hover:text-white transition-colors">
                  contato@hiarleyrocha.com.br
                </span>
              </div>
            </div>

            {/* Direct CTA shortcuts */}
            <div className="pt-3 space-y-3">
              <span className="text-[10px] tracking-widest font-mono text-neutral-500 font-bold uppercase block">
                Agendamento por foco clínico (WhatsApp):
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    label: "Agendar Atendimento Geral",
                    msg: "Olá Hiarley, gostaria de falar sobre o tratamento com hipnoterapia clínica e agendar uma avaliação inicial de forma online ou presencial em Recife."
                  },
                  {
                    label: "Foco: Mente Acelerada & Ansiedade",
                    msg: "Olá Hiarley, venho através do site para buscar auxílio focado no alívio de mente acelerada e ansiedade crônica."
                  },
                  {
                    label: "Foco: Superação de Traumas & Bloqueios",
                    msg: "Olá Hiarley, gostaria de agendar um atendimento focado na superação de bloqueios pessoais e traumas que limitam minha vida."
                  },
                  {
                    label: "Foco: Executivos & Esgotamento",
                    msg: "Olá Hiarley, sou um profissional de alta performance e gostaria de falar sobre o tratamento para esgotamento extremo e cansaço."
                  }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenBooking(item.msg)}
                    className="w-full text-left bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-850/60 hover:border-neutral-800 p-2.5 rounded-sm text-[11px] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <span className="text-emerald-500 group-hover:translate-x-1 transition-transform text-xs font-mono select-none font-bold">
                      Falar rápido →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Ethical statement & Regulatory guidelines details  */}
        <div className="pt-10 flex flex-col lg:flex-row items-start justify-between gap-6 text-[10.5px] leading-relaxed text-neutral-500">
          
          <div className="flex items-start gap-3 max-w-3xl">
            <ShieldAlert className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p>
                <strong>Nota Clínica de Responsabilidade:</strong> A hipnoterapia clínica é reconhecida e regulamentada no Brasil pelos Conselhos Federais de Medicina, Psicologia, Enfermagem e Fisioterapia como um tratamento de suporte complementar integrativo e terapêutico seguro. Os resultados de transformações individuais variam conforme o engajamento e histórico biológico de cada paciente. Nenhuma das informações veiculadas neste portal substitui diagnósticos médicos psiquiátricos formais de patologias físicas ou psíquicas complexas.
              </p>
              <p>
                CNPJ do Especialista: 48.910.835/0001-52 | Certificação Internacional e Registro de Terapeuta em Recife, Pernambuco. Todos os direitos reservados.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1 shrink-0">
            <span className="text-[11px] font-mono text-neutral-400">
              © {currentYear} Hiarley Rocha.
            </span>
            <span className="text-[10px] text-neutral-500 font-sans">
              Desenvolvido sob medida • Estética Premium
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
