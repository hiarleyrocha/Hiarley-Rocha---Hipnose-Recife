/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Shield, Brain, Sparkles, CheckCircle2, ArrowRight, CornerDownRight, Heart, Loader2 } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    text: "Como você descreve a velocidade dos seus pensamentos ao deitar para dormir?",
    options: [
      { label: "Mente acelerada, revivendo diálogos ou antecipando o amanhã, gerando insônia silenciosa.", score: 3 },
      { label: "Ocasionalmente agitada, mas consigo desligar após 30 ou 40 minutos.", score: 1 },
      { label: "Geralmente tranquila, com sono contínuo e revigorante.", score: 0 }
    ]
  },
  {
    id: "q2",
    text: "O que acontece quando você tenta fazer uma pausa ou descansar?",
    options: [
      { label: "Sinto uma culpa esmagadora ou irritação, como se devesse estar sempre produzindo.", score: 3 },
      { label: "Consigo respirar, mas me pego checando notificações ou pensando no trabalho constantemente.", score: 2 },
      { label: "Consigo descansar por completo, sem me culpar pelos momentos de ócio.", score: 0 }
    ]
  },
  {
    id: "q3",
    text: "Como você lida com a autocrítica e cobranças no seu dia a dia?",
    options: [
      { label: "Uma régua extremamente alta; sinto que nunca é o suficiente e me martirizo por qualquer erro.", score: 3 },
      { label: "Sou exigente, mas consigo aceitar minhas falhas sem entrar em colapso emocional.", score: 1 },
      { label: "Tenho uma relação saudável e compreensiva com minhas limitações atuais.", score: 0 }
    ]
  },
  {
    id: "q4",
    text: "Você sente algum sintoma físico como aperto no peito, nós na garganta, ou respiração curta recorrentemente?",
    options: [
      { label: "Frequentemente. Parece uma resposta física de alerta que surge do nada, inexplicavelmente.", score: 3 },
      { label: "Sinto apenas nos dias de forte estresse ou reuniões complexas.", score: 1 },
      { label: "Quase nunca. Meu corpo raramente somatiza as tensões emocionais.", score: 0 }
    ]
  }
];

interface SymptomCheckerProps {
  onSelectResult: (message: string) => void;
}

export default function SymptomChecker({ onSelectResult }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: Intro, 0-3: Questions, 4: Result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelectedLabels([]);
  };

  const handleAnswer = (questionId: string, score: number, optionLabel: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setSelectedLabels((prev) => [...prev, optionLabel]);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(QUESTIONS.length);
    }
  };

  const totalScore = Object.keys(answers).reduce((acc, key) => acc + (answers[key] || 0), 0);

  const getDiagnosis = () => {
    if (totalScore >= 9) {
      return {
        title: "Alerta de Exaustão Emocional Severa",
        subtitle: "Seu sistema nervoso está funcionando no modo de sobrevivência crônico.",
        desc: "Você passou do limite tolerável de estresse e cobrança silenciosa. Seus pensamentos acelerados e reações de alerta do corpo não são falta de força de vontade: são respostas neurológicas automáticas (loops de proteção) que seu cérebro aprendeu e repete involuntariamente. A boa notícia é que o Método Resgate Emocional é desenhado especificamente para acessar essas áreas subconscientes e reconfigurar esses gatilhos automáticos.",
        urgency: "Crítico",
        colorClass: "text-red-400 border-red-950/50 bg-red-950/10",
        tips: [
          "Sua mente precisa de uma intervenção direta nas conexões automáticas subconscientes, pois o racional já está esgotado.",
          "O reprocessamento emocional focado ajudará a reabilitar seu sistema interno de alarme neurológico.",
          "Evite tentar se cobrar para relaxar: faça pausas físicas sem se forçar a meditar se isso te gera ansiedade."
        ],
        whatsappMessage: "Olá Hiarley, completei a Autoavaliação Emocional e meu resultado indicou Alerta de Exaustão Severa (Pontuação: " + totalScore + "/12). Gostaria de entender como o seu Método Resgate Emocional pode me ajudar a desacelerar e reprogramar esses padrões de alerta em Recife ou Online."
      };
    } else if (totalScore >= 5) {
      return {
        title: "Estresse e Sobrecarga Silenciosa Elevados",
        subtitle: "Você está segurando o fardo muito perto do seu limite de equilíbrio.",
        desc: "Você consegue demonstrar alta performance social e corporativa, mas o custo interno de segurar as pontas tem sido a sua paz de espírito. Essa ansiedade oculta, a autocobrança implacável do 'deveria ter feito melhor' e a dificuldade de desligar nas folgas são padrões enraizados. Com a hipnoterapia moderna, desfazemos as âncoras emocionais desse padrão persistente de autoproteção.",
        urgency: "Elevado",
        colorClass: "text-amber-400 border-amber-950/50 bg-amber-950/10",
        tips: [
          "Reconheça que sua alta proatividade se tornou uma armadilha silenciosa de fadiga.",
          "Processar as memórias ou aprendizados de cobrança intensa permite que você redefina seus próprios limites sem culpa.",
          "Reservar 10 minutos por dia para desconexão total (sem telas e sem obrigações) impede o avanço para a exaustão profunda."
        ],
        whatsappMessage: "Olá Hiarley, fiz o teste de Autoavaliação Emocional e meu diagnóstico apontou Sobrecarga Elevada (Pontuação: " + totalScore + "/12). Quero saber como o seu tratamento ajuda a desfazer essa autocrítica e ansiedade silenciosa."
      };
    } else {
      return {
        title: "Sobrecarga Emocional Moderada",
        subtitle: "Padrões iniciais de ansiedade e autocobrança estão se instalando.",
        desc: "Embora apresente momentos de desconexão saudável, você carrega uma semente de cobrança constante e irritabilidade sutil que podem evoluir. Atuar profilaticamente com hipnoterapia de reprocessamento traz clareza imediata e impede que o cansaço cotidiano se transforme em uma crise de ansiedade clínica.",
        urgency: "Moderado",
        colorClass: "text-petroleo-300 border-petroleo-900/50 bg-petroleo-950/20",
        tips: [
          "Preste atenção nos momentos em que responde de forma rígida a pequenos contratempos.",
          "Use terapias complementares rápidas e técnicas de foco para restabelecer a clareza mental.",
          "Conversar com um especialista em hipnoterapia avançada ajudará a organizar prioridades de saúde interna antes que se acumulem."
        ],
        whatsappMessage: "Olá Hiarley, fiz a autoavaliação emocional e recebi o resultado de Sobrecarga Moderada (Pontuação: " + totalScore + "/12). Gostaria de compreender mais sobre a hipnoterapia como ferramenta de prevenção e equilíbrio."
      };
    }
  };

  const diagnosis = currentStep === QUESTIONS.length ? getDiagnosis() : null;

  return (
    <div id="diagnostico-emocional" className="w-full bg-neutral-900 border border-petroleo-900/30 rounded-lg overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-right from-petroleo-700 via-petroleo-500 to-transparent"></div>
      
      {/* Quiz Header Info */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-neutral-850 bg-neutral-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-petroleo-400" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-neutral-300">
            Autoavaliação Clínica e Diagnóstico Rápido
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400 bg-neutral-850 px-2.5 py-1 rounded">
          {currentStep === -1 ? "PREPARAÇÃO" : currentStep === QUESTIONS.length ? "FINALIZADO" : `ETAPA ${currentStep + 1} DE ${QUESTIONS.length}`}
        </div>
      </div>

      {/* Main Container State */}
      <div className="p-6 sm:p-8 md:p-10 min-h-[360px] flex flex-col justify-between">
        
        {/* Intro Step */}
        {currentStep === -1 && (
          <div className="space-y-6 my-auto max-w-2xl mx-auto text-center">
            <div className="inline-flex p-3 bg-petroleo-950/50 border border-petroleo-800/40 rounded-full text-petroleo-400 mb-2">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              Descubra se sua mente está operando em <span className="text-petroleo-300">estado de perigo neurológico constante</span>
            </h3>
            <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
              Responda a 4 perguntas desenvolvidas com base em neurociência clínica. 
              Entenda em que nível de alerta seu sistema emocional está operando hoje (com atendimento online e presencial no Recife - Zona Sul e Zona Norte) e receba um diagnóstico detalhado.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto bg-petroleo-600 hover:bg-petroleo-500 text-white font-medium text-xs tracking-wider uppercase px-8 py-3.5 rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Iniciar Autoavaliação Gratuita
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-petroleo-500" /> Lado humano e sigiloso. Sem spam.
              </span>
            </div>
          </div>
        )}

        {/* Questions Steps */}
        {currentStep >= 0 && currentStep < QUESTIONS.length && (
          <div className="space-y-6 my-auto">
            {/* Progress bar */}
            <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-petroleo-500 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            <span className="inline-block px-3 py-1 bg-petroleo-950/60 border border-petroleo-900/60 text-petroleo-300 rounded-full text-[10px] uppercase font-mono tracking-wider font-semibold">
              Pergunta {currentStep + 1}
            </span>

            <h4 className="font-display text-xl sm:text-2xl font-medium text-white tracking-tight leading-relaxed max-w-3xl">
              {QUESTIONS[currentStep].text}
            </h4>

            <div className="space-y-3.5 pt-4">
              {QUESTIONS[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(QUESTIONS[currentStep].id, option.score, option.label)}
                  className="w-full text-left bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 hover:border-petroleo-800/60 p-4 rounded-sm transition-all duration-200 cursor-pointer flex items-start gap-4 group"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-neutral-900 rounded-full border border-neutral-700 text-xs text-neutral-400 group-hover:border-petroleo-500 group-hover:text-petroleo-400 transition-colors shrink-0 mt-0.5 font-mono">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="space-y-1">
                    <span className="text-sm font-sans text-neutral-200 group-hover:text-white transition-colors block leading-relaxed">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic / Result Step */}
        {currentStep === QUESTIONS.length && diagnosis && (
          <div className="space-y-8">
            <div className={`border p-5 rounded-sm flex flex-col md:flex-row items-start gap-5 ${diagnosis.colorClass}`}>
              <div className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-lg shrink-0">
                <Brain className="w-8 h-8 text-petroleo-400" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider font-mono bg-neutral-950 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                    DIAGNÓSTICO: {diagnosis.urgency.toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-400 font-sans">
                    Nível de esgotamento: {totalScore} de 12 pontos
                  </span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {diagnosis.title}
                </h4>
                <p className="text-sm font-sans font-medium text-neutral-300 italic">
                  &ldquo;{diagnosis.subtitle}&rdquo;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column Text */}
              <div className="space-y-4">
                <h5 className="font-display font-semibold text-sm tracking-widest text-petroleo-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-petroleo-400" /> O que isso significa na prática
                </h5>
                <p className="font-sans text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {diagnosis.desc}
                </p>
                <div className="p-4 bg-neutral-950/25 border border-neutral-850 rounded-sm">
                  <span className="text-[11px] font-mono text-neutral-500 block mb-2">OPÇÃO TERAPÊUTICA:</span>
                  <p className="text-[13px] font-sans text-neutral-300 leading-relaxed font-light">
                    O acompanhamento com Hiarley Rocha tem o propósito de usar a hipnose para dissolver gatilhos neurais, desativando o desgaste invisível e auxiliando a construir um descanso mental real, sustentatório e duradouro.
                  </p>
                </div>
              </div>

              {/* Right Column Tips */}
              <div className="space-y-4">
                <h5 className="font-display font-semibold text-sm tracking-widest text-neutral-300 uppercase">
                  Recomendações Práticas Imediatas:
                </h5>
                <ul className="space-y-3" aria-label="Recomendações Práticas">
                  {diagnosis.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-petroleo-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action */}
            <div className="pt-6 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-5 bg-neutral-900/60 p-5 rounded-sm">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono text-petroleo-400 font-medium">CONVERSÃO DE SINAIS ATIVOS</span>
                <p className="text-sm font-sans text-neutral-200">
                  Hiarley Rocha pode revisar este relatório inicial com você em sua primeira consulta.
                </p>
              </div>
              <button
                onClick={() => onSelectResult(diagnosis.whatsappMessage)}
                className="w-full sm:w-auto text-white font-bold text-xs tracking-wider uppercase px-7 py-3.5 rounded-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2 shrink-0 border border-emerald-450/20 bg-emerald-600 hover:bg-emerald-500 cursor-pointer transition-colors"
              >
                Enviar Diagnóstico e Agendar Sessão
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Repeat trigger */}
            <div className="text-center">
              <button
                onClick={handleStart}
                className="text-xs font-sans text-neutral-500 hover:text-neutral-300 underline transition-colors cursor-pointer"
              >
                Refazer autoavaliação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
