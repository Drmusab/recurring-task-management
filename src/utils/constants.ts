/**
 * Plugin constants
 */

export const PLUGIN_NAME = "plugin-sample-shehab-note";

export const STORAGE_KEY = "recurring-tasks";

export const SETTINGS_KEY = "notification-settings";

export const DOCK_TYPE = "recurring-tasks-dock";

/**
 * Default notification configuration
 */
export const DEFAULT_NOTIFICATION_CONFIG = {
  n8n: {
    webhookUrl: "",
    enabled: false,
  },
  telegram: {
    botToken: "",
    chatId: "",
    enabled: false,
  },
  gmail: {
    clientId: "",
    clientSecret: "",
    refreshToken: "",
    recipientEmail: "",
    enabled: false,
  },
};

/**
 * Scheduler interval (check every minute)
 */
export const SCHEDULER_INTERVAL_MS = 60 * 1000;

/**
 * Timeline days to show
 */
export const TIMELINE_DAYS = 30;
