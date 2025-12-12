import type { PlanData, AnalysisScores, ProjectAttributes } from '@/types';

// PDF generation will be handled client-side using jspdf
// This file provides helper functions for PDF content

export function formatPlanForPDF(
  planData: PlanData,
  attributes?: ProjectAttributes | null,
  scores?: AnalysisScores | null
) {
  return {
    title: planData.serviceName || '事業計画書',
    sections: [
      {
        title: 'サービス概要',
        content: planData.overview || '未入力',
      },
      {
        title: 'ターゲット市場',
        content: planData.targetMarket || '未入力',
      },
      {
        title: '提供価値',
        content: planData.valueProposition || '未入力',
      },
      {
        title: '競合・差別化',
        content: planData.competitors || '未入力',
      },
      {
        title: '収益モデル',
        content: planData.revenueModel || '未入力',
      },
      {
        title: 'マイルストーン',
        content: planData.milestones || '未入力',
      },
    ],
    attributes: attributes
      ? {
          genre: attributes.genre,
          businessModel: attributes.businessModel,
          revenueGoal: attributes.revenueGoal,
          strengths: attributes.strengths?.join(', '),
        }
      : null,
    scores: scores || null,
  };
}
