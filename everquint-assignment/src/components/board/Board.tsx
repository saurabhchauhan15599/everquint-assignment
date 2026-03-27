import { useState, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from '../task/TaskCard';
import { TaskDialog } from '../task/TaskDialog';
import type { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { STATUS_COLUMNS } from '../../types';

interface BoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
}

export function Board({ tasksByStatus }: BoardProps) {
  const { moveTask, createTask, updateTask, deleteTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('Todo');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart(event: DragStartEvent) {
    const all = STATUS_COLUMNS.flatMap((s) => tasksByStatus[s]);
    const task = all.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const activeId = active.id as string;

    const isOverColumn = STATUS_COLUMNS.includes(overId as TaskStatus);
    if (isOverColumn && overId !== activeTask?.status) {
      moveTask(activeId, overId as TaskStatus);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const overId = over.id as string;
    const activeId = active.id as string;

    const isOverColumn = STATUS_COLUMNS.includes(overId as TaskStatus);
    if (isOverColumn) {
      moveTask(activeId, overId as TaskStatus);
      return;
    }

    for (const status of STATUS_COLUMNS) {
      const col = tasksByStatus[status];
      if (col.some((t) => t.id === overId)) {
        moveTask(activeId, status);
        return;
      }
    }
  }

  const handleAddTask = useCallback((status: TaskStatus) => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setDialogOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id);
  }, [deleteTask]);

  function handleSubmit(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      createTask(data);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 scale-105">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />
    </>
  );
}
