import { DEFAULT_REGEX_PATTERNS, type MaskOptions } from './patterns.js';

export * from './patterns.js';

const DEFAULT_FIELDS: readonly string[] = [
  'password',
  'secret',
  'token',
  'authorization',
  'ssn',
  'creditCard',
];

const DEFAULT_MASK = '[REDACTED]';

/**
 * Creates a structured log sanitizer that masks sensitive keys and patterns.
 *
 * @param options - Configuration options for field masking, regexes, and depth.
 * @returns A mask function that deep-cleans objects and values before logging.
 */
export function createMasker(options: MaskOptions = {}): (obj: unknown) => unknown {
  const maskString = options.maskString ?? DEFAULT_MASK;
  const maxDepth = options.maxDepth ?? 10;
  const maskValues = options.maskValues ?? true;

  const sensitiveFields = (options.fields ?? DEFAULT_FIELDS).map((f) => f.toLowerCase());
  const patterns = (options.patterns ?? DEFAULT_REGEX_PATTERNS).map(
    (p) => new RegExp(p.source, p.flags.includes('g') ? p.flags : `${p.flags}g`)
  );

  function isSensitiveKey(key: string): boolean {
    const lower = key.toLowerCase();
    const stripped = lower.replace(/[-_]/g, '');
    return sensitiveFields.some((field) => {
      const f = field.toLowerCase();
      const s = f.replace(/[-_]/g, '');
      return lower === f || lower.includes(f) || stripped === s || stripped.includes(s);
    });
  }

  function maskText(str: string): string {
    let result = str;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      result = result.replace(pattern, maskString);
    }
    return result;
  }

  function walk(value: unknown, depth: number, seen: WeakSet<object>): unknown {
    if (value === null || typeof value !== 'object') {
      return maskValues && typeof value === 'string' ? maskText(value) : value;
    }
    if (depth >= maxDepth) {
      return value;
    }
    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);

    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags);
    }
    if (Array.isArray(value)) {
      return value.map((item) => walk(item, depth + 1, seen));
    }

    const output: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      output[key] = isSensitiveKey(key) ? maskString : walk(val, depth + 1, seen);
    }
    return output;
  }

  return function mask(obj: unknown): unknown {
    return walk(obj, 0, new WeakSet<object>());
  };
}
