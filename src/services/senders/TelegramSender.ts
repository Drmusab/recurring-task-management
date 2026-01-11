import type {
  NotificationSender,
  NotificationMessage,
  TelegramConfig,
} from "../types";

/**
 * TelegramSender sends notifications via Telegram Bot API
 */
export class TelegramSender implements NotificationSender {
  private config: TelegramConfig;

  constructor(config: TelegramConfig) {
    this.config = config;
  }

  async send(message: NotificationMessage): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn("Telegram sender not configured");
      return false;
    }

    try {
      const text = this.formatMessage(message);
      const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Telegram API error:", error);
        return false;
      }

      console.log("Telegram notification sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      return false;
    }
  }

  isConfigured(): boolean {
    return (
      this.config.enabled &&
      !!this.config.botToken &&
      !!this.config.chatId
    );
  }

  updateConfig(config: TelegramConfig): void {
    this.config = config;
  }

  private formatMessage(message: NotificationMessage): string {
    let text = `<b>🔔 Task Reminder</b>\n\n`;
    text += `<b>Task:</b> ${message.taskName}\n`;
    text += `<b>Due:</b> ${new Date(message.dueAt).toLocaleString()}\n`;

    if (message.payload.note) {
      text += `\n<b>Note:</b> ${message.payload.note}`;
    }

    if (message.payload.link) {
      text += `\n<b>Link:</b> ${message.payload.link}`;
    }

    if (message.payload.media) {
      text += `\n<b>Media:</b> ${message.payload.media}`;
    }

    return text;
  }
}
