<script lang="ts">
  import type { Task } from "@/core/models/Task";
  
  export let tasks: Task[] = [];
  export let selectedTaskId: string | undefined = undefined;
  export let onTaskSelect: (task: Task) => void;
  export let onNewTask: () => void;

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString();
  }

  function getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'highest': return '🔴';
      case 'high': return '🟠';
      case 'normal': return '🟡';
      case 'low': return '🟢';
      case 'lowest': return '🔵';
      default: return '⚪';
    }
  }

  function getStatusIcon(status: string): string {
    switch (status) {
      case 'todo': return '☐';
      case 'in-progress': return '⏳';
      case 'done': return '✓';
      default: return '○';
    }
  }
</script>

<div class="task-list-panel">
  <div class="task-list-header">
    <h2>Tasks</h2>
    <button class="new-task-btn" on:click={onNewTask}>
      <span class="icon">+</span>
      New Task
    </button>
  </div>
  
  <div class="task-list-scroll">
    {#if tasks.length === 0}
      <div class="task-list-empty">
        <p>No tasks yet</p>
        <p class="empty-hint">Create your first task to get started</p>
      </div>
    {:else}
      <ul class="task-list">
        {#each tasks as task (task.id)}
          <li 
            class="task-list-item"
            class:selected={task.id === selectedTaskId}
            on:click={() => onTaskSelect(task)}
          >
            <div class="task-item-header">
              <span class="task-status">{getStatusIcon(task.status)}</span>
              <span class="task-priority">{getPriorityIcon(task.priority)}</span>
              <span class="task-name">{task.name || 'Untitled'}</span>
            </div>
            <div class="task-item-meta">
              <span class="task-due">Due: {formatDate(task.dueAt)}</span>
              {#if task.frequency}
                <span class="task-recurring">🔄</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="scss">
  .task-list-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--b3-theme-surface);
    border-right: 1px solid var(--b3-border-color);
  }

  .task-list-header {
    padding: 16px;
    border-bottom: 1px solid var(--b3-border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-list-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--b3-theme-on-surface);
  }

  .new-task-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: var(--b3-theme-primary);
    color: var(--b3-theme-on-primary);
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    .icon {
      font-size: 16px;
      font-weight: 600;
    }

    &:hover {
      opacity: 0.9;
    }
  }

  .task-list-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .task-list-empty {
    padding: 48px 24px;
    text-align: center;
    color: var(--b3-theme-on-surface-variant);

    p {
      margin: 0;
      
      &.empty-hint {
        font-size: 13px;
        margin-top: 8px;
        opacity: 0.8;
      }
    }
  }

  .task-list {
    list-style: none;
    margin: 0;
    padding: 8px;
  }

  .task-list-item {
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
    border: 1px solid transparent;

    &:hover {
      background-color: var(--b3-list-hover);
    }

    &.selected {
      background-color: var(--b3-theme-primary-lightest, var(--b3-list-hover));
      border-color: var(--b3-theme-primary);
    }
  }

  .task-item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .task-status,
  .task-priority {
    font-size: 14px;
    flex-shrink: 0;
  }

  .task-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--b3-theme-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .task-item-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 38px;
    font-size: 12px;
    color: var(--b3-theme-on-surface-variant);
  }

  .task-due {
    flex: 1;
  }

  .task-recurring {
    font-size: 12px;
  }
</style>
