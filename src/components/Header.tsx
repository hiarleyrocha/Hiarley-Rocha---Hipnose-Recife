/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Menu, X, Shield, PhoneCall, CalendarDays, ExternalLink, ChevronRight, ChevronDown, Info, Layers, Award, MapPin, AlertOctagon, Compass, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenBooking: (message?: string) => void;
  onOpenAssessment: () => void;
}

export default function Header({ onOpenBooking, onOpenAssessment }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-neutral-950/85 backdrop-blur-md border-b border-petroleo-900/40 shadow-xl shadow-black/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col cursor-pointer group"
          >
            <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white select-none">
              HIARLEY <span className="text-petroleo-400 group-hover:text-petroleo-300 transition-colors">ROCHA</span>
            </span>
            <span className="font-sans text-[9px] tracking-[0.2em] font-medium text-neutral-400 uppercase">
              Hipnoterapia Avançada
            </span>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Desktop menu">
            <button
              onClick={() => scrollToSection("introducao")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Identificação
            </button>
            <button
              onClick={() => scrollToSection("sintomas-invisiveis")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Dores Invisíveis
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("metodo")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Método
            </button>
            <button
              onClick={() => scrollToSection("autoridade")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Hiarley
            </button>
            <button
              onClick={() => scrollToSection("localizacao")}
              className="text-[13px] font-medium tracking-wide text-neutral-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.04] hover:shadow-[0_4px_15px_rgba(0,0,0,0.55)] active:scale-95 cursor-pointer"
            >
              Localização
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenAssessment}
              className="text-[13px] font-semibold text-petroleo-300 hover:text-petroleo-200 transition-colors px-3 py-1.5 cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-petroleo-400" />
              Autoavaliação Emocional
            </button>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsCtaDropdownOpen(true)}
              onMouseLeave={() => setIsCtaDropdownOpen(false)}
            >
              <button
                onClick={() => onOpenBooking()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] border border-emerald-500/20 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Agendar Avaliação
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </button>

              {isCtaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-neutral-850">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 block uppercase">
                      Escolha um Canal de Foco
                    </span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Carrega uma mensagem pré-configurada direta
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    {[
                      {
                        title: "Atendimento Geral & Diagnóstico",
                        desc: "Consulta inicial e dúvidas sobre o tratamento em Recife.",
                        msg: "Olá Hiarley, gostaria de falar sobre o tratamento com hipnoterapia clínica e agendar uma avaliação inicial de forma online ou presencial em Recife."
                      },
                      {
                        title: "Desacelerar Mente & Ansiedade",
                        desc: "Direcionado para o controle de crises e insônia.",
                        msg: "Olá Hiarley, venho através do site para buscar auxílio focado no alívio de mente acelerada e ansiedade crônica."
                      },
                      {
                        title: "Superar Bloqueios & Traumas",
                        desc: "Reprocessamento emocional e dissolução de fobias.",
                        msg: "Olá Hiarley, gostaria de agendar um atendimento focado na superação de bloqueios pessoais e traumas que limitam minha vida."
                      },
                      {
                        title: "Esgotamento & Alta Performance",
                        desc: "Suporte imediato para executivos sob extrema pressão.",
                        msg: "Olá Hiarley, sou um profissional sob alta pressão. Preciso de suporte avançado para esgotamento mental e cansaço crônico."
                      }
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onOpenBooking(opt.msg);
                          setIsCtaDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-850 transition-colors text-xs font-sans group border-b border-neutral-950 last:border-0"
                      >
                        <span className="font-semibold text-neutral-200 group-hover:text-white block transition-colors leading-tight mb-0.5">
                          {opt.title}
                        </span>
                        <span className="text-[10.5px] text-neutral-500 group-hover:text-neutral-400 block font-light leading-snug">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-sm text-xs border border-emerald-500/20 transition-colors"
              aria-label="Quick call to action"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-300 hover:text-white p-2 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-45 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-neutral-950 border-l border-neutral-850 z-50 p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col justify-between overflow-y-auto ${
          isMobileMenuOpen ? "transform translate-x-0" : "transform translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6">
          {/* Drawer Header with Close button */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-850">
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-wider text-white select-none">
                CENTRAL DE NAVEGAÇÃO
              </span>
              <span className="font-sans text-[9px] tracking-[0.2em] font-medium text-petroleo-400 uppercase">
                Hiarley Rocha
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg active:scale-95 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with large touch targets (min-h-[48px]) and icons */}
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            <span className="text-[10px] tracking-[0.15em] font-bold text-neutral-500 uppercase pb-2 mb-1 border-b border-neutral-850/40 px-3">
              Seções Principais
            </span>
            <button
              onClick={() => scrollToSection("introducao")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Identificação</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
            <button
              onClick={() => scrollToSection("sintomas-invisiveis")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Dores Invisíveis</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Como Funciona</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
            <button
              onClick={() => scrollToSection("metodo")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Método Resgate Emocional</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
            <button
              onClick={() => scrollToSection("autoridade")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Hiarley Rocha</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
            <button
              onClick={() => scrollToSection("localizacao")}
              className="w-full text-left font-sans text-sm font-medium text-neutral-200 hover:text-white active:bg-neutral-900 px-3.5 py-3 rounded-lg transition-all cursor-pointer flex items-center justify-between group min-h-[48px] border border-transparent active:border-neutral-800/35"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-petroleo-400 group-hover:text-petroleo-300 transition-colors shrink-0" />
                <span>Localização em Recife</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-305 transition-colors" />
            </button>
          </nav>
        </div>

        {/* Action center with highly optimized quick scheduler blocks (minimum 44px each) */}
        <div className="flex flex-col gap-5 pt-5 border-t border-neutral-850 mt-6">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAssessment();
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-850 text-petroleo-300 border border-petroleo-900/40 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase text-center transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.99] active:bg-neutral-850"
          >
            <Shield className="w-4 h-4 text-petroleo-400" />
            Autoavaliação Emocional
          </button>
          
          <div className="space-y-2.5">
            <span className="text-[9px] tracking-[0.2em] font-bold text-neutral-500 uppercase block pb-1 border-b border-neutral-850/40">
              Canais de Agendamento Rápido
            </span>
            <div className="flex flex-col gap-1.5 pt-1">
              {[
                {
                  title: "Atendimento Geral",
                  msg: "Olá Hiarley, gostaria de falar sobre o tratamento com hipnoterapia clínica e agendar uma avaliação inicial de forma online ou presencial em Recife."
                },
                {
                  title: "Ansiedade & Estresse",
                  msg: "Olá Hiarley, venho através do site para buscar auxílio focado no alívio de mente acelerada e ansiedade crônica."
                },
                {
                  title: "Bloqueios & Traumas",
                  msg: "Olá Hiarley, gostaria de agendar um atendimento focado na superação de bloqueios pessoais e traumas que limitam minha vida."
                },
                {
                  title: "Alta Performance & Foco",
                  msg: "Olá Hiarley, sou um profissional sob alta pressão. Preciso de suporte imediato com hipnoterapia avançada para esgotamento mental e autocobrança crônica."
                }
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking(opt.msg);
                  }}
                  className="w-full bg-neutral-900 hover:bg-neutral-850 text-white font-medium py-3 px-3.5 border border-neutral-850 rounded-lg text-xs text-left transition-all cursor-pointer flex items-center justify-between group min-h-[46px] active:bg-neutral-800"
                >
                  <span className="text-neutral-200 font-semibold group-hover:text-white transition-colors">{opt.title}</span>
                  <PhoneCall className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-neutral-500 font-medium pt-1">
            Atendimento em Recife • Presencial & Online
          </div>
        </div>
      </div>
    </header>
  );
}
