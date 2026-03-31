import { useEffect, useMemo, useState } from 'react';
import { Plus, LayoutDashboard, Code2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { Board } from './components/board/Board';
import { FilterBar } from './components/filters/FilterBar';
import { TaskDialog } from './components/task/TaskDialog';
import { AlgorithmDashboard } from './components/algorithms/AlgorithmDashboard';
import { useTaskStore } from './store/taskStore';
import { useFilters } from './hooks/useFilters';
import { useFilteredTasks } from './hooks/useFilteredTasks';
import type { Task, TaskStatus } from './types/index';
import { isStorageAvailable } from './services/storage';

export default function App() {
  const { tasks, storageError, initStore, createTask } = useTaskStore();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useFilters();
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const [view, setView] = useState<'kanban' | 'algorithms'>('kanban');

  useEffect(() => {
    initStore();
  }, [initStore]);

  const storageAvailable = isStorageAvailable();

  const filteredTasks = useFilteredTasks(tasks, filters);

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      Todo: [],
      'In Progress': [],
      'In Review': [],
      Done: [],
    };
    filteredTasks.forEach((task: Task) => {
      const s = task.status;
      if (groups[s]) {
        groups[s].push(task);
      }
    });
    return groups;
  }, [filteredTasks]);

  const allHiddenByFilter =
    hasActiveFilters && filteredTasks.length === 0 && tasks.length > 0;

  return (
    <TooltipProvider delayDuration={400}>
      <div className="min-h-screen bg-slate-50">
        {!storageAvailable && (view === 'kanban') && (
          <div
            role="alert"
            className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 text-center"
          >
            LocalStorage is unavailable. Your changes won't be saved.
          </div>
        )}
        {storageError && (view === 'kanban') && (
          <div
            role="alert"
            className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 text-center"
          >
            {storageError}
          </div>
        )}

        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-slate-900 text-sm sm:text-base">
                Interview Dashboard
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:block mr-2">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </span>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              {view === 'kanban' ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setView('algorithms')} className="gap-1.5 h-8">
                    <Code2 className="h-3.5 w-3.5" />
                    Algorithms
                  </Button>
                  <Button size="sm" onClick={() => setNewTaskOpen(true)} className="gap-1.5 h-8">
                    <Plus className="h-3.5 w-3.5" />
                    New Task
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setView('kanban')} className="gap-1.5 h-8">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Kanban Board
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {view === 'algorithms' ? (
            <AlgorithmDashboard onBack={() => setView('kanban')} />
          ) : (
            <>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <LayoutDashboard className="h-8 w-8 text-slate-300" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-700 mb-1">
                      Your board is empty
                    </h1>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Create your first task to get started tracking your team's work.
                    </p>
                  </div>
                  <Button onClick={() => setNewTaskOpen(true)} className="mt-2 gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create first task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FilterBar
                    filters={filters}
                    hasActiveFilters={hasActiveFilters}
                    onChange={setFilters}
                    onReset={resetFilters}
                  />

                  {allHiddenByFilter ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                      <p className="text-sm text-slate-500">
                        No tasks match your current filters.
                      </p>
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <Board tasksByStatus={tasksByStatus} />
                  )}
                </div>
              )}
            </>
          )}
        </main>

        <TaskDialog
          open={newTaskOpen}
          onOpenChange={setNewTaskOpen}
          onSubmit={(data) => createTask(data)}
        />

        <Toaster richColors position="bottom-right" />

      </div>
    </TooltipProvider>
  );
}
