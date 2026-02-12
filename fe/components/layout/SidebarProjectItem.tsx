'use client';

import type { Project } from '@/lib/types';
import { useUiStore } from '@/lib/stores/ui-store';
import { useTreeData } from '@/lib/hooks/use-tree-data';
import { SidebarTreeNode } from './SidebarTreeNode';
import { useTaskStore } from '@/lib/stores/task-store';

interface SidebarProjectItemProps {
  project: Project;
  active: boolean;
  onSelect: () => void;
}

export function SidebarProjectItem({ project, active, onSelect }: SidebarProjectItemProps) {
  const { toggleTreeNode, expandedTreeNodes } = useUiStore();
  const tasks = useTaskStore((s) => s.tasks);
  const tree = useTreeData();
  const nodeKey = `project-${project.id}`;
  const isExpanded = expandedTreeNodes.has(nodeKey);
  const taskCount = tasks.filter((t) => t.projectId === project.id).length;

  return (
    <li>
      <div
        className={`group flex items-center gap-1.5 rounded-lg px-2 py-1.5 cursor-pointer transition ${
          active ? 'bg-[#E8F3D8]' : 'hover:bg-[#F2E9DA]'
        }`}
        onClick={onSelect}
      >
        <button
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#E7DDCB] bg-white text-[9px] text-neutral-500 group-hover:bg-[#FFF9EF]"
          onClick={(e) => { e.stopPropagation(); toggleTreeNode(nodeKey); }}
        >
          {isExpanded ? '▾' : '▸'}
        </button>
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#E8F3D8] text-[10px] font-semibold">
          P
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium">{project.name}</div>
        </div>
        <span className="rounded-full bg-[#F7F2E8] px-1.5 py-0.5 text-[10px] text-neutral-500 border border-[#E7DDCB]">
          {taskCount}
        </span>
      </div>

      {isExpanded && tree.length > 0 && (
        <ul className="mt-0.5 space-y-0.5 pl-3">
          {tree.map((node) => (
            <SidebarTreeNode key={node.task.id} node={node} />
          ))}
        </ul>
      )}
    </li>
  );
}
