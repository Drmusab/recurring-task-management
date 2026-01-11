import type { Task } from "@/core/models/Task";

/**
 * Notification message sent to external channels
 */
export interface NotificationMessage {
  taskName: string;
  dueAt: string;
  payload: {
    note?: string;
    media?: string;
    link?: string;
  };
}

/**
 * Interface for notification senders
 */
export interface NotificationSender {
  /**
   * Send a notification
   * @param message The notification message
   * @returns Promise resolving to success status
   */
  send(message: NotificationMessage): Promise<boolean>;
  
  /**
   * Check if the sender is configured and ready
   */
  isConfigured(): boolean;
}

/**
 * Configuration for n8n webhook
 */
export interface N8nConfig {
  webhookUrl: string;
  enabled: boolean;
}

/**
 * Configuration for Telegram
 */
export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

/**
 * Configuration for Gmail
 */
export interface GmailConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  recipientEmail: string;
  enabled: boolean;
}

/**
 * All notification configuration
 */
export interface NotificationConfig {
  n8n: N8nConfig;
  telegram: TelegramConfig;
  gmail: GmailConfig;
}

/**
 * Creates a notification message from a task
 */
export function createNotificationMessage(task: Task): NotificationMessage {
  return {
    taskName: task.name,
    dueAt: task.dueAt,
    payload: task.alertPayload,
  };
}
