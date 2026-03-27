import type { Task, StoredData } from '../types';
import { CURRENT_SCHEMA_VERSION } from '../types';

const STORAGE_KEY = 'workflow-board-data';

function migrateV1ToV2(tasks: Omit<Task, 'tags' | 'priority'>[]): Task[] {
  return tasks.map((t) => ({
    ...t,
    priority: 'Medium' as const,
    tags: [],
  }));
}

function migrateV2ToV3(tasks: Task[]): Task[] {
  return tasks.map((t) => ({
    ...t,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: (t.status as any) === 'Backlog' ? 'Todo' : t.status,
  }));
}

function runMigrations(raw: Record<string, unknown>): { tasks: Task[]; migrated: boolean } {
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1;
  let tasks = (raw.tasks as Task[]) ?? [];
  let migrated = false;

  if (version < 2) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tasks = migrateV1ToV2(tasks as any);
    migrated = true;
  }

  if (version < 3) {
    tasks = migrateV2ToV3(tasks);
    migrated = true;
  }

  return { tasks, migrated };
}

export function loadFromStorage(): { tasks: Task[]; migrated: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], migrated: false };

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (parsed.schemaVersion === CURRENT_SCHEMA_VERSION) {
      return { tasks: (parsed.tasks as Task[]) ?? [], migrated: false };
    }

    const { tasks, migrated } = runMigrations(parsed);
    saveToStorage(tasks);
    return { tasks, migrated };
  } catch {
    return { tasks: [], migrated: false };
  }
}

export function saveToStorage(tasks: Task[]): void {
  try {
    const data: StoredData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error('Unable to save data. Storage may be full or unavailable.');
  }
}

export function isStorageAvailable(): boolean {
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
