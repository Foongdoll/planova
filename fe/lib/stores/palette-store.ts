'use client';

import { create } from 'zustand';
import type { PaletteItem } from '@/lib/types';

const DEFAULT_ITEMS: PaletteItem[] = [
  { kind: 'task', label: '태스크', desc: '일반 작업 단위', icon: '📋', color: '' },
  { kind: 'milestone', label: '마일스톤', desc: '중간 목표', icon: '🏁', color: '#FEF3C7' },
  { kind: 'note', label: '메모', desc: '아이디어/메모', icon: '📝', color: '#E0F2FE' },
  { kind: 'bug', label: '버그', desc: '버그/이슈', icon: '🐛', color: '#FEE2E2' },
  { kind: 'feature', label: '기능', desc: '신규 기능', icon: '✨', color: '#E8F3D8' },
  { kind: 'design', label: '디자인', desc: 'UI/UX 작업', icon: '🎨', color: '#F3E8FF' },
  { kind: 'research', label: '리서치', desc: '조사/분석', icon: '🔍', color: '#DBEAFE' },
  { kind: 'meeting', label: '미팅', desc: '회의/리뷰', icon: '👥', color: '#FFEDD5' },
];

const STORAGE_KEY = 'planova-palette-items';

function loadItems(): PaletteItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_ITEMS;
}

function saveItems(items: PaletteItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface PaletteState {
  items: PaletteItem[];
  editMode: boolean;
  hydrate: () => void;
  setEditMode: (v: boolean) => void;
  addItem: (item: PaletteItem) => void;
  removeItem: (kind: string) => void;
  updateItem: (kind: string, patch: Partial<PaletteItem>) => void;
  reorderItems: (items: PaletteItem[]) => void;
  resetToDefault: () => void;
}

export const usePaletteStore = create<PaletteState>((set, get) => ({
  items: DEFAULT_ITEMS,
  editMode: false,

  hydrate: () => {
    set({ items: loadItems() });
  },

  setEditMode: (v) => set({ editMode: v }),

  addItem: (item) => {
    const items = [...get().items, item];
    saveItems(items);
    set({ items });
  },

  removeItem: (kind) => {
    const items = get().items.filter((it) => it.kind !== kind);
    saveItems(items);
    set({ items });
  },

  updateItem: (kind, patch) => {
    const items = get().items.map((it) =>
      it.kind === kind ? { ...it, ...patch } : it,
    );
    saveItems(items);
    set({ items });
  },

  reorderItems: (items) => {
    saveItems(items);
    set({ items });
  },

  resetToDefault: () => {
    saveItems(DEFAULT_ITEMS);
    set({ items: DEFAULT_ITEMS });
  },
}));
