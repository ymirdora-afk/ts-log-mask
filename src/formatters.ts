/** Output formatters for masked log entries. */
export type LogFormat = 'json' | 'text' | 'compact';

export function formatEntry(data: unknown, format: LogFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'compact':
      return JSON.stringify(data);
    case 'text':
      if (typeof data === 'object' && data !== null) {
        return Object.entries(data)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(' ');
      }
      return String(data);
  }
}
