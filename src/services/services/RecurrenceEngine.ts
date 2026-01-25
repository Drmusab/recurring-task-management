import { RecurrencePattern, Task } from '../commands/types/CommandTypes';

/**
 * Recurrence engine interface (existing service)
 * This is the SOURCE OF TRUTH for recurrence calculations
 */
export interface IRecurrenceEngine {
  /**
   * Calculate next due date for a recurring task
   * @param task - The task with recurrence pattern
   * @param baseDate - Base date for calculation (usually last completion)
   * @returns Next due date or null if recurrence ended
   */
  calculateNextDueDate(task: Task, baseDate: Date): Date | null;

  /**
   * Validate if recurrence pattern is valid
   * @param pattern - Recurrence pattern to validate
   * @returns Validation result with errors if invalid
   */
  validatePattern(pattern: RecurrencePattern): {
    valid: boolean;
    errors?: string[];
  };

  /**
   * Preview next N occurrences
   * @param pattern - Recurrence pattern
   * @param startDate - Start date for preview
   * @param count - Number of occurrences to preview
   * @param maxIterations - Safety limit for calculations
   * @returns Array of future due dates
   */
  previewOccurrences(
    pattern: RecurrencePattern,
    startDate: Date,
    count: number,
    maxIterations: number
  ): Date[];

  /**
   * Check if pattern would create forward progress
   * @param pattern - Recurrence pattern
   * @param baseDate - Current date
   * @returns True if next occurrence would be after baseDate
   */
  hasForwardProgress(pattern: RecurrencePattern, baseDate: Date): boolean;
}
