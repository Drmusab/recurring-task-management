import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { TaskStorage } from "@/core/storage/TaskStorage";
import { createTask } from "@/core/models/Task";
import type { Frequency } from "@/core/models/Frequency";
import { STORAGE_ACTIVE_KEY } from "@/utils/constants";

const mockPlugin = {
  loadData: vi.fn(),
  saveData: vi.fn(),
  data: {} as Record<string, any>,
} as any;

describe("TaskStorage persistence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockPlugin.data = {};
    mockPlugin.loadData.mockImplementation((key: string) => Promise.resolve(mockPlugin.data[key]));
    mockPlugin.saveData.mockImplementation((key: string, value: any) => {
      mockPlugin.data[key] = value;
      return Promise.resolve();
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("persists the latest state and reloads correctly after restart", async () => {
    const frequency: Frequency = {
      type: "daily",
      interval: 1,
      time: "09:00",
    };

    const storage = new TaskStorage(mockPlugin);
    await storage.init();

    const task = createTask("Persisted Task", frequency);
    await storage.saveTask(task);

    const flushPromise = storage.flush();
    vi.advanceTimersByTime(60);
    await flushPromise;

    expect(mockPlugin.data[STORAGE_ACTIVE_KEY]?.tasks?.length).toBe(1);

    const restarted = new TaskStorage(mockPlugin);
    await restarted.init();

    const reloaded = restarted.getTask(task.id);
    expect(reloaded).toBeDefined();
    expect(reloaded?.id).toBe(task.id);
  });
});
