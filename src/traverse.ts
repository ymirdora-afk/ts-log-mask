/** Deep-traverse an object and apply a transform to leaf string values. */
export function traverseAndMask(
  obj: unknown,
  transform: (key: string, value: string) => string,
): unknown {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(item => traverseAndMask(item, transform));
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = transform(key, value);
      } else {
        result[key] = traverseAndMask(value, transform);
      }
    }
    return result;
  }
  return obj;
}
