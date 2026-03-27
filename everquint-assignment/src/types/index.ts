export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type SortField = 'createdAt' | 'updatedAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  statuses: TaskStatus[];
  priority: TaskPriority | '';
  search: string;
  sortField: SortField;
  sortDir: SortDirection;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string; // comma-separated input, parsed on submit
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
  assignee?: string;
}

// Storage versioning
export interface StoredData {
  schemaVersion: number;
  tasks: Task[];
}

export const CURRENT_SCHEMA_VERSION = 3;

// Toast
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Priority ordering for sort
export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export const STATUS_COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
