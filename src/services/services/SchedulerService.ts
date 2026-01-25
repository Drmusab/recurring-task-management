import { Task } from '../commands/types/CommandTypes';

/**
 * Scheduler service interface (existing service)
 * Manages time-based task monitoring
 */
export interface ISchedulerService {
  /**
   * Register task for scheduled checks
   * @param task - Task to monitor
   */
  scheduleTask(task: Task): Promise<void>;

  /**
   * Unregister task from scheduled checks
   * @param taskId - Task ID to unschedule
   */
  unscheduleTask(taskId: string): Promise<void>;

  /**
   * Update scheduled task (e.g., after due date change)
   * @param task - Updated task
   */
  rescheduleTask(task: Task): Promise<void>;

  /**
   * Check if task is currently scheduled
   * @param taskId - Task ID to check
   */
  isScheduled(taskId: string): Promise<boolean>;

  /**
   * Get next check time for task
   * @param taskId - Task ID
   * @returns Next check timestamp or null if not scheduled
   */
  getNextCheckTime(taskId: string): Promise<Date | null>;
}
