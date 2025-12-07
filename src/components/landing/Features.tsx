'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Mic,
  MessageSquare,
  Wand2,
  FileText,
  BarChart3,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const features = [
  {
    icon: Mic,
    title: '音声で壁打ち',
    description:
      'マイクボタンを押して話すだけ。高精度な音声認識であなたの言葉をテキスト化。',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'AIが深掘り質問',
    description:
      'あなたのアイデアに対して、AIパートナーが鋭い質問で核心に迫ります。',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Wand2,
    title: 'ワンクリック自動入力',
    description:
      '会話内容をAIが分析し、事業計画の各項目を自動で埋めてくれます。',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: FileText,
    title: '計画書PDF出力',
    description:
      '整理された事業計画書をPDFでダウンロード。投資家への提案に活用できます。',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: BarChart3,
    title: '実現可能性分析',
    description:
      '市場規模、競合優位性、収益性などを多角的に評価し、レーダーチャートで可視化。',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
  },
  {
    icon: Users,
    title: 'コミュニティ共有',
    description:
      '作成した事業プランを公開し、他のユーザーやAIからフィードバックをもらえます。',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-50',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-slate-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            事業開発を
            <span className="gradient-text">加速</span>
            する機能
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            アイデア段階から事業計画書まで、AIがあなたの思考を整理しサポートします
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <motion.div
                    className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                  >
                    <feature.icon
                      className={`w-7 h-7 bg-gradient-to-br ${feature.color} text-white`}
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
