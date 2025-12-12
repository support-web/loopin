'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          {/* Background gradient card */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl blur-xl opacity-20" />

          <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-12 text-center text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">今すぐ無料で始められます</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                あなたのアイデアを
                <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    delay: 0.4,
                  }}
                >
                  カタチにしよう
                </motion.span>
              </h2>

              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Googleアカウントで簡単登録。AIパートナーがあなたの事業アイデアを
                一緒にブラッシュアップします。
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-white/90"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    無料で始める
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
