'use client';

import { useMemo } from 'react';
import { useTaskStore } from '@/lib/stores/task-store';
import { buildTree } from '@/lib/utils/tree';

export function useTreeData() {
  const tasks = useTaskStore((s) => s.tasks);
  const tree = useMemo(() => buildTree(tasks), [tasks]);
  return tree;
}
