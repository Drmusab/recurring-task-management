import { Filter } from './FilterBase';
import type { Task } from '@/core/models/Task';

export class DescriptionFilter extends Filter {
  constructor(
    private operator: 'includes' | 'does not include' | 'regex',
    private pattern: string,
    private caseSensitive = false
  ) {
    super();
  }

  matches(task: Task): boolean {
    // Search in both task name and description field
    const taskName = task.name || '';
    const taskDescription = task.description || '';
    const combinedText = `${taskName} ${taskDescription}`.trim();
    
    switch (this.operator) {
      case 'includes': {
        const needle = this.caseSensitive ? this.pattern : this.pattern.toLowerCase();
        const haystack = this.caseSensitive ? combinedText : combinedText.toLowerCase();
        return haystack.includes(needle);
      }
      case 'does not include': {
        const needle = this.caseSensitive ? this.pattern : this.pattern.toLowerCase();
        const haystack = this.caseSensitive ? combinedText : combinedText.toLowerCase();
        return !haystack.includes(needle);
      }
      case 'regex': {
        try {
          const flags = this.caseSensitive ? '' : 'i';
          const regex = new RegExp(this.pattern, flags);
          return regex.test(combinedText);
        } catch {
          return false;
        }
      }
    }
  }
}
