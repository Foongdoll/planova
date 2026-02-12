'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaletteStore } from '@/lib/stores/palette-store';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';

export function getPaletteLabel(kind: string) {
  const store = usePaletteStore.getState();
  return store.items.find((it) => it.kind === kind)?.label ?? '태스크';
}

export function getPaletteColor(kind: string) {
  const store = usePaletteStore.getState();
  return store.items.find((it) => it.kind === kind)?.color ?? '';
}

export function Palette() {
  const { items, editMode, setEditMode, addItem, removeItem, resetToDefault, hydrate } = usePaletteStore();
  const [draggingKind, setDraggingKind] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('📌');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const onDragStart = (e: React.DragEvent, kind: string) => {
    e.dataTransfer.setData('application/planova-node', kind);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingKind(kind);
  };

  const onDragEnd = () => {
    setDraggingKind(null);
  };

  const handleAddItem = () => {
    if (!newLabel.trim()) return;
    const kind = newLabel.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    addItem({
      kind,
      label: newLabel.trim(),
      desc: '',
      icon: newIcon,
      color: newColor,
    });
    setNewLabel('');
    setNewIcon('📌');
    setNewColor('');
    setShowAdd(false);
  };

  return (
    <div className="w-48 lg:w-52 shrink-0 border-r border-[#E7DDCB] bg-[#FFF9EF] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-600">팔레트</span>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`text-[11px] px-2 py-0.5 rounded-lg transition ${
            editMode ? 'bg-[#CFE8A9] font-medium' : 'hover:bg-[#F2E9DA]'
          }`}
        >
          {editMode ? '완료' : '편집'}
        </button>
      </div>

      {/* Guide */}
      <div className="px-3 pb-2">
        <p className="text-[11px] text-neutral-400">캔버스에 드래그하여 노드를 생성하세요</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto px-3 pb-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((it) => (
            <motion.div
              key={it.kind}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: draggingKind === it.kind ? 0.5 : 1,
                scale: draggingKind === it.kind ? 0.95 : 1,
              }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              whileHover={!editMode ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : undefined}
              whileTap={!editMode ? { scale: 0.96 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              draggable={!editMode}
              onDragStart={(e) => !editMode && onDragStart(e as unknown as React.DragEvent, it.kind)}
              onDragEnd={onDragEnd}
              className={`select-none rounded-xl border border-[#E7DDCB] px-2.5 py-2 shadow-sm relative ${
                !editMode ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              style={{
                backgroundColor: it.color || '#FFFFFF',
                borderColor: it.color || '#E7DDCB',
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{it.icon}</span>
                <span className="text-xs font-semibold">{it.label}</span>
              </div>
              {it.desc && (
                <div className="mt-0.5 text-[11px] text-neutral-500">{it.desc}</div>
              )}

              {/* Edit mode delete button */}
              {editMode && (
                <button
                  onClick={() => removeItem(it.kind)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-500 text-[10px] hover:bg-red-200 transition"
                >
                  ✕
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add new item */}
        {editMode && (
          <div className="space-y-2 pt-1">
            {showAdd ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-2xl border border-[#E7DDCB] bg-white p-3 space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-10 rounded-lg border border-[#E7DDCB] px-2 py-1 text-center text-sm outline-none"
                    maxLength={2}
                  />
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="이름"
                    className="flex-1 rounded-lg border border-[#E7DDCB] px-2 py-1 text-sm outline-none focus:border-[#B9D98C]"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {NODE_COLOR_PRESETS.map((p) => (
                    <button
                      key={p.value || 'default'}
                      onClick={() => setNewColor(p.value)}
                      className={`h-5 w-5 rounded border transition ${
                        newColor === p.value ? 'ring-2 ring-[#B9D98C]' : ''
                      }`}
                      style={{ backgroundColor: p.bg, borderColor: p.border }}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleAddItem}
                    className="flex-1 rounded-lg bg-[#CFE8A9] hover:bg-[#BEE38A] px-2 py-1 text-xs font-medium transition"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="rounded-lg hover:bg-[#F2E9DA] px-2 py-1 text-xs transition"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex-1 rounded-xl border border-dashed border-[#E7DDCB] hover:border-[#B9D98C] hover:bg-[#E8F3D8] transition py-2 text-xs text-neutral-500"
                >
                  + 새 항목
                </button>
                <button
                  onClick={resetToDefault}
                  className="rounded-xl border border-[#E7DDCB] hover:bg-[#F2E9DA] transition px-2 py-2 text-[10px] text-neutral-500"
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div className="px-2 pb-2 shrink-0">
        <div className="rounded-lg border border-[#E7DDCB] bg-white/60 px-2 py-1.5 text-[10px] text-neutral-400">
          <div>Del: 삭제 &middot; Esc: 해제 &middot; 방향키: 이동</div>
        </div>
      </div>
    </div>
  );
}
