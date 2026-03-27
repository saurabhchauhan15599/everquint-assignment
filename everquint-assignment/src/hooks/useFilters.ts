import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { FilterState, SortField, SortDirection, TaskStatus, TaskPriority } from '../types';

const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  priority: '',
  search: '',
  sortField: 'updatedAt',
  sortDir: 'desc',
};

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const statusParam = searchParams.get('status');
    const statuses = statusParam
      ? (statusParam.split(',').filter(Boolean) as TaskStatus[])
      : [];

    return {
      statuses,
      priority: (searchParams.get('priority') as TaskPriority | '') ?? '',
      search: searchParams.get('search') ?? '',
      sortField: (searchParams.get('sortField') as SortField) ?? 'updatedAt',
      sortDir: (searchParams.get('sortDir') as SortDirection) ?? 'desc',
    };
  }, [searchParams]);

  function setFilters(patch: Partial<FilterState>) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const merged = { ...filters, ...patch };

        if (merged.statuses.length > 0) {
          next.set('status', merged.statuses.join(','));
        } else {
          next.delete('status');
        }

        if (merged.priority) {
          next.set('priority', merged.priority);
        } else {
          next.delete('priority');
        }

        if (merged.search) {
          next.set('search', merged.search);
        } else {
          next.delete('search');
        }

        next.set('sortField', merged.sortField);
        next.set('sortDir', merged.sortDir);

        return next;
      },
      { replace: true },
    );
  }

  function resetFilters() {
    setSearchParams({}, { replace: true });
  }

  const hasActiveFilters =
    filters.statuses.length > 0 || !!filters.priority || !!filters.search;

  return { filters, setFilters, resetFilters, hasActiveFilters, DEFAULT_FILTERS };
}
