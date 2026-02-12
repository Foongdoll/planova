'use client';

import type { TreeNode } from '@/lib/types';
import { useUiStore } from '@/lib/stores/ui-store';
import { STATUS_COLORS } from '@/lib/utils/constants';

interface SidebarTreeNodeProps {
  node: TreeNode;
  depth?: number;
}

export function SidebarTreeNode({ node, depth = 0 }: SidebarTreeNodeProps) {
  const { selectedTaskId, setSelectedTaskId, toggleTreeNode, expandedTreeNodes } = useUiStore();
  const hasChildren = node.children.length > 0;
  const nodeKey = `task-${node.task.id}`;
  const isExpanded = expandedTreeNodes.has(nodeKey);
  const isSelected = selectedTaskId === node.task.id;
  const statusColor = STATUS_COLORS[node.task.status] ?? '#E7DDCB';

  return (
    <li>
      <div
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 cursor-pointer transition ${
          isSelected
            ? 'bg-white border border-[#E7DDCB] shadow-sm'
            : 'hover:bg-[#F2E9DA]'
        }`}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        onClick={() => setSelectedTaskId(node.task.id)}
      >
        {hasChildren ? (
          <button
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#E7DDCB] bg-white text-[9px] text-neutral-500 hover:bg-[#FFF9EF]"
            onClick={(e) => { e.stopPropagation(); toggleTreeNode(nodeKey); }}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span
            className="inline-flex h-2 w-2 shrink-0 rounded-full border"
            style={{ backgroundColor: statusColor, borderColor: statusColor }}
          />
        )}
        <div className="min-w-0 flex-1 truncate text-xs">
          {node.task.title}
        </div>
        {node.task.endDate && (
          <span className="text-[10px] text-neutral-400 shrink-0">
            {node.task.endDate}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className="space-y-0.5">
          {node.children.map((child) => (
            <SidebarTreeNode key={child.task.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
