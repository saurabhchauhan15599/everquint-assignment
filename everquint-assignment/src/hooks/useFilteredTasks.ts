import { useMemo } from 'react';
import type { Task, FilterState } from '../types';
import { priorityWeight } from '../utils';

export function useFilteredTasks(tasks: Task[], filters: FilterState) {
  return useMemo(() => {
    let result = [...tasks];

    if (filters.statuses.length > 0) {
      result = result.filter((t) => filters.statuses.includes(t.status));
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === 'priority') {
        cmp = priorityWeight(a.priority) - priorityWeight(b.priority);
      } else {
        cmp =
          new Date(a[filters.sortField]).getTime() -
          new Date(b[filters.sortField]).getTime();
      }
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, filters]);
}
