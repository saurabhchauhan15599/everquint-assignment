import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from '../task/TaskCard';
import type { Task, TaskStatus } from '../../types';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const columnConfig: Record<TaskStatus, { header: string; headerClass: string; dotClass: string }> = {
  Todo: {
    header: 'Todo',
    headerClass: 'text-slate-700',
    dotClass: 'bg-slate-400',
  },
  'In Progress': {
    header: 'In Progress',
    headerClass: 'text-blue-700',
    dotClass: 'bg-blue-500',
  },
  'In Review': {
    header: 'In Review',
    headerClass: 'text-violet-700',
    dotClass: 'bg-violet-500',
  },
  Done: {
    header: 'Done',
    headerClass: 'text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
};

export function BoardColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];

  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full shrink-0', config.dotClass)} />
          <h2 className={cn('text-sm font-semibold', config.headerClass)}>
            {config.header}
          </h2>
          <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1.5 font-medium">
            {tasks.length}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-slate-700"
          onClick={() => onAddTask(status)}
          aria-label={`Add task to ${status}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 flex-1 rounded-xl p-2 min-h-[200px] transition-colors duration-150',
          'bg-slate-100/60',
          isOver && 'bg-blue-50 ring-2 ring-inset ring-blue-200',
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2">
            <p className="text-xs text-slate-400 text-center">No tasks here</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-slate-600 h-7"
              onClick={() => onAddTask(status)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add one
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
