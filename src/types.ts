export interface FortuneCard {
  id: string;
  category: 'Kintsugi' | 'Kindred Spirits' | 'Atmospheric Solace' | 'Micro-Miracles' | 'Quiet Perspective';
  title: string;
  narrative: string;
  quote?: {
    text: string;
    author: string;
  };
  smallAction: string;
  luckyToken: string;
}

export interface LanternReflection {
  id: string;
  thought: string;
  authorOrLocation: string;
  timestamp: string;
  tone: 'amber' | 'indigo' | 'lotus' | 'gold';
  x?: number;
  y?: number;
  speed?: number;
  drift?: number;
}

export interface Duality {
  id: string;
  title: string;
  sadnessAspect: string;
  luckyAspect: string;
  reconciliation: string;
}

export interface WonderItem {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  story: string;
  whyItMatters: string;
  quote: string;
}
