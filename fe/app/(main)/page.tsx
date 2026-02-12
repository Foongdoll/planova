'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/stores/project-store';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const router = useRouter();
  const { projects, loading, fetchProjects, createProject, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    const name = prompt('프로젝트 이름을 입력하세요');
    if (!name) return;
    const project = await createProject({ name });
    router.push(`/projects/${project.id}`);
  };

  return (
    <>
      <Header title="대시보드" breadcrumb="워크스페이스" />
      <main className="flex-1 min-h-0 overflow-auto p-3 sm:p-4 lg:p-6 bg-[#F7F2E8]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">프로젝트</h2>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-[#E8F3D8] hover:bg-[#DDF0C4] transition px-3 py-1.5 text-xs font-medium border border-[#E7DDCB]"
          >
            + 새 프로젝트
          </button>
        </div>

        {loading ? (
          <Spinner className="py-20" />
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <p className="text-sm font-medium">프로젝트가 없습니다</p>
            <p className="mt-1 text-xs">새 프로젝트를 만들어 시작하세요</p>
            <button
              onClick={handleCreate}
              className="mt-3 rounded-lg bg-[#CFE8A9] hover:bg-[#BEE38A] transition px-4 py-1.5 text-xs font-medium"
            >
              + 새 프로젝트 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group cursor-pointer rounded-xl border border-[#E7DDCB] bg-white p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-[#B9D98C] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold truncate">{project.name}</h3>
                    {project.description && (
                      <p className="mt-0.5 text-[11px] text-neutral-500 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F3D8] text-xs font-semibold shrink-0 ml-2">
                    P
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>{new Date(project.createdAt).toLocaleDateString('ko-KR')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
                        deleteProject(project.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
