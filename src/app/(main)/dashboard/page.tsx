'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, FolderOpen, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });

      if (data) {
        setProjects(data as Project[]);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, [supabase]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ダッシュボード</h1>
            <p className="text-slate-600 mt-1">
              あなたの事業構想プロジェクト
            </p>
          </div>
          <Link href="/project/new">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              新しい構想
            </Button>
          </Link>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <FolderOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              まだプロジェクトがありません
            </h2>
            <p className="text-slate-500 mb-6">
              新しい事業構想を始めて、AIと一緒にアイデアを形にしましょう
            </p>
            <Link href="/project/new">
              <Button leftIcon={<Plus className="w-5 h-5" />}>
                最初の構想を始める
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Link href={`/project/${project.id}`}>
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl mb-4 flex items-center justify-center">
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-4xl">💡</span>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">
                        {project.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(project.updated_at)}
                        </div>
                        {project.status === 'published' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Globe className="w-4 h-4" />
                            公開中
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
