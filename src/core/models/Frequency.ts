/**
 * Frequency types for recurring tasks
 */
export type FrequencyType = "daily" | "weekly" | "monthly";

/**
 * Frequency/Recurrence rule definition
 */
export interface Frequency {
  /** Type of recurrence */
  type: FrequencyType;
  
  /** Interval multiplier (e.g., every 2 weeks) */
  interval: number;
  
  /** Optional fixed time in HH:mm format (e.g., "09:00") */
  time?: string;
  
  /** For weekly rules: days of week (0-6, Sunday-Saturday) */
  weekdays?: number[];
}

/**
 * Creates a default daily frequency
 */
export function createDefaultFrequency(): Frequency {
  return {
    type: "daily",
    interval: 1,
    time: "09:00",
  };
}

/**
 * Validates a frequency object
 */
export function isValidFrequency(frequency: Frequency): boolean {
  if (!frequency || !frequency.type || !frequency.interval) {
    return false;
  }
  
  if (frequency.interval < 1) {
    return false;
  }
  
  if (frequency.type === "weekly" && frequency.weekdays) {
    return frequency.weekdays.every(day => day >= 0 && day <= 6);
  }
  
  return true;
}
