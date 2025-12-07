'use client';

import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTA } from '@/components/landing/CTA';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="text-white font-bold text-lg">L</span>
            </motion.div>
            <span className="text-xl font-bold text-slate-900">Loopin</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              ログイン
            </Link>
            <Link href="/login">
              <motion.button
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                無料登録
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <Hero />
      <Features />
      <CTA />

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-semibold text-slate-700">Loopin</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 Loopin. AI-powered business development platform.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
