import { Filter } from './FilterBase';
import type { Task } from '@/core/models/Task';
import { RegexMatcher, type RegexSpec } from '../utils/RegexMatcher';

/**
 * Filter tasks by path using regex
 */
export class PathRegexFilter extends Filter {
  private re: RegExp;

  constructor(spec: RegexSpec, private negate = false) {
    super();
    this.re = RegexMatcher.compile(spec);
  }

  matches(task: Task): boolean {
    const path = task.path || '';
    const result = RegexMatcher.test(this.re, path);
    return this.negate ? !result : result;
  }
}
