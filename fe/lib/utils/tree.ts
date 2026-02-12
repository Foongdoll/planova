import type { Task, TreeNode } from '@/lib/types';

export function buildTree(tasks: Task[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // Create nodes
  for (const task of tasks) {
    map.set(task.id, { task, children: [] });
  }

  // Build tree
  for (const task of tasks) {
    const node = map.get(task.id)!;
    if (task.parentId && map.has(task.parentId)) {
      map.get(task.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function flattenTree(nodes: TreeNode[]): Task[] {
  const result: Task[] = [];
  function walk(list: TreeNode[]) {
    for (const node of list) {
      result.push(node.task);
      walk(node.children);
    }
  }
  walk(nodes);
  return result;
}
