'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RadarChart } from '@/components/report/RadarChart';
import { ScoreCard } from '@/components/report/ScoreCard';
import { createClient } from '@/lib/supabase/client';
import type { Project, AnalysisScores } from '@/types';

interface AnalysisResult {
  scores: AnalysisScores;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error || !data) {
        router.push('/dashboard');
        return;
      }

      setProject(data as Project);

      // If we have existing scores, use them
      if (data.analysis_scores) {
        setAnalysis({
          scores: data.analysis_scores as AnalysisScores,
          summary: '',
          strengths: [],
          weaknesses: [],
          recommendations: [],
        });
      }

      setIsLoading(false);
    }

    fetchProject();
  }, [projectId, router, supabase]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Link href={`/project/${projectId}`}>
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">分析レポート</h1>
              <p className="text-slate-600">{project.title}</p>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {analysis ? '再分析' : 'AIで分析'}
          </Button>
        </motion.div>

        {!analysis ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              まだ分析されていません
            </h2>
            <p className="text-slate-500 mb-6">
              「AIで分析」ボタンを押して、事業計画の評価を行いましょう
            </p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>総合評価</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart scores={analysis.scores} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Cards */}
            <div className="space-y-4">
              {(Object.entries(analysis.scores) as [keyof AnalysisScores, number][]).map(
                ([key, value], index) => (
                  <ScoreCard
                    key={key}
                    scoreKey={key}
                    value={value}
                    index={index}
                  />
                )
              )}
            </div>

            {/* Summary */}
            {analysis.summary && (
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>総評</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{analysis.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Strengths & Weaknesses */}
            {(analysis.strengths?.length > 0 || analysis.weaknesses?.length > 0) && (
              <motion.div
                className="lg:col-span-2 grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {analysis.strengths?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        強み
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-green-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.weaknesses?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        課題
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-amber-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Recommendations */}
            {analysis.recommendations?.length > 0 && (
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary-500" />
                      改善提案
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <span className="text-primary-500 mt-1">{i + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
