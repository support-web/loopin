'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  BarChart2,
  Download,
  Settings,
} from 'lucide-react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { PlanForm } from '@/components/plan/PlanForm';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Project, PlanData } from '@/types';
import { AI_PERSONALITIES } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

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
      setIsLoading(false);
    }

    fetchProject();
  }, [projectId, router, supabase]);

  const handlePlanUpdate = (planData: PlanData) => {
    if (project) {
      setProject({ ...project, plan_data: planData });
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

  const personality = AI_PERSONALITIES.find(
    (p) => p.id === project.ai_personality
  );

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Chat area */}
      <div className={cn('flex-1 flex flex-col', isPanelOpen && 'lg:mr-[400px]')}>
        {/* Project header */}
        <motion.div
          className="border-b border-slate-200 px-4 py-3 bg-white/80 backdrop-blur-xl flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            {personality && (
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                  'bg-gradient-to-br',
                  personality.color
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {personality.icon}
              </motion.div>
            )}
            <div>
              <h1 className="font-semibold text-slate-900 line-clamp-1">
                {project.title}
              </h1>
              <p className="text-xs text-slate-500">
                {personality?.name}パートナーと壁打ち中
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/project/${projectId}/report`}>
              <Button variant="ghost" size="sm" leftIcon={<BarChart2 className="w-4 h-4" />}>
                分析
              </Button>
            </Link>
            <Link href={`/project/${projectId}/plan`}>
              <Button variant="ghost" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                計画書
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="lg:hidden"
            >
              {isPanelOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Chat */}
        <div className="flex-1 bg-slate-50/50">
          <ChatContainer projectId={projectId} />
        </div>
      </div>

      {/* Side panel - Plan form */}
      <motion.div
        className={cn(
          'fixed right-0 top-16 bottom-0 w-full lg:w-[400px]',
          'bg-white/95 backdrop-blur-xl border-l border-slate-200',
          'transform transition-transform duration-300',
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        initial={false}
      >
        {/* Panel toggle for desktop */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute -left-10 top-4 hidden lg:flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-l-lg shadow-sm hover:bg-slate-50"
        >
          {isPanelOpen ? (
            <PanelLeftClose className="w-4 h-4 text-slate-600" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-slate-600" />
          )}
        </button>

        <PlanForm
          projectId={projectId}
          initialData={project.plan_data}
          onUpdate={handlePlanUpdate}
        />
      </motion.div>
    </div>
  );
}
