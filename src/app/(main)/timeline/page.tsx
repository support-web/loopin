'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Heart, MessageCircle, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types';
import { formatDate, cn } from '@/lib/utils';

interface PublishedProject extends Project {
  users?: {
    name: string | null;
    avatar_url: string | null;
  };
}

export default function TimelinePage() {
  const [projects, setProjects] = useState<PublishedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPublishedProjects() {
      const { data } = await supabase
        .from('projects')
        .select(`
          *,
          users (name, avatar_url)
        `)
        .eq('status', 'published')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (data) {
        setProjects(data as PublishedProject[]);
      }
      setIsLoading(false);
    }

    fetchPublishedProjects();
  }, [supabase]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              公開プロジェクト
            </span>
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">タイムライン</h1>
          <p className="text-slate-600">
            コミュニティで共有された事業アイデアを見てみよう
          </p>
        </motion.div>

        {/* Projects */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              まだ公開プロジェクトがありません
            </h2>
            <p className="text-slate-500">
              あなたのプロジェクトを公開して、フィードバックをもらいましょう
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.1,
                }}
              >
                <Card hover>
                  <CardContent className="p-6">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                      {project.users?.avatar_url ? (
                        <img
                          src={project.users.avatar_url}
                          alt={project.users.name || ''}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {project.users?.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(project.updated_at)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {project.title}
                      </h3>
                      {project.plan_data && (
                        <p className="text-slate-600 line-clamp-3">
                          {(project.plan_data as any).overview || ''}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail */}
                    {project.thumbnail_url && (
                      <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {project.attributes && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.attributes as any).genre && (
                          <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                            {(project.attributes as any).genre}
                          </span>
                        )}
                        {(project.attributes as any).businessModel && (
                          <span className="px-3 py-1 bg-accent-50 text-accent-700 text-xs font-medium rounded-full">
                            {(project.attributes as any).businessModel}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Scores */}
                    {project.analysis_scores && (
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-600">
                              {Math.round(
                                Object.values(project.analysis_scores as any).reduce(
                                  (a: number, b: number) => a + b,
                                  0
                                ) / 6
                              )}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            総合スコア
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
