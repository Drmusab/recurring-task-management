import { Filter } from './FilterBase';
import type { Task } from '@/core/models/Task';
import { RegexMatcher, type RegexSpec } from '../utils/RegexMatcher';

/**
 * Filter tasks by tags using regex
 * Tests each tag individually and returns true if any tag matches
 */
export class TagRegexFilter extends Filter {
  private re: RegExp;

  constructor(spec: RegexSpec, private negate = false) {
    super();
    this.re = RegexMatcher.compile(spec);
  }

  matches(task: Task): boolean {
    if (!task.tags || task.tags.length === 0) {
      return this.negate;
    }
    
    // Test each tag individually
    const result = task.tags.some(tag => RegexMatcher.test(this.re, tag));
    return this.negate ? !result : result;
  }
}
