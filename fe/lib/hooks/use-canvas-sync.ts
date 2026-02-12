'use client';

import { useMemo } from 'react';
import type { Node, Edge, MarkerType } from 'reactflow';
import { useTaskStore } from '@/lib/stores/task-store';
import { useDependencyStore } from '@/lib/stores/dependency-store';

const EDGE_COLOR = '#8BB86E';

export function useCanvasSync() {
  const tasks = useTaskStore((s) => s.tasks);
  const dependencies = useDependencyStore((s) => s.dependencies);

  const nodes: Node[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: String(t.id),
        type: 'task',
        position: { x: t.positionX ?? 0, y: t.positionY ?? 0 },
        data: {
          taskId: t.id,
          title: t.title,
          status: t.status,
          startDate: t.startDate,
          endDate: t.endDate,
          durationDays: t.durationDays,
          description: t.description,
          color: t.color,
        },
      })),
    [tasks],
  );

  const edges: Edge[] = useMemo(
    () =>
      dependencies.map((d) => ({
        id: `dep-${d.id}`,
        source: String(d.fromTaskId),
        target: String(d.toTaskId),
        animated: true,
        type: 'smoothstep',
        style: {
          strokeWidth: 3,
          stroke: EDGE_COLOR,
          strokeDasharray: '8 4',
        },
        markerEnd: {
          type: 'arrowclosed' as MarkerType,
          width: 16,
          height: 16,
          color: EDGE_COLOR,
        },
        data: { depId: d.id },
      })),
    [dependencies],
  );

  return { nodes, edges };
}
