'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  NodeDragHandler,
  type Node,
} from 'reactflow';
import { useCanvasSync } from '@/lib/hooks/use-canvas-sync';
import { useTaskStore } from '@/lib/stores/task-store';
import { useDependencyStore } from '@/lib/stores/dependency-store';
import { useUiStore } from '@/lib/stores/ui-store';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';
import { TaskNode } from './TaskNode';
import { Palette, getPaletteLabel, getPaletteColor } from './Palette';
import { CanvasToolbar } from './CanvasToolbar';
import { Inspector } from './Inspector';

const nodeTypes = { task: TaskNode };

const NUDGE_PX = 10;

function CanvasInner({ projectId }: { projectId: number }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes: syncedNodes, edges: syncedEdges } = useCanvasSync();
  const createTask = useTaskStore((s) => s.createTask);
  const updatePosition = useTaskStore((s) => s.updatePosition);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const tasks = useTaskStore((s) => s.tasks);
  const createDependency = useDependencyStore((s) => s.createDependency);
  const { selectedTaskId, setSelectedTaskId, setInspectorOpen, inspectorOpen } = useUiStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // MiniMap node color
  const nodeColor = useCallback((node: Node) => {
    const c = node.data?.color;
    if (!c) return '#CFE8A9';
    const preset = NODE_COLOR_PRESETS.find((p) => p.value === c);
    return preset?.bg ?? c;
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Sync store data to local state
  useEffect(() => {
    setNodes(syncedNodes);
  }, [syncedNodes, setNodes]);

  useEffect(() => {
    setEdges(syncedEdges);
  }, [syncedEdges, setEdges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept when typing in inputs
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Delete / Backspace → delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTaskId) {
        e.preventDefault();
        if (confirm('선택된 노드를 삭제하시겠습니까?')) {
          deleteTask(selectedTaskId);
          setSelectedTaskId(null);
          setInspectorOpen(false);
        }
        return;
      }

      // Escape → deselect
      if (e.key === 'Escape' && selectedTaskId) {
        e.preventDefault();
        setSelectedTaskId(null);
        setInspectorOpen(false);
        return;
      }

      // Arrow keys → nudge selected node
      if (selectedTaskId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const task = tasks.find((t) => t.id === selectedTaskId);
        if (!task) return;

        const x = task.positionX ?? 0;
        const y = task.positionY ?? 0;
        const step = e.shiftKey ? NUDGE_PX * 5 : NUDGE_PX;

        let nx = x;
        let ny = y;
        switch (e.key) {
          case 'ArrowUp':    ny -= step; break;
          case 'ArrowDown':  ny += step; break;
          case 'ArrowLeft':  nx -= step; break;
          case 'ArrowRight': nx += step; break;
        }
        updatePosition(selectedTaskId, nx, ny);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, tasks, deleteTask, setSelectedTaskId, setInspectorOpen, updatePosition]);

  const onConnect = useCallback(
    async (c: Connection) => {
      if (!c.source || !c.target) return;
      try {
        await createDependency(projectId, {
          fromTaskId: parseInt(c.source),
          toTaskId: parseInt(c.target),
        });
      } catch (err) {
        alert(err instanceof Error ? err.message : '의존성 생성 실패');
      }
    },
    [projectId, createDependency],
  );

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_event, node) => {
      updatePosition(parseInt(node.id), node.position.x, node.position.y);
    },
    [updatePosition],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('application/planova-node');
      if (!kind) return;

      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const title = getPaletteLabel(kind);
      const color = getPaletteColor(kind);

      await createTask(projectId, {
        title: `${title} ${nodes.length + 1}`,
        positionX: pos.x,
        positionY: pos.y,
        color: color || undefined,
      });
    },
    [projectId, createTask, screenToFlowPosition, nodes.length],
  );

  const handleAddNode = async () => {
    await createTask(projectId, {
      title: `새 태스크 ${nodes.length + 1}`,
      positionX: 240 + nodes.length * 40,
      positionY: 200 + nodes.length * 30,
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      <CanvasToolbar projectId={projectId} onAddNode={handleAddNode} />

      <div className="flex-1 min-h-0 min-w-0 flex relative">
        {/* Palette: hidden on small screens */}
        <div className="hidden md:block">
          <Palette />
        </div>

        <div
          ref={wrapperRef}
          className="flex-1 min-w-0 min-h-0 bg-[#F7F2E8]"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={null}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={18} size={1} />
            <Controls showFitView showZoom showInteractive={false}>
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? '전체화면 해제' : '전체화면'}
                className="react-flow__controls-button"
              >
                {isFullscreen ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>
            </Controls>
            <MiniMap
              pannable
              zoomable
              nodeColor={nodeColor}
              className="hidden sm:block"
              style={{
                background: '#FFF9EF',
                border: '1px solid #E7DDCB',
                borderRadius: 12,
              }}
            />
          </ReactFlow>
        </div>

        {/* Inspector: overlay on mobile, sidebar on desktop */}
        <div className={`${
          inspectorOpen
            ? 'absolute inset-y-0 right-0 z-20 w-72 sm:w-80 lg:relative lg:w-72 xl:w-80 shadow-xl lg:shadow-none'
            : 'hidden'
        }`}>
          <Inspector />
        </div>
      </div>
    </div>
  );
}

export function FlowCanvas({ projectId }: { projectId: number }) {
  return (
    <ReactFlowProvider>
      <CanvasInner projectId={projectId} />
    </ReactFlowProvider>
  );
}
