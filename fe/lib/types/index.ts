// === Enums / Constants ===
export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'BLOCKED';

// === Domain Models ===
export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  parentId: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  startDate: string | null;
  durationDays: number | null;
  endDate: string | null;
  sortOrder: number;
  positionX: number | null;
  positionY: number | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Dependency {
  id: number;
  projectId: number;
  fromTaskId: number;
  toTaskId: number;
  createdAt: string;
}

// === Request Types ===
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  parentId?: number;
  status?: TaskStatus;
  startDate?: string;
  durationDays?: number;
  sortOrder?: number;
  positionX?: number;
  positionY?: number;
  color?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  parentId?: number;
  status?: TaskStatus;
  startDate?: string;
  durationDays?: number;
  sortOrder?: number;
  positionX?: number;
  positionY?: number;
  color?: string;
}

export interface CreateDependencyRequest {
  fromTaskId: number;
  toTaskId: number;
}

// === Calendar ===
export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  startDate: string;
  startTime: string | null;
  endDate: string;
  endTime: string | null;
  allDay: boolean;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  allDay?: boolean;
  color?: string;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
  color?: string;
}

// === Palette ===
export interface PaletteItem {
  kind: string;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

// === Response Types ===
export interface AuthResponse {
  token: string;
  user: User;
}

// === Tree Node (for sidebar) ===
export interface TreeNode {
  task: Task;
  children: TreeNode[];
}
