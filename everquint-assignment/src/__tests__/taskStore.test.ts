/**
 * Core workflow test: creating a task and verifying it appears in the store,
 * then updating status and confirming the change persists.
 */
import { useTaskStore } from '../store/taskStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Reset Zustand store between tests
beforeEach(() => {
  localStorageMock.clear();
  useTaskStore.setState({
    tasks: [],
    toasts: [],
    storageError: null,
    migrationPerformed: false,
  });
});

describe('Task creation workflow', () => {
  it('creates a task and adds it to the store', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'Write unit tests',
      description: 'Cover the core workflows',
      status: 'Todo',
      priority: 'High',
      assignee: 'Alice',
      tags: ['testing'],
    });

    const { tasks } = useTaskStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Write unit tests');
    expect(tasks[0].status).toBe('Todo');
    expect(tasks[0].priority).toBe('High');
    expect(tasks[0].id).toBeTruthy();
    expect(tasks[0].createdAt).toBeTruthy();
  });

  it('persists the task to localStorage on creation', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'Persisted task',
      description: 'Should be in storage',
      status: 'Todo',
      priority: 'Low',
      assignee: '',
      tags: [],
    });

    const raw = localStorageMock.getItem('workflow-board-data');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.tasks).toHaveLength(1);
    expect(parsed.tasks[0].title).toBe('Persisted task');
  });

  it('persists created task to localStorage', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'Storage check',
      description: 'Verifying persistence',
      status: 'Todo',
      priority: 'Medium',
      assignee: '',
      tags: [],
    });

    const raw = localStorageMock.getItem('workflow-board-data');
    const parsed = JSON.parse(raw!);
    expect(parsed.tasks.some((t: { title: string }) => t.title === 'Storage check')).toBe(true);
  });
});

describe('Task status changes', () => {
  it('moves a task to a new status column', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'Movable task',
      description: 'Will be moved',
      status: 'Todo',
      priority: 'Medium',
      assignee: '',
      tags: [],
    });

    const taskId = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().moveTask(taskId, 'In Progress');

    const moved = useTaskStore.getState().tasks.find((t) => t.id === taskId);
    expect(moved?.status).toBe('In Progress');
  });

  it('updates updatedAt when a task is moved', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'Timestamp task',
      description: 'Checking timestamp',
      status: 'Todo',
      priority: 'Low',
      assignee: '',
      tags: [],
    });

    const before = useTaskStore.getState().tasks[0].updatedAt;

    // Small delay to ensure timestamp differs
    const later = new Date(Date.now() + 1000).toISOString();
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce(later);

    useTaskStore.getState().moveTask(useTaskStore.getState().tasks[0].id, 'Done');

    const after = useTaskStore.getState().tasks[0].updatedAt;
    expect(after).not.toBe(before);

    jest.restoreAllMocks();
  });

  it('deletes a task from the store', () => {
    const store = useTaskStore.getState();
    store.createTask({
      title: 'To be deleted',
      description: 'Gone soon',
      status: 'Todo',
      priority: 'Low',
      assignee: '',
      tags: [],
    });

    const taskId = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().deleteTask(taskId);

    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });
});
