import { useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import { useTaskForm } from '../../hooks/useTaskForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskFormProps {
  initial?: Task;
  defaultStatus?: TaskStatus;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

export function TaskForm({ initial, defaultStatus, onSubmit, onCancel }: TaskFormProps) {
  const { values, errors, isDirty, handleChange, handleSubmit, resetForm } = useTaskForm(initial, defaultStatus);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function handleCancel() {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    resetForm();
    onCancel();
  }

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSubmit(onSubmit);
  }

  return (
    <>
    <ConfirmDialog
      open={discardOpen}
      title="Discard changes?"
      description="You have unsaved changes. They will be lost if you close now."
      confirmLabel="Discard"
      onConfirm={() => { setDiscardOpen(false); resetForm(); onCancel(); }}
      onCancel={() => setDiscardOpen(false)}
    />
    <form onSubmit={onFormSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="task-title">
          Title <span aria-hidden="true" className="text-destructive">*</span>
        </Label>
        <Input
          id="task-title"
          ref={firstFieldRef}
          placeholder="Short task title"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={!!errors.title}
          maxLength={120}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-sm text-destructive">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-desc">
          Description <span aria-hidden="true" className="text-destructive">*</span>
        </Label>
        <Textarea
          id="task-desc"
          placeholder="Describe the task in detail..."
          rows={4}
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          aria-describedby={errors.description ? 'desc-error' : undefined}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p id="desc-error" role="alert" className="text-sm text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="task-status">Status</Label>
          <Select
            value={values.status}
            onValueChange={(v) => handleChange('status', v)}
          >
            <SelectTrigger id="task-status" aria-label="Task status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-priority">Priority</Label>
          <Select
            value={values.priority}
            onValueChange={(v) => handleChange('priority', v)}
          >
            <SelectTrigger id="task-priority" aria-label="Task priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-assignee">Assignee</Label>
        <Input
          id="task-assignee"
          placeholder="Who's responsible?"
          value={values.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-tags">Tags</Label>
        <Input
          id="task-tags"
          placeholder="e.g. frontend, bug, v2 (comma-separated)"
          value={values.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
    </>
  );
}
