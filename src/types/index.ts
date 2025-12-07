// =====================
// User Types
// =====================
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// =====================
// Project Types
// =====================
export type ProjectStatus = 'draft' | 'published';

export interface ProjectAttributes {
  genre: string;
  businessModel: string;
  revenueGoal: string;
  startTiming: string;
  strengths: string[];
  marketChallenges: string;
  decisionStyle: 'intuition' | 'logic';
  organizationType: string;
}

export interface PlanData {
  serviceName: string;
  overview: string;
  targetMarket: string;
  valueProposition: string;
  competitors: string;
  revenueModel: string;
  milestones: string;
}

export interface AnalysisScores {
  feasibility: number;
  marketSize: number;
  innovation: number;
  profitability: number;
  scalability: number;
  teamFit: number;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  status: ProjectStatus;
  attributes: ProjectAttributes | null;
  plan_data: PlanData | null;
  analysis_scores: AnalysisScores | null;
  thumbnail_url: string | null;
  ai_personality: AIPersonality;
  created_at: string;
  updated_at: string;
}

// =====================
// Chat Types
// =====================
export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  project_id: string;
  sender: MessageSender;
  content: string;
  created_at: string;
}

// =====================
// AI Personality Types
// =====================
export type AIPersonality = 'logical' | 'challenger' | 'mentor' | 'friend';

export interface AIPersonalityConfig {
  id: AIPersonality;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const AI_PERSONALITIES: AIPersonalityConfig[] = [
  {
    id: 'logical',
    name: 'ロジカル型',
    description: 'データと論理に基づいて分析し、客観的なフィードバックを提供します',
    icon: '🧠',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'challenger',
    name: 'チャレンジ型',
    description: '鋭い質問であなたのアイデアを試し、弱点を見つけ出します',
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'mentor',
    name: 'メンター型',
    description: '豊富な経験から、成長につながるアドバイスを提供します',
    icon: '🎓',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'friend',
    name: 'フレンド型',
    description: '親しみやすく、アイデアを一緒に楽しみながら発展させます',
    icon: '✨',
    color: 'from-pink-500 to-rose-500',
  },
];

// =====================
// Wizard Types
// =====================
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 'genre', title: 'ビジネスジャンル', description: '事業の分野を選択' },
  { id: 'model', title: 'ビジネスモデル', description: '収益化の方法を選択' },
  { id: 'goal', title: '売上目標', description: '目標とする売上規模' },
  { id: 'timing', title: '開始時期', description: '事業開始のタイミング' },
  { id: 'strengths', title: '自分の強み', description: '活かせる強みを選択' },
  { id: 'partner', title: 'AIパートナー', description: '壁打ち相手のタイプ' },
];

// =====================
// Form Options
// =====================
export const GENRE_OPTIONS = [
  { value: 'saas', label: 'SaaS / IT' },
  { value: 'entertainment', label: 'エンタメ' },
  { value: 'hr', label: '人材' },
  { value: 'education', label: '教育' },
  { value: 'healthcare', label: 'ヘルスケア' },
  { value: 'fintech', label: 'フィンテック' },
  { value: 'ec', label: 'EC / 小売' },
  { value: 'food', label: 'フード / 飲食' },
  { value: 'other', label: 'その他' },
];

export const BUSINESS_MODEL_OPTIONS = [
  { value: 'subscription', label: 'サブスクリプション' },
  { value: 'marketplace', label: 'マーケットプレイス' },
  { value: 'onetime', label: '売り切り型' },
  { value: 'freemium', label: 'フリーミアム' },
  { value: 'advertising', label: '広告モデル' },
  { value: 'commission', label: '手数料モデル' },
];

export const REVENUE_GOAL_OPTIONS = [
  { value: 'under_10m', label: '1,000万円未満' },
  { value: '10m_100m', label: '1,000万円〜1億円' },
  { value: '100m_1b', label: '1億円〜10億円' },
  { value: 'over_1b', label: '10億円以上' },
];

export const START_TIMING_OPTIONS = [
  { value: 'within_3m', label: '3ヶ月以内' },
  { value: 'within_6m', label: '6ヶ月以内' },
  { value: 'within_1y', label: '1年以内' },
  { value: 'over_1y', label: '1年以上先' },
];

export const STRENGTH_OPTIONS = [
  { value: 'tech', label: '技術力' },
  { value: 'sales', label: '営業力' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'design', label: 'デザイン' },
  { value: 'brand', label: 'ブランド力' },
  { value: 'network', label: '人脈' },
  { value: 'domain', label: '業界知識' },
  { value: 'capital', label: '資金力' },
];
