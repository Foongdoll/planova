'use client';

import { create } from 'zustand';

interface UiState {
  selectedTaskId: number | null;
  inspectorOpen: boolean;
  sidebarOpen: boolean;
  expandedTreeNodes: Set<string>;
  setSelectedTaskId: (id: number | null) => void;
  setInspectorOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleTreeNode: (nodeKey: string) => void;
  isTreeNodeExpanded: (nodeKey: string) => boolean;
}

export const useUiStore = create<UiState>((set, get) => ({
  selectedTaskId: null,
  inspectorOpen: false,
  sidebarOpen: false,
  expandedTreeNodes: new Set<string>(),

  setSelectedTaskId: (id) => set({ selectedTaskId: id, inspectorOpen: id !== null }),

  setInspectorOpen: (open) => set({ inspectorOpen: open }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  toggleTreeNode: (nodeKey) => {
    const expanded = new Set(get().expandedTreeNodes);
    if (expanded.has(nodeKey)) {
      expanded.delete(nodeKey);
    } else {
      expanded.add(nodeKey);
    }
    set({ expandedTreeNodes: expanded });
  },

  isTreeNodeExpanded: (nodeKey) => get().expandedTreeNodes.has(nodeKey),
}));
