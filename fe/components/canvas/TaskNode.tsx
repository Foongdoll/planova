'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { useUiStore } from '@/lib/stores/ui-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';

interface TaskNodeData {
  taskId: number;
  title: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  durationDays: number | null;
  description: string | null;
  color: string | null;
}

function TaskNodeComponent({ data, selected }: { data: TaskNodeData; selected: boolean }) {
  const setSelectedTaskId = useUiStore((s) => s.setSelectedTaskId);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const daysLeft = data.endDate
    ? Math.ceil((new Date(data.endDate).getTime() - Date.now()) / 86400000)
    : null;

  const preset = data.color
    ? NODE_COLOR_PRESETS.find((p) => p.value === data.color)
    : null;
  const bgColor = preset?.bg ?? data.color ?? '#FFFFFF';
  const borderColor = preset?.border ?? data.color ?? '#E7DDCB';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 노드를 삭제하시겠습니까?')) {
      deleteTask(data.taskId);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-[#B9D98C] !border-[#CFE8A9] !w-2.5 !h-2.5" />
      <motion.div
        layout
        initial={{ scale: 0.96, opacity: 0, y: 6 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        onClick={() => setSelectedTaskId(data.taskId)}
        className={[
          'group min-w-[180px] max-w-[240px] rounded-xl border shadow-sm cursor-pointer relative',
          selected ? 'ring-2 ring-[#E8F3D8]' : '',
        ].join(' ')}
        style={{
          backgroundColor: bgColor,
          borderColor: selected ? '#B9D98C' : borderColor,
        }}
      >
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute -top-1.5 -right-1.5 z-10 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-500 hover:bg-red-200 text-[10px] transition"
        >
          ✕
        </button>

        <div className="px-3 pt-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{data.title}</div>
              {data.description && (
                <div className="mt-0.5 text-[11px] text-neutral-500 truncate">{data.description}</div>
              )}
            </div>
            <Badge status={data.status} />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {data.startDate && (
              <span className="text-[11px] text-neutral-600">{data.startDate}</span>
            )}
            {data.durationDays && (
              <span className="text-[11px] text-neutral-500">({data.durationDays}일)</span>
            )}
            {daysLeft !== null && (
              <span className="ml-auto text-[10px] text-neutral-500">
                D{daysLeft <= 0 ? `+${Math.abs(daysLeft)}` : `-${daysLeft}`}
              </span>
            )}
          </div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} className="!bg-[#B9D98C] !border-[#CFE8A9] !w-2.5 !h-2.5" />
    </>
  );
}

export const TaskNode = memo(TaskNodeComponent);
