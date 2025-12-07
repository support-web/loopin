import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import type { PlanData, AnalysisScores, ProjectAttributes } from '@/types';

const ANALYSIS_PROMPT = `以下の事業計画を分析し、各項目を0-100点で評価してください。

【評価項目】
1. feasibility (実現可能性): 技術的・リソース的に実現可能か
2. marketSize (市場規模): ターゲット市場の大きさと成長性
3. innovation (革新性): 既存ソリューションとの差別化度
4. profitability (収益性): 収益モデルの持続可能性
5. scalability (成長性): スケールの可能性
6. teamFit (チーム適合): チームの強みとの整合性

【出力フォーマット】JSONのみで出力してください。
{
  "feasibility": 75,
  "marketSize": 80,
  "innovation": 65,
  "profitability": 70,
  "scalability": 85,
  "teamFit": 72,
  "summary": "事業の総評（100文字程度）",
  "strengths": ["強み1", "強み2"],
  "weaknesses": ["課題1", "課題2"],
  "recommendations": ["改善提案1", "改善提案2"]
}`;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();

    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const planData = project.plan_data as PlanData | null;
    const attributes = project.attributes as ProjectAttributes | null;

    if (!planData) {
      return NextResponse.json(
        { error: 'No plan data found' },
        { status: 400 }
      );
    }

    // Create analysis prompt
    const context = `
【事業計画】
- サービス名: ${planData.serviceName || '未設定'}
- 概要: ${planData.overview || '未設定'}
- ターゲット市場: ${planData.targetMarket || '未設定'}
- 提供価値: ${planData.valueProposition || '未設定'}
- 競合・差別化: ${planData.competitors || '未設定'}
- 収益モデル: ${planData.revenueModel || '未設定'}
- マイルストーン: ${planData.milestones || '未設定'}

【チーム情報】
- ビジネスジャンル: ${attributes?.genre || '未設定'}
- ビジネスモデル: ${attributes?.businessModel || '未設定'}
- 売上目標: ${attributes?.revenueGoal || '未設定'}
- チームの強み: ${attributes?.strengths?.join(', ') || '未設定'}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: ANALYSIS_PROMPT },
        { role: 'user', content: context },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      );
    }

    // Parse response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      analysis = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('Failed to parse analysis:', content);
      return NextResponse.json(
        { error: 'Failed to parse analysis' },
        { status: 500 }
      );
    }

    const scores: AnalysisScores = {
      feasibility: analysis.feasibility || 50,
      marketSize: analysis.marketSize || 50,
      innovation: analysis.innovation || 50,
      profitability: analysis.profitability || 50,
      scalability: analysis.scalability || 50,
      teamFit: analysis.teamFit || 50,
    };

    // Update project with scores
    await supabase
      .from('projects')
      .update({ analysis_scores: scores })
      .eq('id', projectId);

    return NextResponse.json({
      scores,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
    });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
