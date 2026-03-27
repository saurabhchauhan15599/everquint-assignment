import { create } from 'zustand';
import { toast } from 'sonner';
import type { Task, TaskStatus } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { generateId } from '../utils';

interface TaskStore {
  tasks: Task[];
  storageError: string | null;
  migrationPerformed: boolean;
  initStore: () => void;
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  storageError: null,
  migrationPerformed: false,

  initStore: () => {
    const { tasks, migrated } = loadFromStorage();
    set({ tasks, migrationPerformed: migrated });
    if (migrated) {
      toast.info('Your data was migrated to the latest format.');
    }
  },

  createTask: (data) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    const tasks = [...get().tasks, task];
    set({ tasks });
    try {
      saveToStorage(tasks);
      toast.success('Task created.');
    } catch (e) {
      set({ storageError: (e as Error).message });
      toast.error('Could not save task — storage unavailable.');
    }
  },

  updateTask: (id, data) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t,
    );
    set({ tasks });
    try {
      saveToStorage(tasks);
      toast.success('Task updated.');
    } catch (e) {
      set({ storageError: (e as Error).message });
      toast.error('Could not save changes — storage unavailable.');
    }
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    set({ tasks });
    try {
      saveToStorage(tasks);
      toast.success('Task deleted.');
    } catch {
      toast.error('Could not delete from storage.');
    }
  },

  moveTask: (id, status) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
    );
    set({ tasks });
    try {
      saveToStorage(tasks);
    } catch {
      toast.error('Could not save task move — storage unavailable.');
    }
  },
}));
