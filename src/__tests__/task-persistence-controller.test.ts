import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TaskPersistenceController } from "@/core/storage/TaskPersistenceController";
import type { TaskState, TaskStateWriter } from "@/core/storage/TaskPersistenceController";

function createState(label: string): TaskState {
  return {
    tasks: [
      {
        id: label,
        name: label,
        dueAt: new Date().toISOString(),
        frequency: { type: "daily", interval: 1, time: "09:00" },
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  } as TaskState;
}

describe("TaskPersistenceController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("coalesces rapid save requests and persists only the latest state", async () => {
    const writes: TaskState[] = [];
    const writer: TaskStateWriter = {
      write: vi.fn(async (state) => {
        writes.push(state);
      }),
    };

    const controller = new TaskPersistenceController(writer, 10);

    controller.requestSave(createState("first"));
    controller.requestSave(createState("second"));
    controller.requestSave(createState("third"));

    vi.advanceTimersByTime(15);
    await controller.flush();

    expect(writes.length).toBe(1);
    expect(writes[0].tasks[0].id).toBe("third");
  });

  it("serializes writes so newer saves never overlap older writes", async () => {
    const started: string[] = [];
    let firstResolve: (() => void) | null = null;
    const writer: TaskStateWriter = {
      write: vi.fn((state) => {
        started.push(state.tasks[0].id);
        if (started.length === 1) {
          return new Promise<void>((resolve) => {
            firstResolve = resolve;
          });
        }
        return Promise.resolve();
      }),
    };

    const controller = new TaskPersistenceController(writer, 0);

    controller.requestSave(createState("first"));
    await vi.runAllTimersAsync();

    controller.requestSave(createState("second"));
    controller.requestSave(createState("third"));

    expect(started).toEqual(["first"]);

    firstResolve?.();
    await controller.flush();

    expect(started).toEqual(["first", "third"]);
  });

  it("retries once after a failed write", async () => {
    const writer: TaskStateWriter = {
      write: vi
        .fn()
        .mockRejectedValueOnce(new Error("disk busy"))
        .mockResolvedValueOnce(undefined),
    };

    const controller = new TaskPersistenceController(writer, 0);

    controller.requestSave(createState("retry"));
    vi.advanceTimersByTime(0);
    await controller.flush();

    expect(writer.write).toHaveBeenCalledTimes(2);
  });

  it("eventually persists after transient failures", async () => {
    const writer: TaskStateWriter = {
      write: vi
        .fn()
        .mockRejectedValueOnce(new Error("temporary"))
        .mockRejectedValueOnce(new Error("temporary"))
        .mockResolvedValueOnce(undefined),
    };

    const controller = new TaskPersistenceController(writer, 0);

    controller.requestSave(createState("recover"));
    await vi.runAllTimersAsync();
    await controller.flush();

    expect(writer.write).toHaveBeenCalledTimes(3);
  });
});
