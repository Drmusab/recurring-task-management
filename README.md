# Shehab-Note Recurring Task Manager

A powerful recurring task management plugin for Shehab-Note (SiYuan fork) with advanced scheduling, multi-channel notifications, and visual timeline planning.

## Features

### 🔁 Advanced Recurrence Rules
- **Daily, Weekly, Monthly scheduling** with customizable intervals
- **Fixed-time scheduling** (e.g., every day at 09:00)
- **Weekday-specific rules** for weekly tasks
- **Intelligent rescheduling** after task completion

### 📋 Task Management
- **Today & Overdue View** - Quick access to tasks requiring attention
- **All Tasks View** - Comprehensive task management with enable/disable toggles
- **Timeline View** - Visual calendar showing upcoming tasks for the next 30 days

### 🔔 Multi-Channel Notifications
- **n8n** - Webhook integration for workflow automation
- **Telegram** - Direct messaging via Telegram Bot API
- **Gmail** - Email notifications via Gmail API
- Send custom payloads including notes, media URLs, and links

### 🎯 Task Actions
- **✅ Done** - Mark task complete and automatically schedule next occurrence
- **🕒 Delay** - Postpone task to tomorrow without affecting recurrence pattern
- **✏️ Edit** - Modify task details, frequency, and notification settings
- **🗑️ Delete** - Remove tasks permanently

## Installation

1. Download the latest release from the [releases page](https://github.com/Drmusab/plugin-sample-shehab-note/releases)
2. Extract the `package.zip` to your Shehab-Note plugins directory
3. Restart Shehab-Note or reload plugins
4. Open the "Recurring Tasks" dock panel from the right sidebar

## Development

### Prerequisites
- Node.js 16+ and npm
- Shehab-Note or SiYuan installation

### Setup

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode with auto-rebuild
npm run dev

# Create symbolic link to your workspace (optional)
npm run make-link -- --workspace=/path/to/shehab-note/workspace
```

### Project Structure

```
src/
├── index.ts                      # Main plugin entry point
├── index.scss                    # Global plugin styles
├── core/                         # Core business logic
│   ├── models/                   # Data models (Task, Frequency)
│   ├── engine/                   # Recurrence & scheduling logic
│   └── storage/                  # Data persistence
├── services/                     # External integrations
│   ├── NotificationService.ts    # Notification orchestrator
│   └── senders/                  # Channel-specific senders
├── components/                   # Svelte UI components
│   ├── Dashboard.svelte          # Main dashboard
│   ├── tabs/                     # Tab components
│   ├── cards/                    # Task cards & forms
│   └── settings/                 # Settings panel
└── utils/                        # Utility functions
```

## Usage

### Creating a Task

1. Open the "Recurring Tasks" dock panel
2. Navigate to the "All Tasks" tab
3. Click "Create New Task"
4. Fill in task details:
   - Task name
   - Due date & time
   - Frequency (daily/weekly/monthly)
   - Interval (e.g., every 2 weeks)
   - Optional: Alert payload (note, media, link)
5. Click "Save Task"

### Configuring Notifications

1. Click the ⚙️ Settings button in the dashboard header
2. Enable desired notification channels
3. Configure each channel:
   - **n8n**: Enter your webhook URL
   - **Telegram**: Enter bot token and chat ID
   - **Gmail**: Configure OAuth credentials and recipient email
4. Test each channel before saving
5. Click "Save Settings"

### Managing Tasks

- **Today & Overdue Tab**: View and complete tasks due today or earlier
- **All Tasks Tab**: View all recurring tasks, edit, delete, or toggle enabled/disabled
- **Timeline Tab**: Visual calendar view of upcoming tasks

## Configuration

### n8n Webhook

Get your webhook URL from your n8n workflow and paste it in the settings.

### Telegram Bot

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
4. Enter both in the settings

### Gmail API

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Get your client ID, client secret, and refresh token
5. Enter in the settings along with recipient email

## API

The plugin exposes the following main classes:

- `TaskStorage` - Manages task persistence
- `Scheduler` - Handles task scheduling and notifications
- `RecurrenceEngine` - Calculates next occurrence dates
- `NotificationService` - Orchestrates multi-channel notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please [open an issue](https://github.com/Drmusab/plugin-sample-shehab-note/issues) on GitHub.
