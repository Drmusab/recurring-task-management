import type { Plugin } from "siyuan";
import type { Task } from "@/core/models/Task";
import type {
  NotificationConfig,
  NotificationMessage,
  NotificationSender,
} from "./types";
import { N8nSender } from "./senders/N8nSender";
import { TelegramSender } from "./senders/TelegramSender";
import { GmailSender } from "./senders/GmailSender";
import { createNotificationMessage } from "./types";
import { SETTINGS_KEY, DEFAULT_NOTIFICATION_CONFIG } from "@/utils/constants";

/**
 * NotificationService orchestrates notification delivery across multiple channels
 */
export class NotificationService {
  private plugin: Plugin;
  private config: NotificationConfig;
  private senders: Map<string, NotificationSender>;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.config = { ...DEFAULT_NOTIFICATION_CONFIG };
    this.senders = new Map();
  }

  /**
   * Initialize the notification service
   */
  async init(): Promise<void> {
    await this.loadConfig();
    this.initializeSenders();
  }

  /**
   * Load notification configuration from storage
   */
  private async loadConfig(): Promise<void> {
    try {
      const data = await this.plugin.loadData(SETTINGS_KEY);
      if (data) {
        this.config = { ...DEFAULT_NOTIFICATION_CONFIG, ...data };
      }
    } catch (err) {
      console.error("Failed to load notification config:", err);
    }
  }

  /**
   * Save notification configuration to storage
   */
  async saveConfig(config: NotificationConfig): Promise<void> {
    this.config = config;
    await this.plugin.saveData(SETTINGS_KEY, config);
    this.initializeSenders(); // Reinitialize senders with new config
  }

  /**
   * Initialize notification senders
   */
  private initializeSenders(): void {
    this.senders.clear();
    this.senders.set("n8n", new N8nSender(this.config.n8n));
    this.senders.set("telegram", new TelegramSender(this.config.telegram));
    this.senders.set("gmail", new GmailSender(this.config.gmail));
  }

  /**
   * Send notification for a task
   */
  async notifyTask(task: Task): Promise<void> {
    const message = createNotificationMessage(task);
    const results: { [key: string]: boolean } = {};

    // Send to all configured channels in parallel
    const promises = Array.from(this.senders.entries()).map(
      async ([name, sender]) => {
        if (sender.isConfigured()) {
          results[name] = await sender.send(message);
        }
      }
    );

    await Promise.all(promises);

    // Log results
    const successCount = Object.values(results).filter(Boolean).length;
    const totalConfigured = Object.keys(results).length;
    
    console.log(
      `Sent notifications for task "${task.name}": ${successCount}/${totalConfigured} successful`
    );
  }

  /**
   * Get current configuration
   */
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  /**
   * Test a specific notification channel
   */
  async testChannel(channel: "n8n" | "telegram" | "gmail"): Promise<boolean> {
    const sender = this.senders.get(channel);
    if (!sender || !sender.isConfigured()) {
      return false;
    }

    const testMessage: NotificationMessage = {
      taskName: "Test Notification",
      dueAt: new Date().toISOString(),
      payload: {
        note: "This is a test notification from Shehab-Note Recurring Tasks plugin.",
      },
    };

    return await sender.send(testMessage);
  }
}
