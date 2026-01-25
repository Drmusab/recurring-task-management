import { Task } from '../commands/types/CommandTypes';
import { SearchTasksData } from '../commands/types/BulkCommandTypes';

/**
 * Advanced task search engine
 */
export class TaskSearchEngine {
  /**
   * Search tasks with text query and filters
   */
  search(tasks: Task[], searchData: SearchTasksData): Task[] {
    let results = [...tasks];

    // Apply text search
    if (searchData.query && searchData.query.trim().length > 0) {
      const query = searchData.query.toLowerCase();
      const fields = searchData.searchFields || ['title', 'description', 'tags'];

      results = results.filter((task) => {
        if (fields.includes('title') && task.title.toLowerCase().includes(query)) {
          return true;
        }
        if (
          fields.includes('description') &&
          task.description?.toLowerCase().includes(query)
        ) {
          return true;
        }
        if (fields.includes('tags') && task.tags.some((tag) => tag.toLowerCase().includes(query))) {
          return true;
        }
        return false;
      });
    }

    // Apply filters
    if (searchData.filters) {
      results = this.applyFilters(results, searchData.filters);
    }

    // Apply sorting
    if (searchData.sort) {
      results = this.applySorting(results, searchData.sort);
    }

    return results;
  }

  /**
   * Apply filters to tasks
   */
  private applyFilters(tasks: Task[], filters: any): Task[] {
    let filtered = [...tasks];

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((task) => filters.status.includes(task.status));
    }

    // Tags filter (any match)
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((task) =>
        filters.tags.some((tag: string) => task.tags.includes(tag))
      );
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((task) => filters.priority.includes(task.priority));
    }

    // Recurrence filter
    if (filters.hasRecurrence !== undefined) {
      filtered = filtered.filter((task) =>
        filters.hasRecurrence
          ? task.recurrencePattern !== null
          : task.recurrencePattern === null
      );
    }

    // Date filters
    if (filters.dueBefore) {
      const before = new Date(filters.dueBefore);
      filtered = filtered.filter(
        (task) => task.nextDueDate && new Date(task.nextDueDate) < before
      );
    }

    if (filters.dueAfter) {
      const after = new Date(filters.dueAfter);
      filtered = filtered.filter(
        (task) => task.nextDueDate && new Date(task.nextDueDate) > after
      );
    }

    if (filters.createdBefore) {
      const before = new Date(filters.createdBefore);
      filtered = filtered.filter((task) => new Date(task.createdAt) < before);
    }

    if (filters.createdAfter) {
      const after = new Date(filters.createdAfter);
      filtered = filtered.filter((task) => new Date(task.createdAt) > after);
    }

    if (filters.completedBefore) {
      const before = new Date(filters.completedBefore);
      filtered = filtered.filter(
        (task) => task.completedAt && new Date(task.completedAt) < before
      );
    }

    if (filters.completedAfter) {
      const after = new Date(filters.completedAfter);
      filtered = filtered.filter(
        (task) => task.completedAt && new Date(task.completedAt) > after
      );
    }

    return filtered;
  }

  /**
   * Apply sorting to tasks
   */
  private applySorting(tasks: Task[], sort: { field: string; order: string }): Task[] {
    const sorted = [...tasks];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'dueDate':
          aValue = a.nextDueDate ? new Date(a.nextDueDate).getTime() : Infinity;
          bValue = b.nextDueDate ? new Date(b.nextDueDate).getTime() : Infinity;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'completedAt':
          aValue = a.completedAt ? new Date(a.completedAt).getTime() : Infinity;
          bValue = b.completedAt ? new Date(b.completedAt).getTime() : Infinity;
          break;
        case 'priority':
          const priorityMap = { low: 1, medium: 2, high: 3 };
          aValue = priorityMap[a.priority];
          bValue = priorityMap[b.priority];
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
}
