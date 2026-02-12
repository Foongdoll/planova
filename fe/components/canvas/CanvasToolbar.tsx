'use client';

import { useTaskStore } from '@/lib/stores/task-store';
import { scheduleApi } from '@/lib/api/schedule';

interface CanvasToolbarProps {
  projectId: number;
  onAddNode: () => void;
}

export function CanvasToolbar({ projectId, onAddNode }: CanvasToolbarProps) {
  const setTasks = useTaskStore((s) => s.setTasks);

  const handleRecalculate = async () => {
    const tasks = await scheduleApi.recalculate(projectId);
    setTasks(tasks);
  };

  return (
    <div className="shrink-0 border-b border-[#E7DDCB] bg-white px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold hidden sm:block">플로우 캔버스</div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRecalculate}
            className="rounded-lg border border-[#E7DDCB] bg-[#FFF9EF] px-2 py-1 text-[11px] hover:bg-[#F7F2E8] transition"
          >
            재계산
          </button>
          <button
            onClick={onAddNode}
            className="rounded-lg border border-[#E7DDCB] bg-[#E8F3D8] hover:bg-[#DDF0C4] transition px-2.5 py-1 text-[11px] font-medium"
          >
            + 태스크
          </button>
        </div>
      </div>
    </div>
  );
}
