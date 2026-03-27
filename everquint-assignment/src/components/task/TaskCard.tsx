import { memo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Task, TaskPriority } from '../../types';
import { relativeTime } from '../../utils';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  Low: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  High: {
    label: 'High',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(task);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        data-testid={`task-card-${task.id}`}
        className={cn(
          'group relative bg-white rounded-lg border border-slate-200 p-3 shadow-sm',
          'hover:border-slate-300 hover:shadow-md transition-all duration-150',
          isDragging && 'opacity-50 shadow-lg ring-2 ring-primary/40',
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 cursor-grab opacity-30 md:opacity-0 md:group-hover:opacity-40 hover:opacity-70! transition-opacity p-1 rounded touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>

        <div className="pl-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge
              variant="outline"
              className={cn('text-xs font-medium px-1.5 py-0.5', priority.className)}
            >
              {priority.label}
            </Badge>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleEdit}
                    aria-label="Edit task"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-900 leading-snug mb-2 line-clamp-2">
            {task.title}
          </p>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 font-normal">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 font-normal">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span className="truncate max-w-[60%]">
              {task.assignee ? `@ ${task.assignee}` : <span className="italic">Unassigned</span>}
            </span>
            <span className="shrink-0">{relativeTime(task.updatedAt)}</span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task"
        description={`"${task.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => { setConfirmOpen(false); onDelete(task.id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
});
