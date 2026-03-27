import { useState, useCallback } from 'react';
import type { Task, TaskFormValues, TaskFormErrors, TaskStatus, TaskPriority } from '../types';
import { parseTags } from '../utils';

const EMPTY_FORM: TaskFormValues = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  assignee: '',
  tags: '',
};

function taskToForm(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    tags: task.tags.join(', '),
  };
}

function validate(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  else if (values.title.trim().length > 120) errors.title = 'Title must be 120 characters or fewer.';
  if (!values.description.trim()) errors.description = 'Description is required.';
  return errors;
}

export function useTaskForm(initial?: Task, defaultStatus?: TaskStatus) {
  const [values, setValues] = useState<TaskFormValues>(
    initial ? taskToForm(initial) : { ...EMPTY_FORM, status: defaultStatus ?? 'Todo' },
  );
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const originalValues = initial ? taskToForm(initial) : EMPTY_FORM;

  const handleChange = useCallback(
    (field: keyof TaskFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setIsDirty(true);
    },
    [],
  );

  const handleSubmit = useCallback(
    (
      onValid: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void,
    ): boolean => {
      const errs = validate(values);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return false;
      }
      onValid({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status as TaskStatus,
        priority: values.priority as TaskPriority,
        assignee: values.assignee.trim(),
        tags: parseTags(values.tags),
      });
      setIsDirty(false);
      return true;
    },
    [values],
  );

  const resetForm = useCallback(() => {
    setValues(initial ? taskToForm(initial) : EMPTY_FORM);
    setErrors({});
    setIsDirty(false);
  }, [initial]);

  // Check if values differ from original to determine "dirty"
  const reallyDirty =
    isDirty &&
    JSON.stringify(values) !== JSON.stringify(originalValues);

  return { values, errors, isDirty: reallyDirty, handleChange, handleSubmit, resetForm };
}
