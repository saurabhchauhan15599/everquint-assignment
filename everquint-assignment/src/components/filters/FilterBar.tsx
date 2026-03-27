import { X, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { FilterState, TaskStatus, TaskPriority, SortField, SortDirection } from '../../types';

interface FilterBarProps {
  filters: FilterState;
  hasActiveFilters: boolean;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const ALL_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
const ALL_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

export function FilterBar({ filters, hasActiveFilters, onChange, onReset }: FilterBarProps) {
  function toggleStatus(s: TaskStatus) {
    const current = filters.statuses;
    const next = current.includes(s)
      ? current.filter((x) => x !== s)
      : [...current, s];
    onChange({ statuses: next });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48 space-y-1">
          <Label htmlFor="filter-search" className="text-xs text-slate-500 flex items-center gap-1">
            <Search className="h-3 w-3" />
            Search
          </Label>
          <div className="relative">
            <Input
              id="filter-search"
              placeholder="Title or description..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="h-8 text-sm pr-7"
            />
            {filters.search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => onChange({ search: '' })}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-500 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            Status
          </Label>
          <div className="flex gap-1">
            {ALL_STATUSES.map((s) => {
              const active = filters.statuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  aria-pressed={active}
                  className={
                    `text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ` +
                    (active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50')
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1 min-w-32">
          <Label className="text-xs text-slate-500">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(v) => onChange({ priority: v === 'all' ? '' : v as TaskPriority })}
          >
            <SelectTrigger className="h-8 text-sm" aria-label="Filter by priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {ALL_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-40">
          <Label className="text-xs text-slate-500">Sort by</Label>
          <Select
            value={`${filters.sortField}:${filters.sortDir}`}
            onValueChange={(v) => {
              const [field, dir] = v.split(':');
              onChange({ sortField: field as SortField, sortDir: dir as SortDirection });
            }}
          >
            <SelectTrigger className="h-8 text-sm" aria-label="Sort tasks">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt:desc">Last updated</SelectItem>
              <SelectItem value="createdAt:desc">Newest first</SelectItem>
              <SelectItem value="createdAt:asc">Oldest first</SelectItem>
              <SelectItem value="priority:desc">Priority (high–low)</SelectItem>
              <SelectItem value="priority:asc">Priority (low–high)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-slate-500 hover:text-slate-700 gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
            <Badge variant="secondary" className="ml-0.5 px-1 py-0 text-xs">
              {(filters.statuses.length > 0 ? 1 : 0) +
                (filters.priority ? 1 : 0) +
                (filters.search ? 1 : 0)}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
