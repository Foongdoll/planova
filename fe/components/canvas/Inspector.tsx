'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUiStore } from '@/lib/stores/ui-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { useDependencyStore } from '@/lib/stores/dependency-store';
import { scheduleApi } from '@/lib/api/schedule';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';
import type { TaskStatus } from '@/lib/types';

const STATUSES: TaskStatus[] = ['TODO', 'DOING', 'DONE', 'BLOCKED'];
const DEBOUNCE_MS = 600;

export function Inspector() {
  const { selectedTaskId, inspectorOpen, setInspectorOpen, setSelectedTaskId } = useUiStore();
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const setTasks = useTaskStore((s) => s.setTasks);
  const dependencies = useDependencyStore((s) => s.dependencies);
  const deleteDependency = useDependencyStore((s) => s.deleteDependency);

  const task = tasks.find((t) => t.id === selectedTaskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [color, setColor] = useState('');
  const [saving, setSaving] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializing = useRef(true);

  // Sync task data → local state
  useEffect(() => {
    if (task) {
      isInitializing.current = true;
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setStartDate(task.startDate ?? '');
      setDurationDays(task.durationDays?.toString() ?? '');
      setColor(task.color ?? '');
      // Allow a tick for state to settle
      setTimeout(() => { isInitializing.current = false; }, 50);
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save with debounce
  const doSave = useCallback(async (
    taskId: number,
    projectId: number,
    data: { title: string; description: string; status: TaskStatus; startDate: string; durationDays: string; color: string },
  ) => {
    setSaving(true);
    try {
      await updateTask(taskId, {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate || undefined,
        durationDays: data.durationDays ? parseInt(data.durationDays) : undefined,
        color: data.color || undefined,
      });
      try {
        const updated = await scheduleApi.recalculate(projectId);
        setTasks(updated);
      } catch { /* best-effort */ }
    } finally {
      setSaving(false);
    }
  }, [updateTask, setTasks]);

  // Trigger auto-save on field changes
  useEffect(() => {
    if (isInitializing.current || !task) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doSave(task.id, task.projectId, { title, description, status, startDate, durationDays, color });
    }, DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, description, status, startDate, durationDays, color]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!inspectorOpen || !task) return null;

  const taskDeps = dependencies.filter(
    (d) => d.fromTaskId === task.id || d.toTaskId === task.id,
  );

  const handleDelete = async () => {
    if (confirm('이 태스크를 삭제하시겠습니까?')) {
      await deleteTask(task.id);
      setSelectedTaskId(null);
      setInspectorOpen(false);
    }
  };

  const handleClose = () => {
    // Flush pending save
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      doSave(task.id, task.projectId, { title, description, status, startDate, durationDays, color });
    }
    setSelectedTaskId(null);
    setInspectorOpen(false);
  };

  return (
    <div className="w-full shrink-0 border-l border-[#E7DDCB] bg-[#FFF9EF] flex flex-col overflow-auto">
      <div className="flex items-center justify-between border-b border-[#E7DDCB] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">태스크 상세</span>
          {saving && (
            <span className="text-[10px] text-neutral-400 animate-pulse">저장 중...</span>
          )}
        </div>
        <button
          onClick={handleClose}
          className="rounded-lg hover:bg-[#F2E9DA] transition px-1.5 py-0.5 text-xs"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700">상태</label>
          <div className="flex flex-wrap gap-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-1.5 py-0.5 text-[11px] transition ${
                  status === s ? 'ring-2 ring-[#B9D98C]' : ''
                }`}
              >
                <Badge status={s} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700">색상</label>
          <div className="flex flex-wrap gap-1">
            {NODE_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value || 'default'}
                onClick={() => setColor(preset.value)}
                title={preset.label}
                className={`h-6 w-6 rounded-md border-2 transition hover:scale-110 ${
                  color === preset.value ? 'ring-2 ring-[#B9D98C] ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: preset.bg,
                  borderColor: preset.border,
                }}
              />
            ))}
          </div>
        </div>

        <Input
          label="시작일"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          label="기간 (일)"
          type="number"
          min={1}
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
        />

        {task.endDate && (
          <div className="text-xs text-neutral-600">
            종료일: <span className="font-medium">{task.endDate}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700">설명</label>
          <textarea
            className="w-full rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#B9D98C] focus:ring-2 focus:ring-[#E8F3D8] transition placeholder:text-neutral-400 min-h-[60px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력하세요"
          />
        </div>

        {taskDeps.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700">의존성</label>
            {taskDeps.map((dep) => {
              const other = dep.fromTaskId === task.id ? dep.toTaskId : dep.fromTaskId;
              const otherTask = tasks.find((t) => t.id === other);
              const direction = dep.fromTaskId === task.id ? '→' : '←';
              return (
                <div
                  key={dep.id}
                  className="flex items-center justify-between rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5"
                >
                  <span className="text-[11px] text-neutral-600">
                    {direction} {otherTask?.title ?? `#${other}`}
                  </span>
                  <button
                    onClick={() => deleteDependency(dep.id)}
                    className="text-[11px] text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <Button onClick={handleDelete} variant="ghost" size="sm" className="w-full border-red-200 text-red-500 hover:bg-red-50">
          태스크 삭제
        </Button>
      </div>
    </div>
  );
}
