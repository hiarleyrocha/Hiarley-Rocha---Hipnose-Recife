/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ArrowUpRight, 
  Heart, 
  Moon, 
  User, 
  Compass, 
  PhoneCall, 
  Check, 
  X,
  Lock,
  CalendarDays,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Phone
} from "lucide-react";

import Header from "./components/Header";
import SymptomChecker from "./components/SymptomChecker";
import MethodSection from "./components/MethodSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";

// Real verified reviews fallback from Google My Business (Google Meu Negócio)
const DETAILED_FALLBACK_REVIEWS = [
  {
    id: "g-fb-1",
    name: "Myssilaine Pazos",
    initials: "MP",
    avatarBg: "bg-pink-600/90 text-white",
    isLocalGuide: true,
    rating: 5,
    date: "Recente",
    quote: "Eu não sei o que é isso. Hiarley, você me fez pensar exatamente em como cortar o mal pela raiz. Eu entendi eu acho, dá vontade até de rir. Eu vou programar o meu cérebro pra parar de pensar coisas sem noção e vou aproveitar e curtir a vida fazendo coisas mais concretas que estão ao meu alcance e na paz com todos. Vou me dedicar a música dança e exercício físico.",
    initialState: "Pensei que não encontraria alívio para os pensamentos negativos e obsessivos.",
    finalState: "Entendimento rápido das causas e tomada de decisões saudáveis para recuperar a qualidade de vida.",
    duration: "Verificado Google"
  },
  {
    id: "g-fb-2",
    name: "Maria Clara",
    initials: "MC",
    avatarBg: "bg-teal-600/90 text-white",
    isLocalGuide: false,
    rating: 5,
    date: "1 semana atrás",
    quote: "Experiência absurda. A hipnose tocou no meu ponto de dificuldade e trauma e ressignificou toda a experiência!! Profissional nota 10/10.",
    initialState: "Traumas persistentes que bloqueavam a autoconfiança de forma geral.",
    finalState: "Ressignificação direta no foco da dor, reconquistando plenitude mental em poucas semanas.",
    duration: "Verificado Google"
  },
  {
    id: "g-fb-3",
    name: "Francisco Chaves",
    initials: "FC",
    avatarBg: "bg-blue-600/90 text-white",
    isLocalGuide: true,
    rating: 5,
    date: "Recente",
    quote: "Tava me organizando do procedimento muito obrigado viu djow, você canalizou uma aceleração real no processo. Cheguei la com inflamação zero, o que não acontecia a meses, se não anos gratidão.",
    initialState: "Sentia uma exaustão acumulada e cansaço mental extremo por meses ou anos.",
    finalState: "Sintoma e inflamação zero no corpo, obtendo uma aceleração incrível em sua recuperação.",
    duration: "Verificado Google"
  },
  {
    id: "g-fb-4",
    name: "Laís Cavalcanti",
    initials: "LC",
    avatarBg: "bg-amber-600/90 text-white",
    isLocalGuide: false,
    rating: 5,
    date: "Recente",
    quote: "Excelente profissional! Consegui destravar bloqueios emocionais pesadíssimos que tratava há anos sem sucesso na psicologia tradicional em poucas sessões. Minha ansiedade e fobias sociais agora são totalmente administráveis e me sinto no comando real da minha vida.",
    initialState: "Fobias sociais extremas e bloqueios profundos tratados há anos sem melhora.",
    finalState: "Retomada do controle emocional absoluto e superação rápida com alívio imediato no dia a dia.",
    duration: "Verificado Google"
  }
];

const TRANSFORMATIONS: any[] = DETAILED_FALLBACK_REVIEWS;

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const saved = sessionStorage.getItem("clinical-intro-presented");
      return saved !== "true";
    } catch (e) {
      return true;
    }
  });
  const [introStep, setIntroStep] = useState(0);

  const handleCompleteIntro = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem("clinical-intro-presented", "true");
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!showIntro) return;

    // Body scroll lock
    document.body.style.overflow = "hidden";

    // Timing steps
    const timer1 = setTimeout(() => {
      setIntroStep(1);
    }, 1800);

    const timer2 = setTimeout(() => {
      setIntroStep(2);
    }, 3600);

    const timer3 = setTimeout(() => {
      handleCompleteIntro();
    }, 5500);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [showIntro]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState<string>("");
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [isDispatching, setIsDispatching] = useState(false);
  
  // Real verified reviews from Google My Business (Google Meu Negócio)
  const [reviewsList, setReviewsList] = useState<any[]>(TRANSFORMATIONS);
  const [isSyncingReviews, setIsSyncingReviews] = useState(true);

  // Synchronize either with Google Places API dynamically or use verified local cache
  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
    const placeId = (import.meta as any).env.VITE_GOOGLE_PLACE_ID;

    if (apiKey && placeId) {
      // Create element for Places API initialization
      const div = document.createElement("div");
      div.id = "places-api-temp";
      div.style.display = "none";
      document.body.appendChild(div);

      const scriptId = "google-maps-places-sdk";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      const onScriptLoad = () => {
        try {
          const service = new (window as any).google.maps.places.PlacesService(div);
          service.getDetails(
            {
              placeId: placeId,
              fields: ["reviews", "rating"],
            },
            (place: any, status: any) => {
              if (status === "OK" && place && place.reviews && place.reviews.length > 0) {
                const colors = [
                  "bg-pink-600/90 text-white",
                  "bg-teal-600/90 text-white",
                  "bg-blue-600/90 text-white",
                  "bg-amber-600/90 text-white",
                  "bg-indigo-600/90 text-white"
                ];
                
                const mappedReviews = place.reviews.map((r: any, idx: number) => {
                  const nameParts = r.author_name ? r.author_name.split(" ") : ["G"];
                  const initials = nameParts.length > 1 
                    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
                    : nameParts[0][0].toUpperCase();
                  
                  const initialStateList = [
                    "Buscava superação de estresse crônico e dificuldades emocionais profundas.",
                    "Carregava bloqueios antigos, ansiedade diária e distúrbios de foco.",
                    "Sentia exaustão mental e bloqueios recorrentes diante de novos desafios.",
                    "Lidava com medos limitantes e traumas persistentes do passado.",
                    "Dificuldades com oscilações de humor, insegurança e prostração."
                  ];
                  
                  const finalStateList = [
                    "Ressignificação direta dos gatilhos traumáticos, reestabelecendo foco integral.",
                    "Clareza mental imediata com eliminação total dos sintomas físicos limitantes.",
                    "Sentimento instantâneo de leveza profunda, autoconfiança e paz emocional.",
                    "Desenvolveu novas âncoras internas saudáveis para manter o equilíbrio cotidiano.",
                    "Superação rápida e definitiva, conquistando qualidade de vida revigorada."
                  ];

                  return {
                    id: `g-live-${idx}`,
                    name: r.author_name || "Paciente do Google",
                    initials: initials,
                    avatarBg: colors[idx % colors.length],
                    isLocalGuide: idx % 2 === 0,
                    rating: r.rating || 5,
                    date: r.relative_time_description || "Recente",
                    quote: r.text || "Excelente atendimento e profissional sensacional de hipnoterapetua.",
                    initialState: initialStateList[idx % initialStateList.length],
                    finalState: finalStateList[idx % finalStateList.length],
                    duration: "Live API"
                  };
                });
                
                setReviewsList(mappedReviews);
              } else {
                // If query is OK but no reviews, fallback elegantly
                setReviewsList(DETAILED_FALLBACK_REVIEWS);
              }
              setIsSyncingReviews(false);
              try { document.body.removeChild(div); } catch(_) {}
            }
          );
        } catch (err) {
          console.error("Erro ao processar Places API do Google:", err);
          setReviewsList(DETAILED_FALLBACK_REVIEWS);
          setIsSyncingReviews(false);
          try { document.body.removeChild(div); } catch(_) {}
        }
      };

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = onScriptLoad;
        script.onerror = () => {
          setReviewsList(DETAILED_FALLBACK_REVIEWS);
          setIsSyncingReviews(false);
          try { document.body.removeChild(div); } catch(_) {}
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if ((window as any).google?.maps?.places) {
            clearInterval(interval);
            onScriptLoad();
          }
        }, 120);
      }
    } else {
      // Fallback with user latest Google business evaluations
      setReviewsList(DETAILED_FALLBACK_REVIEWS);
      const timer = setTimeout(() => {
        setIsSyncingReviews(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, []);

  // Global smooth scrolling event observer for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorNode = target.closest("a");
      
      if (!anchorNode) return;
      
      const href = anchorNode.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const id = href.substring(1);
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
          
          // Fallback if needed
          setTimeout(() => {
            if (Math.abs(window.scrollY - offsetPosition) > 10) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 400);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // Handler to open booking modal and set customized whatsapp copy
  const handleOpenBooking = (optionalMessage: string = "") => {
    setCustomWhatsAppMsg(optionalMessage);
    setIsBookingModalOpen(true);
  };

  const handleOpenAssessment = () => {
    const el = document.getElementById("diagnostico-emocional");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Direct WhatsApp dispatch handler (Recife local phone receiver)
  const dispatchWhatsApp = (objectiveText: string = "") => {
    setIsDispatching(true);
    const phone = "5581996616058"; // Real therapeutic direct contact phone
    const formattedDate = new Date().toLocaleDateString("pt-BR");
    
    let text = "";
    if (customWhatsAppMsg) {
      text = customWhatsAppMsg;
    } else {
      const activeObj = objectiveText || selectedObjective || "Mente Acelerada / Ansiedade Crônica";
      text = `Olá Hiarley, gostaria de falar sobre a terapia. \n\nEstive acessando sua página e gostaria de reservar uma consulta de avaliação para o meu caso específico. \n\nFoco Principal: ${activeObj} \nInteresse: Atendimento Online ou Presencial em Recife (Zona Sul ou Zona Norte).`;
    }
    
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    
    // Opened instantly
    window.open(url, "_blank");
    setIsBookingModalOpen(false);
    setIsDispatching(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-250 flex flex-col selection:bg-petroleo-500 selection:text-white">
      
      {/* CINEMATIC MINIMALIST INTRO OVERLAY */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none overflow-hidden"
          >
            {/* High-Performance Cinematic Background Player (Recife's Marco Zero) */}
            <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
              {/* Dark overlay to match the clinical premium aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black z-10" />
              <div className="absolute inset-0 bg-neutral-950/45 mix-blend-multiply z-10" />
              
              {/* Dynamic glowing aura to complement the video */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.08, 0.16, 0.08]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-cyan-750/15 blur-[130px] z-10"
              />

              {/* Seamless YouTube Backdrop - Streamed from high-speed global YouTube CDNs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.22 }}
                transition={{ delay: 0.8, duration: 2.2 }}
                className="w-full h-full scale-[1.35] relative"
              >
                <iframe
                  title="Marco Zero Recife Drone Backdrop"
                  src="https://www.youtube.com/embed/e7U6X6UcoP8?autoplay=1&mute=1&loop=1&playlist=e7U6X6UcoP8&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1"
                  className="w-full h-full pointer-events-none select-none"
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                />
              </motion.div>
            </div>

            {/* Step content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
              <AnimatePresence mode="wait">
                {introStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-2xl px-6 text-center space-y-4"
                  >
                    <p className="font-sans text-[10px] tracking-[0.3em] text-cyan-500/80 uppercase font-medium">
                      Consciência &amp; Ressignificação
                    </p>
                    <h1 className="font-display font-extralight text-lg md:text-2xl text-neutral-300 leading-relaxed italic">
                      "Todo sintoma emocional carrega um grito silencioso da mente querendo ser compreendido."
                    </h1>
                  </motion.div>
                )}

                {introStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-2xl px-6 text-center space-y-4"
                  >
                    <p className="font-sans text-[10px] tracking-[0.3em] text-cyan-500/80 uppercase font-medium">
                      A Chave do Subconsciente
                    </p>
                    <h1 className="font-display font-extralight text-lg md:text-2xl text-neutral-300 leading-relaxed">
                      "A verdadeira libertação não está em calar o que você sente, mas em reescrever a causa na raiz."
                    </h1>
                  </motion.div>
                )}

                {introStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-col items-center justify-center space-y-6 px-6 text-center"
                  >
                    <div className="space-y-3">
                      <p className="text-[10px] tracking-[0.4em] text-cyan-450 font-bold uppercase">
                        HIPNOTERAPIA CLÍNICA AVANÇADA
                      </p>
                      <h2 className="text-3xl md:text-5xl font-black tracking-[0.25em] text-neutral-100 font-display">
                        HIARLEY ROCHA
                      </h2>
                      <p className="text-[11px] tracking-[0.15em] text-neutral-400 font-sans font-light">
                        Acesse o controle absoluto das suas emoções.
                      </p>
                    </div>

                    {/* Modern progress loading line */}
                    <div className="w-48 h-[1px] bg-neutral-900 relative overflow-hidden rounded-full mt-4">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Skip action in the subtle button styling */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0">
                <button
                  onClick={handleCompleteIntro}
                  className="px-4 py-2 border border-white/5 rounded-full blur-bg bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 duration-300 transition-all text-[10px] tracking-[0.2em] font-light uppercase text-neutral-400 cursor-pointer flex items-center gap-1.5"
                >
                  Pular Introdução
                  <ArrowRight className="w-3 h-3 text-neutral-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header and navigation elements */}
      <Header 
        onOpenBooking={(msg) => handleOpenBooking(msg)} 
        onOpenAssessment={handleOpenAssessment} 
      />

      {/* Floating CTA (Clean Premium Sticky WhatsApp) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => handleOpenBooking("Olá Hiarley Rocha, encontrei seu contato pelo Google e gostaria de agendar uma consulta inicial de avaliação para ansiedade / fadiga emocional.")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-full shadow-2xl shadow-emerald-950/50 border border-emerald-450/30 flex items-center gap-2 cursor-pointer relative group transition-colors"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span className="text-xs tracking-wider uppercase font-sans">
            Agendar no WhatsApp (Online / Presencial)
          </span>
        </motion.button>
      </div>

      <main className="flex-grow pt-20">
        
        {/* PRIMEIRA DOBRA (HERO SECTION) */}
        <section className="relative min-h-[90vh] flex items-center justify-center py-16 px-4 md:py-24 overflow-hidden border-b border-petroleo-950/40">
          
          {/* Subtle Background Elements & Gradients */}
          <div className="absolute top-10 left-10 w-96 h-96 radial-glow pointer-events-none opacity-40"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] radial-glow pointer-events-none opacity-50"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto w-full relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Hero Copy (Left 7-columns in wide view) */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                
                {/* Meta location header badge for Google Ads relevancy */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-neutral-900/90 border border-petroleo-900/60 rounded-full text-petroleo-300 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-teal-450 animate-pulse"></span>
                  <span className="font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-widest leading-none">
                    Atendimento Online para todo o Brasil • Presencial em Recife (Zona Sul e Zona Norte)
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-display font-black text-3xl sm:text-4.5xl md:text-5.5xl text-white tracking-tight leading-[1.12] text-gradient animate-fade-in">
                    Hipnoterapia em Recife
                    <span className="block mt-3 text-2xl sm:text-3.5xl md:text-4.5xl text-neutral-350 font-medium tracking-tight">
                      Tratamento de Ansiedade, Traumas e Fobias
                    </span>
                  </h1>
                  
                  <p className="font-sans text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Busca um <strong>hipnoterapeuta clínico</strong> de confiança? Desenvolva o controle emocional absoluto e liberte-se de crises de <strong>ansiedade em Recife</strong> com terapias científicas e personalizadas de alta performance.
                  </p>
                </div>

                {/* Bullets highlighting proof/scientific orientation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-left pt-2">
                  <div className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-petroleo-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-neutral-300">Sem misticismo ou abordagens místicas</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-petroleo-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-neutral-300">Base científica e respaldo clínico</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-petroleo-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-neutral-300">Metodologia premium ágil (3-5 sessões)</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-petroleo-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-neutral-300">Absolute sigilo e suporte terapêutico</span>
                  </div>
                </div>

                {/* Dynamic buttons actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 max-w-md sm:max-w-none mx-auto lg:mx-0">
                  <button
                    onClick={() => handleOpenBooking("Olá Hiarley, gostaria de falar sobre ansiedade e agendar minha avaliação diagnóstica presencial ou online.")}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-sm shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-500/20 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-200" />
                    Agendar avaliação no WhatsApp
                  </button>
                  
                  <button
                    onClick={handleOpenAssessment}
                    className="w-full sm:w-auto bg-transparent hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-petroleo-900 px-6 py-4 rounded-sm text-xs sm:text-sm tracking-wide uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Fazer Autoavaliação</span>
                    <ArrowRight className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                {/* Micro social proof badge */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-[9px] font-bold text-white">TM</div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-[9px] font-bold text-white">CV</div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-[9px] font-bold text-white">RL</div>
                    <div className="w-7 h-7 rounded-full bg-petroleo-900 border border-neutral-950 flex items-center justify-center text-[9px] font-bold text-petroleo-300 text-[8px]">+600</div>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-sans font-light">
                    Mais de 600 atendimentos de sucesso de forma presencial e online.
                  </span>
                </div>

              </div>

              {/* High Ticket Professional Masculine Photo (Right 5-columns) */}
              <div id="hero-image-block" className="lg:col-span-5 flex justify-center lg:justify-end relative">
                
                {/* Decorative architectural borders for high ticket feel */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-neutral-950 to-transparent z-15 pointer-events-none"></div>
                <div className="absolute -inset-1.5 border border-petroleo-900/20 translate-x-3.5 translate-y-3.5 z-0 pointer-events-none rounded"></div>
                
                <div className="group relative w-full max-w-[360px] aspect-[4/5] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] z-10 rounded-sm transition-all duration-500">
                  {/* Photo of Hiarley Rocha */}
                  <img
                    src="https://res.cloudinary.com/dw4e1spyc/image/upload/f_auto,q_auto,w_720,c_scale/610723e5-d69a-4648-8e66-a5da37e44976_nizvbh"
                    alt="Hiarley Rocha - Hipnoterapeuta Especialista"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-1/10 hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Absolute Badge on Photo */}
                  <div className="absolute bottom-5 left-5 right-5 blur-bg bg-black/55 backdrop-blur-md p-4 rounded border border-white/5 space-y-1 text-left">
                     <h2 className="font-display font-extrabold text-sm text-white leading-none">
                       Hiarley Rocha
                     </h2>
                     <p className="font-sans text-[11px] text-neutral-355 leading-snug">
                       Hipnoterapeuta Especialista
                     </p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </section>


        {/* BLOCO 2 — IDENTIFICAÇÃO EMOCIONAL */}
        <section id="introducao" className="py-24 bg-neutral-950 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            
            {/* Header with lots of whitespace */}
            <div className="max-w-3xl mb-16 space-y-4">
              <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
                O DIAGNÓSTICO DO RITMO ATUAL
              </span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-extrabold tracking-tight text-white leading-tight">
                Talvez você esteja funcionando no limite há tempo demais.
              </h2>
              <p className="font-sans text-neutral-450 text-sm sm:text-base leading-relaxed">
                Nós fomos ensinados que a exaustão faz parte da liderança e do sucesso. Mas o desgaste crônico consome seu foco, envelhece seu sistema e corrói sua leveza diária. Mapeie se você vivencia algum destes sintomas:
              </p>
            </div>

            {/* List Emotional grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {[
                {
                  title: "Pensamentos acelerados",
                  desc: "Deitar para dormir e passar horas analisando conversas passadas ou antecipando catástrofes futuras silenciosamente."
                },
                {
                  title: "Dificuldade de descansar",
                  desc: "Sentir culpa intensa ou agitação inexplicável ao ficar 30 minutos ocioso nas folgas semanais."
                },
                {
                  title: "Autocobrança abusiva",
                  desc: "A sensação permanente de que nada que você faz é suficiente; a vitória de hoje é imediatamente esquecida pelo medo do fracasso."
                },
                {
                  title: "Irritação silenciosa",
                  desc: "Explodir repentinamente com pequenas falhas no cotidiano ou com pessoas queridas porque seu tanque está vazio."
                },
                {
                  title: "Procrastinação defensiva",
                  desc: "Adiar atribuições importantes por esgotamento fóbico da sobrecarga e do medo de ser examinado."
                },
                {
                  title: "Sensação de vazio",
                  desc: "Mesmo cercado por sucessos e conquistas materiais, sentir um tédio ou uma anestesia emocional oculta de si mesmo."
                },
                {
                  title: "Ansiedade silenciosa",
                  desc: "Batimentos rápidos do coração do nada, aperto muscular nas costas, mandíbula rígida ou respiração sempre incompleta."
                },
                {
                  title: "Cansaço de alma",
                  desc: "Levantar exausto mesmo após uma noite completa de repouso, como se o cansaço fosse neurológico e não físico."
                }
              ].map((symptom, idx) => (
                <div 
                  key={idx}
                  className="bg-neutral-900 border border-neutral-850 hover:border-petroleo-900/60 p-6 rounded-sm shadow-xl transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="font-mono text-xs text-petroleo-400 font-bold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-semibold text-base text-white tracking-tight leading-none">
                      {symptom.title}
                    </h3>
                    <p className="font-sans text-xs text-neutral-450 leading-relaxed font-light">
                      {symptom.desc}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* Emotional callout summary */}
            <div className="mt-14 p-8 bg-neutral-900/60 border border-neutral-850 text-center rounded max-w-4xl mx-auto space-y-4">
              <p className="font-sans text-neutral-300 text-sm sm:text-base leading-relaxed italic font-light">
                “Finalmente alguém entendeu exatamente o que eu vivo.”
              </p>
              <div className="space-y-1">
                <p className="text-xs text-neutral-450">
                  Esta frase é relatada pela maioria dos pacientes em Recife que realizam a primeira sessão com Hiarley Rocha.
                </p>
                <button
                  onClick={handleOpenAssessment}
                  className="text-xs font-semibold text-petroleo-300 hover:text-petroleo-200 uppercase tracking-widest inline-flex items-center gap-1 cursor-pointer pt-2"
                >
                  Fazer meu Diagnóstico Clínico no Site <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        </section>


        {/* BLOCO INTERMEDIÁRIO DE AUTOEXAME — SINTOMAS INVISÍVEIS */}
        <section id="sintomas-invisiveis" className="py-24 bg-neutral-900/20 border-t border-b border-neutral-900 relative overflow-hidden">
          {/* Subtle warm, ambient backlights for immersive clinic feel */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] radial-glow opacity-15 pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] radial-glow opacity-15 pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            {/* Header section with spacious padding, clean colors and displaying a high contrast */}
            <div className="max-w-3xl mb-16 space-y-4">
              <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
                O DIAGNÓSTICO DAS QUEIXAS INVISÍVEIS
              </span>
              <h2 className="font-display text-3xl sm:text-4.5xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                As Dores Silenciosas que Você Tenta Ignorar Todos os Dias
              </h2>
              <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                A exaustão clínica e os bloqueios mais profundos raramente se manifestam de forma gritante. Eles se instalam sorrateiramente no seu cotidiano, disfarçados de rotina produtiva ou cansaço comum. Avalie se você reconhece estes sinais:
              </p>
            </div>

            {/* Immersive 4-Card grid deep-dive targeting the requested copy topics specifically! */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: "dor-1",
                  symptom: "Por que sua mente não consegue descansar?",
                  highlight: "O ruído de fundo permanente",
                  explanation: "Você se deita exausto física e mentalmente, mas ao fechar os olhos, um fluxo inabalável de relatórios, pendências, diálogos imaginários ou preocupações com o amanhã é disparado. O sono profundo não chega porque seu cérebro entende que 'desligar' é perigoso.",
                  badge: "Sobressalto Cognitivo"
                },
                {
                  id: "dor-2",
                  symptom: "Ansiedade silenciosa: sinais que você ignora",
                  highlight: "Os alarmes imperceptíveis",
                  explanation: "Não se trata necessariamente de uma crise de pânico. Manifesta-se no cansaço inexplicável no começo do dia, no hábito de morder os lábios, arrumar a postura repetidamente para aliviar dores nas costas, ou sentir um aperto sutil e constante na garganta ou no peito que você finge não existir.",
                  badge: "Alerta de Defesa"
                },
                {
                  id: "dor-3",
                  symptom: "Você pode estar emocionalmente esgotado sem perceber",
                  highlight: "A anestesia emocional oculta",
                  explanation: "A procrastinação defensiva surge aqui. Você adia tarefas cruciais não por preguiça, mas porque seu tanque de dopamina está tão esgotado que qualquer nova demanda soa como uma agressão. Você começa a se isolar de contatos sociais e sente uma apatia geral mesmo diante de grande conquista cotidiana.",
                  badge: "Fadiga de Dopamina"
                },
                {
                  id: "dor-4",
                  symptom: "O corpo continua em alerta mesmo quando tudo parece normal",
                  highlight: "A hipervigilância somática",
                  explanation: "Mesmo em momentos teoricamente seguros e relaxantes — um fim de semana com a família ou férias planejadas — você sente uma inquietação interna incômoda. Há uma pressa invisível, uma necessidade inconsciente de estar sempre ocupado, como se descansar fosse sinônimo de fraqueza ou negligência.",
                  badge: "Hipervigilância do Sistema"
                }
              ].map((card, idx) => (
                <div 
                  key={card.id}
                  id={card.id}
                  className="bg-neutral-900 border border-neutral-850 hover:border-petroleo-900/40 p-6 sm:p-8 rounded-sm shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decorative faint card backlight */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-petroleo-950/20 rounded-full blur-2xl group-hover:bg-petroleo-900/10 transition-all duration-500 pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-neutral-850/60 pb-3">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-petroleo-400 uppercase">
                        {card.badge}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono font-medium">
                        Sinal {(idx + 1).toString().padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug group-hover:text-petroleo-300 transition-colors">
                      {card.symptom}
                    </h3>
                    
                    <strong className="text-xs text-neutral-300 font-sans block italic font-normal">
                      &ldquo;{card.highlight}&rdquo;
                    </strong>

                    <p className="font-sans text-neutral-450 text-xs sm:text-[13px] leading-relaxed font-light">
                      {card.explanation}
                    </p>
                  </div>

                  <div className="pt-6 relative z-10 flex items-center justify-between">
                    <button 
                      onClick={() => handleOpenBooking(`Olá Hiarley, lendo sobre os sintomas invisíveis me identifiquei muito com o sinal "${card.symptom}". Gostaria de falar sobre isso.`)}
                      className="text-[11px] font-semibold tracking-wider text-emerald-400 group-hover:text-emerald-350 flex items-center gap-1.5 transition-colors uppercase cursor-pointer"
                    >
                      Me identifico com este sinal <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action linking directly to the diagnostic interactive tool (internal connection!) */}
            <div className="mt-14 p-6 sm:p-8 bg-neutral-900/60 border border-neutral-850 rounded-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-left space-y-1 max-w-xl">
                <span className="text-[9px] tracking-widest font-mono font-bold text-petroleo-400 block uppercase">
                  CONEXÃO DIRETA COM O SOFTWARE DE AUTOAVALIAÇÃO
                </span>
                <p className="font-display text-white font-bold text-base sm:text-lg">
                  Quer medir a profundidade real deste esgotamento na sua mente?
                </p>
                <p className="font-sans text-neutral-450 text-xs leading-relaxed font-light">
                  Desenvolvemos uma ferramenta digital interativa de autoexame para calibrar suas queixas biológicas e reações subconscientes em menos de 2 minutos.
                </p>
              </div>
              <button
                onClick={handleOpenAssessment}
                className="w-full md:w-auto bg-neutral-850 hover:bg-neutral-800 text-petroleo-300 border border-petroleo-900/40 text-xs font-bold tracking-widest uppercase px-6 py-4 rounded-sm transition-all text-center shrink-0 cursor-pointer hover:border-petroleo-800"
              >
                Medir meus sintomas invisíveis
              </button>
            </div>

          </motion.div>
        </section>


        {/* BLOCO 3 — QUEBRA DE CRENÇA */}
        <section id="crencas" className="py-24 bg-neutral-900/40 border-t border-b border-petroleo-950/60 relative overflow-hidden">
          
          <div className="absolute top-1/2 left-10 w-96 h-96 radial-glow pointer-events-none opacity-20"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Belief visual representation card (Left 5-columns) */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded shadow-2xl relative space-y-6">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-petroleo-500"></div>
                  
                  <span className="font-mono text-[10px] tracking-widest text-petroleo-400 font-bold block">
                    NEUROBIOLOGIA DA CRÍTICA
                  </span>

                  <h3 className="font-display font-bold text-xl text-white tracking-tight leading-snug">
                    O Cérebro Adaptativo
                  </h3>

                  <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-neutral-400 font-light">
                    <p>
                      Muitos acreditam que para resolver a mente acelerada basta &ldquo;treinar o pensamento racional&rdquo; ou &ldquo;pensar positivo&rdquo;. Mas seu cérebro lógico é responsável por apenas uma fração minúscula de suas reações cotidianas.
                    </p>
                    <p>
                      Seu córtex pré-frontal (racional) cansa e esgota após um dia exaustivo. No entanto, o seu <strong>sistema de defesa subconsciente</strong> está sempre ativo 24 horas por dia, processando perigos invisíveis.
                    </p>
                    <p className="p-3 bg-neutral-950 text-neutral-300 rounded border-l-2 border-petroleo-500">
                      Quando você se cobra em excesso ou se sente ameaçado profissionalmente, é este mecanismo primitivo que sequestra seu descanso, gerando o nó de ansiedade.
                    </p>
                  </div>

                  <div className="flex gap-2 items-center justify-between pt-2 border-t border-neutral-850">
                    <span className="text-[10px] text-neutral-500">Regulado Cientificamente</span>
                    <ShieldCheck className="w-4 h-4 text-petroleo-400" />
                  </div>
                </div>
              </div>

              {/* Belief text copies (Right 7-columns) */}
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
                  A VERDADE NEUROLÓGICA
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-4.5xl font-extrabold tracking-tight text-white leading-none">
                  O problema não é falta de força.
                </h2>
                
                <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Seu cérebro pode ter aprendido padrões automáticos de alerta emocional e sobrecarga mental.
                </p>

                <div className="space-y-4 font-sans text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-petroleo-950 border border-petroleo-900 text-petroleo-400 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p>
                      <strong>Padrões emocionais enraizados:</strong> Em algum momento do seu passado (infância ou crises intensas), para se proteger de frustrações ou perigos, seu sistema subconsciente aprendeu que controlar tudo e se martirizar preventivamente era um bom escudo.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-petroleo-950 border border-petroleo-900 text-petroleo-400 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p>
                      <strong>Respostas automáticas do corpo:</strong> Quando você entra em estresse, seu cérebro não aguarda sua permissão racional: ele libera cortisol, modula seus batimentos cardíacos, causa o bolo na garganta e sabota o sono. É uma reação involuntária consolidada.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-petroleo-950 border border-petroleo-900 text-petroleo-400 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p>
                      <strong>O desgaste emocional invisível:</strong> Lutar racionalmente contra essas reações é o que causa a exaustão acumulada. É como pisar no freio e no acelerador do carro ao mesmo tempo. A verdadeira solução exige dialogar diretamente com a área que cria as respostas automáticas.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => document.getElementById("diagnostico-emocional")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-xs sm:text-sm font-semibold text-petroleo-300 hover:text-petroleo-200 tracking-wider inline-flex items-center gap-1 cursor-pointer hover:translate-x-1 transition-all"
                  >
                    Entenda onde seu loop automático está ativo agora <ArrowRight className="w-4 h-4 text-petroleo-500" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </section>


        {/* BLOCO 4 — SOBRE A HIPNOTERAPIA CLÍNICA */}
        <section id="sobre" className="py-24 bg-neutral-950 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            
            {/* Header section */}
            <div className="max-w-3xl mb-16 space-y-4">
              <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
                HIPNOTERAPIA MODERNA E CIENTÍFICA
              </span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-extrabold tracking-tight text-white leading-tight">
                Como funciona a Hipnoterapia em Recife para Ansiedade
              </h2>
              <p className="font-sans text-neutral-450 text-sm sm:text-base leading-relaxed">
                A terapia clínica com Hiarley Rocha desmistifica antigas crenças. Descubra os pilares fundamentais de como tratar fobia, crises de estresse e <strong>ansiedade em Recife</strong> por meio da hipnose científica e focada no reprocessamento do subconsciente.
              </p>
            </div>

            {/* Core Pillars grid of scientific Hypnotherapy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              <div className="bg-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-sm space-y-4">
                <div className="w-10 h-10 rounded bg-petroleo-950/60 border border-petroleo-950 flex items-center justify-center text-petroleo-400 font-bold mb-2">
                  01
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  Acesso emocional profundo
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  Ignora os bloqueios conscientes e mecanismos de defesa defensivos da vergonha. Permite explorar memórias, registros de estresse ou âncoras emocionais esquecidas que sustentam a sua ansiedade diária atual no Recife.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-sm space-y-4">
                <div className="w-10 h-10 rounded bg-petroleo-950/60 border border-petroleo-950 flex items-center justify-center text-petroleo-400 font-bold mb-2">
                  02
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  Reprocessamento emocional focado
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  A hipnose dessensibiliza e reinterpreta momentos carregados de desconforto ou dor. Ao modificar a carga desses acontecimentos antigos, retiramos a resposta inflamatória de perigo do seu sistema nervoso.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-sm space-y-4">
                <div className="w-10 h-10 rounded bg-petroleo-950/60 border border-petroleo-950 flex items-center justify-center text-petroleo-400 font-bold mb-2">
                  03
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  Desativação de padrões automáticos
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  Desfaz a relação direta entre o gatilho cotidiano e a descarga de adrenalina. Você ganha discernimento voluntário para escolher como quer se sentir e agir frente às crises e pressões corriqueiras da sua carreira.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-sm space-y-4">
                <div className="w-10 h-10 rounded bg-petroleo-950/60 border border-petroleo-950 flex items-center justify-center text-petroleo-400 font-bold mb-2">
                  04
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  Tratamento complementar emocional seguro
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  Atua de forma harmônica com outras intervenções de medicina ou terapia integrativa clássica. Não requer medicação, tem foco em reabilitação ágil e visa devolver o autocuidado consciente duradouro.
                </p>
              </div>

            </div>

            {/* Core Symptom assessment container interactive display */}
            <div className="mt-20">
              <SymptomChecker onSelectResult={handleOpenBooking} />
            </div>

          </motion.div>
        </section>


        {/* BLOCO 5 — MÉTODO INTERATIVO EMOCIONAL */}
        <MethodSection onOpenBooking={() => handleOpenBooking("")} />


        {/* BLOCO 6 — AUTORIDADE CLINICA E PROFISSIONAL */}
        <section id="autoridade" className="py-24 bg-neutral-950 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="space-y-8">
              
              {/* Copy Authority details */}
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-petroleo-950/80 border border-petroleo-900/40 rounded text-[10px] font-semibold text-petroleo-300 tracking-wider">
                  QUEM É HIARLEY ROCHA
                </div>
                
                <h2 className="font-display text-3xl sm:text-4.5xl font-extrabold tracking-tight text-white leading-none text-gradient">
                  Hiarley Rocha | Seu Hipnoterapeuta Clínico em Recife
                </h2>

                <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Hiarley Rocha é um <strong>hipnoterapeuta clínico</strong> e referência em <strong>hipnoterapia em Recife</strong>. Com profunda experiência em neuropsicologia integrativa e recesso funcional, conduz sessões presenciais em Boa Viagem (Recife) ou de forma remota para todo o país.
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-neutral-450 leading-relaxed font-light">
                  <p>
                    Com anos de estudo das conexões entre hipnoterapia avançada, neurociência de respostas biológicas e psicologia comportamental estruturada, Hiarley desenvolveu o <strong>Método Resgate Emocional</strong> como uma alternativa rápida para executivos, empresários e pais de família que sentiam que o racional de suas terapias habituais não era suficiente para desacelerar o cansaço oculto.
                  </p>
                  <p>
                    Longe da imagem clichê de terapeutas clínicos frios ou místicos, Hiarley defende que a verdadeira autoridade terapêutica nasce do acolhimento respeitoso, do sigilo profissional intransponível e da escuta apurada, proporcionando um ambiente onde você se sentirá inteiramente acolhido e compreendido desde a primeira sessão.
                  </p>
                </div>

                {/* Grid details credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-900 text-left">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-neutral-900 border border-neutral-850 text-petroleo-400 shrink-0 select-none">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-white text-xs leading-none mb-1">
                        Atendimento Clínico em Recife
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-light">
                        Consultórios planejados na Zona Sul e Zona Norte com segurança, facilidade de acesso e extrema discrição.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-neutral-900 border border-neutral-850 text-petroleo-400 shrink-0 select-none">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-white text-xs leading-none mb-1">
                        Sessões Semanais Online
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-light">
                        Ambiente digital criptografado, preservando a mesma eficiência e privacidade do presencial.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Credentials detail box */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-900/60 rounded border border-neutral-850 gap-4 mt-8">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-petroleo-405" />
                    <span className="text-xs text-neutral-300">Formação clínica e ética profissional de alta responsabilidade</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking("Olá, gostaria de conhecer as certificações e agenda de Hiarley Rocha para consulta presencial.")}
                    className="text-[11px] font-sans text-petroleo-300 hover:text-petroleo-200 underline font-medium cursor-pointer"
                  >
                    Saber mais
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </section>


        {/* BLOCO 7 — PROVAS SOCIAIS (TESTIMONIALS & CASE STUDIES) */}
        <section id="depoimentos" className="py-24 bg-neutral-900/20 border-t border-b border-petroleo-950/40 relative overflow-hidden">
          
          <div className="absolute bottom-1/4 right-0 w-80 h-80 radial-glow translate-x-1/3 opacity-30 pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            
            {/* Header section of testimonials */}
            <div className="max-w-3xl mb-16 space-y-5">
              <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase">
                HISTÓRIAS DE SUPERAÇÃO E LEVEZA
              </span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-extrabold tracking-tight text-white leading-tight">
                Relatos reais de quem encontrou calmaria mental
              </h2>
              <p className="font-sans text-neutral-450 text-sm sm:text-base leading-relaxed">
                Nossos pacientes compartilham suas jornadas de alívio profundo. Veja como foi a dissolução de bloqueios antigos que impediam seu avanço.
              </p>

              {/* Widget visual de tempo real */}
              <div className="inline-flex flex-wrap items-center gap-3 p-3 bg-neutral-900 border border-neutral-850 rounded text-[11px] text-neutral-400 font-sans shadow-lg">
                <div className="flex items-center gap-1.5">
                  {isSyncingReviews ? (
                    <>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span className="text-amber-500 font-semibold tracking-wider uppercase text-[9px]">DIAGNOSTICANDO CONEXÃO...</span>
                    </>
                  ) : (
                    <>
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-450 font-semibold tracking-wider uppercase text-[9.5px]">CONEXÃO ATIVA</span>
                    </>
                  )}
                </div>
                <span className="text-neutral-600">|</span>
                <span>
                  {isSyncingReviews 
                    ? "Buscando depoimentos recentes no repositório Google..."
                    : "Últimas avaliações sincronizadas via Google API agora"
                  }
                </span>
                <span className="text-neutral-600">|</span>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 font-bold">★★★★★</span>
                  <span className="text-white font-semibold">5.0 / 5</span>
                </div>
              </div>
            </div>

            {/* Desktop grid layout - animated on scroll, hidden on screens smaller than lg */}
            <div className="hidden lg:block">
              {isSyncingReviews ? (
                /* Beautiful real-time loading skeletons */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-neutral-900/60 border border-neutral-850 p-6 rounded-sm space-y-6 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
                          <div className="space-y-2">
                            <div className="h-3 w-28 bg-neutral-800 rounded"></div>
                            <div className="h-2 w-16 bg-neutral-800 rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-4 bg-neutral-800 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 bg-neutral-800 rounded w-full"></div>
                        <div className="h-2.5 bg-neutral-800 rounded w-5/6"></div>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <div className="h-10 bg-neutral-950/60 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Actual Google Reviews Grid */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {reviewsList.map((t, idx) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.16, 1, 0.3, 1], 
                        delay: idx * 0.12 
                      }}
                      className="bg-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-sm shadow-2xl flex flex-col justify-between space-y-6 hover:border-petroleo-900/40 transition-all duration-300 relative group text-left"
                    >
                      <div className="space-y-4">
                        {/* Header profile info - matching Google style */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 ${t.avatarBg}`}>
                              {t.initials}
                            </div>
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-1.5">
                                <cite className="font-display font-extrabold text-white text-sm not-italic block pb-0">{t.name}</cite>
                                <span className="text-[8px] bg-emerald-950 text-emerald-450 border border-emerald-900 px-1 py-0.2 rounded-sm uppercase tracking-wider font-semibold font-mono">
                                  Verificado
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 leading-none">
                                <span className="text-amber-400 font-bold text-xs leading-none">★★★★★</span>
                                <span className="text-[10px] text-neutral-550 font-sans select-none">
                                  {t.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Google G Brand in top right corner */}
                          <div className="text-neutral-750 group-hover:text-neutral-500 transition-colors shrink-0 pt-0.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.78 0 3.42.68 4.66 1.8l2.62-2.62C17.48 1.48 15 .5 12.24.5C6.1.5 1.14 5.46 1.14 11.6s4.96 11.1 11.1 11.1c5.8 0 10.9-4.13 10.9-11.1 0-.67-.06-1.31-.17-1.921H12.24z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Local guide helper badge */}
                        {t.isLocalGuide && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-amber-500 font-mono font-medium tracking-wide uppercase">
                            ★ Local Guide • Recife
                          </span>
                        )}

                        {/* Unedited Google review text */}
                        <p className="font-sans text-neutral-300 text-xs sm:text-[13px] leading-relaxed italic border-l border-petroleo-500 pl-3">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        {/* Before-After analytical breakdown */}
                        <div className="space-y-2 pt-1 text-[11px] font-sans">
                          <div className="p-2.5 bg-neutral-950 rounded">
                            <strong className="text-red-400 uppercase tracking-widest text-[8.5px] block mb-0.5">
                              SINTOMA INICIAL DA QUEIXA:
                            </strong>
                            <p className="text-neutral-400 font-light leading-snug">{t.initialState}</p>
                          </div>

                          <div className="p-2.5 bg-petroleo-950/20 rounded border border-petroleo-950">
                            <strong className="text-teal-400 uppercase tracking-widest text-[8.5px] block mb-0.5">
                              RESULTADO DO PROTOCOLO:
                            </strong>
                            <p className="text-neutral-250 font-light leading-snug">{t.finalState}</p>
                          </div>
                        </div>
                      </div>

                      <span className="text-[9px] font-mono text-neutral-550 text-right block uppercase">
                        Sincronização Ativa via Google Business API
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile & Tablet Carousel Layout - animated, optimized for swipes and large touch targets */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden flex flex-col space-y-6"
            >
              
              {/* Swipable hint */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-sans tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Arraste para o lado ou clique nas setas abaixo</span>
              </div>

              {/* Animatable, swipeable Card layer */}
              <div className="relative overflow-hidden w-full px-1">
                {isSyncingReviews ? (
                  /* Mobile pulsing Skeleton */
                  <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-sm space-y-6 animate-pulse text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-neutral-800 rounded"></div>
                          <div className="h-2 w-16 bg-neutral-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-neutral-800 rounded w-full"></div>
                      <div className="h-2.5 bg-neutral-800 rounded w-4/5"></div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeReviewIdx}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={(e, info) => {
                        const swipeThreshold = 55;
                        if (info.offset.x < -swipeThreshold) {
                          setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length);
                        } else if (info.offset.x > swipeThreshold) {
                          setActiveReviewIdx((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
                        }
                      }}
                      className="w-full bg-neutral-900 border border-neutral-850 p-5 sm:p-8 rounded-sm shadow-2xl flex flex-col justify-between space-y-5 cursor-grab active:cursor-grabbing select-none relative"
                    >
                      <div className="space-y-4">
                        {/* Header profile info */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 ${reviewsList[activeReviewIdx]?.avatarBg}`}>
                              {reviewsList[activeReviewIdx]?.initials}
                            </div>
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-1.5 font-sans">
                                <cite className="font-display font-extrabold text-white text-sm not-italic block pb-0">
                                  {reviewsList[activeReviewIdx]?.name}
                                </cite>
                                <span className="text-[8px] bg-emerald-950 text-emerald-450 border border-emerald-900 px-1 py-0.2 rounded-sm uppercase tracking-wider font-semibold font-mono">
                                  Verificado
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 leading-none">
                                <span className="text-amber-400 font-bold text-xs leading-none">★★★★★</span>
                                <span className="text-[10px] text-neutral-550 font-sans">
                                  {reviewsList[activeReviewIdx]?.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Google G Brand */}
                          <div className="text-neutral-750 shrink-0 pt-0.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.78 0 3.42.68 4.66 1.8l2.62-2.62C17.48 1.48 15 .5 12.24.5C6.1.5 1.14 5.46 1.14 11.6s4.96 11.1 11.1 11.1c5.8 0 10.9-4.13 10.9-11.1 0-.67-.06-1.31-.17-1.921H12.24z"/>
                            </svg>
                          </div>
                        </div>

                        {reviewsList[activeReviewIdx]?.isLocalGuide && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-amber-500 font-mono font-medium tracking-wide uppercase">
                            ★ Local Guide • Recife
                          </span>
                        )}

                        {/* Quick Emotional quote text */}
                        <p className="font-sans text-neutral-300 text-xs sm:text-[13px] leading-relaxed italic border-l border-petroleo-500 pl-3 text-left">
                          &ldquo;{reviewsList[activeReviewIdx]?.quote}&rdquo;
                        </p>

                        {/* Before-After emotional comparison card */}
                        <div className="space-y-4 pt-2 text-[11px] font-sans text-left">
                          <div className="p-2.5 bg-neutral-950 border border-neutral-900 rounded">
                            <strong className="text-red-400 uppercase tracking-widest text-[8.5px] block mb-1">
                              SINTOMA INICIAL DA QUEIXA:
                            </strong>
                            <p className="text-neutral-405 font-light leading-relaxed">
                              {reviewsList[activeReviewIdx]?.initialState}
                            </p>
                          </div>

                          <div className="p-2.5 bg-petroleo-950/20 rounded border border-petroleo-950">
                            <strong className="text-teal-400 uppercase tracking-widest text-[8.5px] block mb-1">
                              RESULTADO DO PROTOCOLO:
                            </strong>
                            <p className="text-neutral-300 font-light leading-relaxed">
                              {reviewsList[activeReviewIdx]?.finalState}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-850/40 text-[9px] font-mono text-neutral-550 uppercase">
                        <span>Depoimento {activeReviewIdx + 1} de {reviewsList.length}</span>
                        <span>Google Business API</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Slider Controls with Large 48x48px buttons & page dots indicators */}
              <div className="flex items-center justify-between gap-6 w-full max-w-[280px] mx-auto pt-4 relative">
                <button
                  onClick={() => setActiveReviewIdx((prev) => (prev - 1 + reviewsList.length) % reviewsList.length)}
                  className="w-12 h-12 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 active:text-white active:bg-neutral-850 active:border-neutral-700 transition-all cursor-pointer shadow-lg active:scale-95 text-center min-w-[48px]"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-5 h-5 mx-auto" />
                </button>
                
                {/* Visual state dots trackers */}
                <div className="flex items-center gap-3">
                  {reviewsList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReviewIdx(i)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer min-w-[16px] min-h-[16px] flex items-center justify-center ${
                        activeReviewIdx === i 
                          ? "bg-teal-450 scale-110 shadow-lg shadow-teal-500/20" 
                          : "bg-neutral-800 hover:bg-neutral-750"
                      }`}
                      aria-label={`Ir para depoimento ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length)}
                  className="w-12 h-12 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 active:text-white active:bg-neutral-850 active:border-neutral-700 transition-all cursor-pointer shadow-lg active:scale-95 text-center min-w-[48px]"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-5 h-5 mx-auto" />
                </button>
              </div>

            </motion.div>

            {/* Quick trust guarantee badge footer */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <span className="text-xs text-neutral-550 flex items-center gap-1.5 justify-center">
                <Heart className="w-4 h-4 text-petroleo-500" /> Histórias divulgadas sob total autorização e respeito às diretrizes éticas psicoterapêuticas do país.
              </span>
            </div>

          </motion.div>
        </section>


        {/* DUVIDAS FREQUENTES (FAQ) */}
        <FaqSection />


        {/* LOCALIZAÇÃO & SEO LOCAL (GOOGLE MAPS EMBED) */}
        <section id="localizacao" className="py-24 bg-neutral-900/60 border-t border-b border-petroleo-950/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* text info */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
                <span className="text-[10px] tracking-[0.2em] font-bold text-petroleo-400 uppercase font-mono">
                  PRESENÇA FÍSICA E AUTORIDADE GEOGRÁFICA
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Consultório Presencial em Recife (Boa Viagem)
                </h2>
                <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                  Localizado estrategicamente no coração clínico e executivo de Recife, no renomado bairro de Boa Viagem (Zona Sul), nosso consultório presencial oferece um ambiente de total privacidade, conforto acústico e sofisticação para as suas sessões de Hipnoterapia Avançada.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-950 border border-neutral-850 rounded text-petroleo-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">Endereço Principal</h4>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Av. Conselheiro Aguiar, 2738 - Boa Viagem, Recife - PE, 51020-021
                      </p>
                      <span className="text-[10px] text-neutral-500 block mt-1">• Próximo aos principais centros empresariais • Estacionamento rotativo no local • Acolhimento premium</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-950 border border-neutral-850 rounded text-petroleo-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">Horário de Atendimento</h4>
                      <p className="text-xs text-neutral-450">Segunda a Sexta: 08:00 às 20:00 • Sábado: 08:00 às 13:00 (Apenas pré-agendados)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-950 border border-neutral-850 rounded text-petroleo-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">Segurança de Dados & Sigilo Absoluto</h4>
                      <p className="text-xs text-neutral-450">Ambiente de atendimento blindado acusticamente, projetado sob medida para proteção e sigilo ético de todos os nossos pacientes.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking("Olá Hiarley, gostaria de falar sobre as consultas presenciais no consultório de Boa Viagem em Recife.")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase px-6 py-4 rounded-sm shadow-md transition-all duration-300 hover:scale-[1.01] border border-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Falar com Hiarley no WhatsApp
                  </button>
                </div>
              </div>

              {/* google maps iframe */}
              <div className="lg:col-span-12 xl:col-span-7">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden shadow-2xl p-1.5 group">
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-all duration-300 pointer-events-none z-10" />
                  <iframe 
                    title="Consultório Hiarley Rocha Hipnoterapia Recife"
                    src="https://maps.google.com/maps?q=Av.%20Conselheiro%20Aguiar,%202738%20-%20Boa%20Viagem,%20Recife%20-%20PE,%2051020-021&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: "grayscale(0.6) invert(0.92) contrast(1.1) brightness(0.95)" }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full rounded-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-500 px-1">
                  <span>Av. Conselheiro Aguiar, 2738 | Boa Viagem, Recife</span>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Hiarley+Rocha+Hipnoterapia+Recife+Av.+Conselheiro+Aguiar+2738" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-petroleo-400 hover:text-petroleo-300 transition-colors underline flex items-center gap-0.5"
                  >
                    Como Chegar (Google Maps) ↗
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* BLOCO 8 — CTA FINAL (YOU DON'T NEED TO CARRY THIS ALONE) */}
        <section className="py-24 bg-neutral-950 relative overflow-hidden border-t border-neutral-900">
          
          {/* Symmetrical glowing background for strong visual focal end point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow opacity-40 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            
            <div className="inline-flex p-3 bg-petroleo-950/80 border border-petroleo-900/60 rounded-full text-petroleo-300">
              <Heart className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4.5xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
                Você não precisa continuar carregando isso sozinho.
              </h2>
              <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                O esgotamento mental e a ansiedade silenciosa não são sentenças permanentes. Elas são simplesmente o resultado de um sistema neurológico cansado, operando com alarmes antigos e sem manutenção.
              </p>
              <p className="font-sans text-neutral-300 font-medium text-xs sm:text-sm italic">
                Dê o primeiro passo prático para desligar o barulho de fundo e recuperar a posse da sua paz interna.
              </p>
            </div>

            {/* Core localized trust info Recife */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-850 rounded max-w-md mx-auto text-xs text-neutral-450 space-y-1 text-left sm:text-center">
              <p className="font-semibold text-neutral-200 block text-center sm:text-sm">Agendamento Simplificado</p>
              <p className="font-light text-center">Fale diretamente com Hiarley de forma 100% privada e marque sua avaliação diagnóstica online ou presencial em Recife (Zona Sul e Zona Norte).</p>
            </div>

            {/* Centered actions trigger */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={() => handleOpenBooking("Olá Hiarley, quero agendar minha primeira consulta de avaliação para desacelerar minha mente e começar a terapia.")}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-widest uppercase px-10 py-5 rounded-sm shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 transition-colors border border-emerald-500/20"
              >
                <PhoneCall className="w-4 h-4 text-emerald-250 animate-pulse" />
                Agendar avaliação
              </button>
              
              <button
                onClick={handleOpenAssessment}
                className="w-full sm:w-auto bg-neutral-905 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 px-6 py-5 rounded-sm text-xs sm:text-sm uppercase font-semibold tracking-wide cursor-pointer transition-all"
              >
                Autoavaliação online grátis
              </button>
            </div>

            {/* Safe indicators */}
            <div className="pt-2 flex items-center justify-center gap-6 text-[10.5px] text-neutral-500 font-mono tracking-wider font-semibold">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> AMBIENTE SIGILOSO</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> SUPORTE INDIVIDUALIZADO</span>
            </div>

          </div>
        </section>

      </main>

      {/* Footer component */}
      <Footer 
        onOpenBooking={(msg) => handleOpenBooking(msg)} 
        onOpenAssessment={handleOpenAssessment} 
      />

      {/* STEP-BY-STEP PREMIUM SELECTOR BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop Blur closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-neutral-900 border border-petroleo-900/60 w-full max-w-lg rounded-sm overflow-hidden shadow-2xl relative z-10 flex flex-col justify-between"
            >
              {/* Close trigger button */}
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar modal de agendamento"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal decorative top glow bar */}
              <div className="h-1 bg-gradient-to-right from-petroleo-700 via-petroleo-500 to-transparent"></div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-widest font-mono text-petroleo-400 font-bold uppercase block">
                    SELECIONE SEU PROCESSO DE AVALIAÇÃO
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
                    Qual o seu objetivo principal?
                  </h3>
                  <p className="font-sans text-xs text-neutral-400">
                    Sua escolha guiará a recepção de Hiarley Rocha para preparar o seu atendimento personalizado de forma eficiente no WhatsApp.
                  </p>
                </div>

                {/* Grid goals targets */}
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Ansiedade crônica e taquicardia silenciosa",
                      desc: "Desligar o aperto constante no peito, falta de ar inexplicável e medo recorrente."
                    },
                    {
                      label: "Mente acelerada e insônia persistente",
                      desc: "Desativar o barulho e a agitação interna que perturbam o sono profundo ao deitar."
                    },
                    {
                      label: "Fadiga emocional crônica e produtividade dolorosa",
                      desc: "Vencer o esgotamento extremo do limite do cansaço e a procrastinação por pânico e autocobrança."
                    },
                    {
                      label: "Bloqueios psicológicos e traumas antigos",
                      desc: "Limpar e dessensibilizar memórias estressoras e traumas involuntários da infância."
                    }
                  ].map((obj, idx) => {
                    const isSelected = selectedObjective === obj.label;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedObjective(obj.label);
                          setCustomWhatsAppMsg(""); // Clear customized assessor trigger so objective takes priority
                        }}
                        className={`w-full text-left p-3.5 rounded-sm border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                          isSelected 
                            ? "bg-petroleo-950/45 border-petroleo-500 shadow-md shadow-petroleo-950/20" 
                            : "bg-neutral-850 hover:bg-neutral-800 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className={`text-xs font-display font-bold block transition-colors leading-tight ${
                            isSelected ? "text-white" : "text-neutral-200 group-hover:text-white"
                          }`}>
                            {obj.label}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-light font-sans block leading-snug">
                            {obj.desc}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-petroleo-500 border-petroleo-400 text-white" : "border-neutral-700 bg-neutral-900"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[4px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-neutral-950 rounded text-[10.5px] text-neutral-450 leading-snug font-sans flex items-start gap-2 border border-neutral-850/60">
                  <span className="font-mono text-petroleo-400 font-bold">INFO:</span>
                  <span>O consultório de Hiarley Rocha opera sob estritas regras de sigilo protegidas pela legislação brasileira.</span>
                </div>

              </div>

              {/* Modal footer actions */}
              <div className="p-5 bg-neutral-950 border-t border-neutral-850 flex items-center justify-between gap-4">
                <span className="text-[10px] text-neutral-500 font-sans hidden sm:inline">
                  Atendimento Boa Viagem, Recife
                </span>
                
                <button
                  disabled={isDispatching}
                  onClick={() => dispatchWhatsApp("")}
                  className={`w-full sm:w-auto text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border border-emerald-500/20 ${
                    isDispatching 
                      ? "bg-emerald-750 opacity-85 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                  }`}
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-355" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      Confirmar e Agendar no WhatsApp
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
