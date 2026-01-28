export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type Language = 'tr' | 'en';

export interface OptimizedVariation {
  label: string; // e.g. "Etkileşim Odaklı", "Hikaye Odaklı"
  content: string; // The rewritten post
  explanation: string; // Why this version scores better
  predictedScore: number; // The estimated score for this specific variation
}

export interface ViralScoreData {
  score: number; // 0-100
  classification: string; // e.g., "Yüksek Potansiyel", "Vasat", "Görünmez"
  summary: string; // Brief explanation
  positiveFactors: string[]; // List of boosting factors (Algorithm pros)
  negativeFactors: string[]; // List of penalties (Algorithm cons)
  improvementTips: string[]; // How to fix it
  optimizedVariations: OptimizedVariation[]; // New field for rewrites
}

export interface PostContent {
  text: string;
  image: File | null;
  imagePreview: string | null;
}

export interface ApiKeyItem {
  id: string; // Unique identifier
  name: string; // User-given name (e.g., "İş", "Kişisel")
  key: string; // The actual API key
  isActive: boolean; // Currently selected key
  createdAt: string; // ISO timestamp
  lastUsed?: string; // ISO timestamp of last use
}

export interface TrendPost {
  trendTopic: string; // The trending topic (e.g., "#YapayZeka2026", "AI Regulations")
  content: string; // The generated post content (max 280 chars)
  predictedScore: number; // Viral score prediction (0-100)
  explanation: string; // Why this post would work
  algorithmFactors: string[]; // Key algorithm factors used (e.g., "Has image", "Question hook", "2x hashtags")
  visualText?: string; // Short text for visual card (2-5 words)
  visualEmoji?: string; // Emoji for visual card
}

export interface TrendPostsData {
  keyword: string; // User's input keyword
  generatedPosts: TrendPost[]; // 3 trend-based posts
}

export type PostTone = 'friendly' | 'professional' | 'exciting' | 'optimistic' | 'pessimistic' | 'humorous' | 'motivational' | 'controversial';