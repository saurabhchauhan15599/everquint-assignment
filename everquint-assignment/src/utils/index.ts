import { formatDistanceToNow } from 'date-fns';
import type { TaskPriority } from '../types';
import { PRIORITY_ORDER } from '../types';

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function relativeTime(isoDate: string): string {
  try {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
  } catch {
    return 'some time ago';
  }
}

export function priorityWeight(p: TaskPriority): number {
  return PRIORITY_ORDER[p] ?? 0;
}

export function clsx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
