import type {
  NotificationSender,
  NotificationMessage,
  N8nConfig,
} from "../types";

/**
 * N8nSender sends notifications via n8n webhook
 */
export class N8nSender implements NotificationSender {
  private config: N8nConfig;

  constructor(config: N8nConfig) {
    this.config = config;
  }

  async send(message: NotificationMessage): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn("N8n sender not configured");
      return false;
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error("N8n webhook failed:", response.statusText);
        return false;
      }

      console.log("N8n notification sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send n8n notification:", error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.config.enabled && !!this.config.webhookUrl;
  }

  updateConfig(config: N8nConfig): void {
    this.config = config;
  }
}
