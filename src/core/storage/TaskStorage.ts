import type { Task } from "@/core/models/Task";
import type { Plugin } from "siyuan";
import { STORAGE_KEY } from "@/utils/constants";

/**
 * TaskStorage manages task persistence using SiYuan storage API
 */
export class TaskStorage {
  private plugin: Plugin;
  private tasks: Map<string, Task>;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.tasks = new Map();
  }

  /**
   * Initialize storage by loading tasks from disk
   */
  async init(): Promise<void> {
    try {
      const data = await this.plugin.loadData(STORAGE_KEY);
      if (data && Array.isArray(data.tasks)) {
        this.tasks = new Map(data.tasks.map((task: Task) => [task.id, task]));
        console.log(`Loaded ${this.tasks.size} tasks from storage`);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      this.tasks = new Map();
    }
  }

  /**
   * Save all tasks to disk
   */
  async save(): Promise<void> {
    try {
      const tasks = Array.from(this.tasks.values());
      await this.plugin.saveData(STORAGE_KEY, { tasks });
      console.log(`Saved ${tasks.length} tasks to storage`);
    } catch (err) {
      console.error("Failed to save tasks:", err);
      throw err;
    }
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get a task by ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Add or update a task
   */
  async saveTask(task: Task): Promise<void> {
    task.updatedAt = new Date().toISOString();
    this.tasks.set(task.id, task);
    await this.save();
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    this.tasks.delete(id);
    await this.save();
  }

  /**
   * Get enabled tasks
   */
  getEnabledTasks(): Task[] {
    return this.getAllTasks().filter((task) => task.enabled);
  }

  /**
   * Get tasks due today or earlier
   */
  getTodayAndOverdueTasks(): Task[] {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    return this.getEnabledTasks().filter((task) => {
      const dueDate = new Date(task.dueAt);
      return dueDate <= endOfToday;
    });
  }

  /**
   * Get tasks in a date range
   */
  getTasksInRange(startDate: Date, endDate: Date): Task[] {
    return this.getEnabledTasks().filter((task) => {
      const dueDate = new Date(task.dueAt);
      return dueDate >= startDate && dueDate <= endDate;
    });
  }

  /**
   * Clear all tasks (for testing/reset)
   */
  async clearAll(): Promise<void> {
    this.tasks.clear();
    await this.save();
  }
}
