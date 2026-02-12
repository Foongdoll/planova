'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useProjectStore } from '@/lib/stores/project-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { useDependencyStore } from '@/lib/stores/dependency-store';
import { useUiStore } from '@/lib/stores/ui-store';
import { SidebarProjectItem } from './SidebarProjectItem';
import { SidebarSearch } from './SidebarSearch';

export function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId ? Number(params.projectId) : null;
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  const { projects, fetchProjects, createProject } = useProjectStore();
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchDependencies = useDependencyStore((s) => s.fetchDependencies);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
      fetchDependencies(projectId);
    }
  }, [projectId, fetchTasks, fetchDependencies]);

  const filteredProjects = searchQuery
    ? projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  const handleCreateProject = async () => {
    const name = prompt('프로젝트 이름을 입력하세요');
    if (!name) return;
    const project = await createProject({ name });
    router.push(`/projects/${project.id}`);
  };

  const navigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const isHome = pathname === '/';
  const isCalendar = pathname === '/calendar';

  return (
    <aside className="w-64 lg:w-64 h-full shrink-0 border-r border-[#E7DDCB] bg-[#FFF9EF] flex flex-col">
      {/* Brand */}
      <div className="h-12 lg:h-14 px-4 flex items-center justify-between border-b border-[#E7DDCB]">
        <button onClick={() => navigate('/')} className="text-sm font-semibold tracking-tight hover:opacity-70 transition">
          Planova
        </button>
        {/* Close button on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden h-7 w-7 rounded-lg hover:bg-[#F2E9DA] transition flex items-center justify-center text-neutral-500 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-0.5">
        <button
          onClick={() => navigate('/')}
          className={`w-full text-left px-3 py-1.5 rounded-lg transition font-medium text-xs ${
            isHome ? 'bg-[#E8F3D8]' : 'hover:bg-[#F2E9DA]'
          }`}
        >
          대시보드
        </button>
        <button
          onClick={() => navigate('/calendar')}
          className={`w-full text-left px-3 py-1.5 rounded-lg transition font-medium text-xs ${
            isCalendar ? 'bg-[#E8F3D8]' : 'hover:bg-[#F2E9DA]'
          }`}
        >
          캘린더
        </button>
      </nav>

      {/* Tree Header */}
      <div className="px-3">
        <div className="flex items-center justify-between rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5">
          <span className="text-xs font-semibold">프로젝트</span>
          <button
            onClick={handleCreateProject}
            className="rounded bg-[#E8F3D8] hover:bg-[#DDF0C4] transition px-1.5 py-0.5 text-[10px] font-medium"
          >
            +
          </button>
        </div>
        <div className="mt-2">
          <SidebarSearch onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Tree */}
      <div className="mt-2 px-2 pb-2 overflow-auto flex-1">
        <ul className="space-y-0.5">
          {filteredProjects.map((project) => (
            <SidebarProjectItem
              key={project.id}
              project={project}
              active={projectId === project.id}
              onSelect={() => navigate(`/projects/${project.id}`)}
            />
          ))}
          {filteredProjects.length === 0 && (
            <li className="px-2 py-4 text-center text-xs text-neutral-400">
              프로젝트가 없습니다
            </li>
          )}
        </ul>
      </div>

      {/* Quick Add */}
      <div className="p-3 border-t border-[#E7DDCB]">
        <button
          onClick={handleCreateProject}
          className="w-full rounded-lg bg-[#CFE8A9] hover:bg-[#BEE38A] transition px-3 py-2 text-xs font-medium"
        >
          + 새 프로젝트
        </button>
      </div>
    </aside>
  );
}
