/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Testimonial {
  id: string;
  name: string;
  age?: number;
  city: string;
  role?: string;
  quote: string;
  detailedStory: string;
  initialState: string;
  finalState: string;
  treatmentDuration: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "seguranca" | "processo" | "preco" | "indicacao";
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    score: number;
    description?: string;
  }[];
}

export interface AssessmentResult {
  title: string;
  subtitle: string;
  description: string;
  urgencyLevel: "moderado" | "elevado" | "severo";
  tips: string[];
  recommendedAction: string;
}
