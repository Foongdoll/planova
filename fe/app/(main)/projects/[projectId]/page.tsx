'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/lib/stores/project-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { useDependencyStore } from '@/lib/stores/dependency-store';
import { Header } from '@/components/layout/Header';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { Spinner } from '@/components/ui/Spinner';

export default function ProjectPage() {
  const params = useParams();
  const projectId = Number(params.projectId);

  const projects = useProjectStore((s) => s.projects);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const tasksLoading = useTaskStore((s) => s.loading);
  const fetchDependencies = useDependencyStore((s) => s.fetchDependencies);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
      fetchDependencies(projectId);
    }
  }, [projectId, fetchTasks, fetchDependencies]);

  if (tasksLoading) {
    return (
      <>
        <Header title={project?.name ?? '로딩 중...'} breadcrumb="프로젝트" />
        <Spinner className="flex-1" />
      </>
    );
  }

  return (
    <>
      <Header title={project?.name ?? `프로젝트 #${projectId}`} breadcrumb="프로젝트" />
      <main className="flex-1 min-h-0 min-w-0 bg-[#F7F2E8] p-2 sm:p-3 lg:p-4 overflow-hidden">
        <div className="h-full w-full rounded-xl border border-[#E7DDCB] bg-white shadow-sm overflow-hidden">
          <FlowCanvas projectId={projectId} />
        </div>
      </main>
    </>
  );
}
