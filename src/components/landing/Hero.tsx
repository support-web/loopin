'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mic, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">
              AI駆動の事業開発プラットフォーム
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
          >
            AIと
            <span className="gradient-text">対話</span>
            しながら
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                delay: 0.5,
              }}
            >
              事業を
            </motion.span>
            <motion.span
              className="gradient-text"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 12,
                delay: 0.7,
              }}
            >
              カタチに
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            アイデアを話すだけで、AIパートナーがあなたの事業計画を
            一緒にブラッシュアップ。音声入力で気軽に壁打ちしよう。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/login">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                無料で始める
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              デモを見る
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: Mic, label: '音声で相談', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: MessageCircle, label: 'AIが深掘り', color: 'bg-purple-50 text-purple-600 border-purple-200' },
              { icon: Sparkles, label: '自動で整理', color: 'bg-amber-50 text-amber-600 border-amber-200' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${feature.color}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.9 + i * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 400, damping: 10 },
                }}
              >
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
