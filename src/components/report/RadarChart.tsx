'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { AnalysisScores } from '@/types';

interface RadarChartProps {
  scores: AnalysisScores;
  animate?: boolean;
}

const SCORE_LABELS: Record<keyof AnalysisScores, string> = {
  feasibility: '実現可能性',
  marketSize: '市場規模',
  innovation: '革新性',
  profitability: '収益性',
  scalability: '成長性',
  teamFit: 'チーム適合',
};

export function RadarChart({ scores, animate = true }: RadarChartProps) {
  const [animatedScores, setAnimatedScores] = useState<AnalysisScores>(
    animate
      ? {
          feasibility: 0,
          marketSize: 0,
          innovation: 0,
          profitability: 0,
          scalability: 0,
          teamFit: 0,
        }
      : scores
  );

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedScores(scores);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scores, animate]);

  const data = Object.entries(animatedScores).map(([key, value]) => ({
    subject: SCORE_LABELS[key as keyof AnalysisScores],
    score: value,
    fullMark: 100,
  }));

  const averageScore =
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

  return (
    <div className="relative">
      {/* Score badge */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
          delay: 0.8,
        }}
      >
        <div className="text-4xl font-bold text-slate-900">
          {Math.round(averageScore)}
        </div>
        <div className="text-xs text-slate-500 font-medium">総合スコア</div>
      </motion.div>

      <ResponsiveContainer width="100%" height={350}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Radar
            name="スコア"
            dataKey="score"
            stroke="#0c85f1"
            fill="#0c85f1"
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">
                      {payload[0].payload.subject}
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                      {payload[0].value}点
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
