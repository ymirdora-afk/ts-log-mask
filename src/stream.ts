import { Transform, type TransformCallback } from 'node:stream';

/** A transform stream that masks sensitive fields in newline-delimited JSON logs. */
export function createMaskStream(
  maskFn: (obj: unknown) => unknown,
): Transform {
  return new Transform({
    objectMode: false,
    transform(chunk: Buffer, _encoding: string, callback: TransformCallback) {
      const lines = chunk.toString().split('\n');
      const masked = lines.map(line => {
        if (!line.trim()) return line;
        try {
          const parsed = JSON.parse(line);
          return JSON.stringify(maskFn(parsed));
        } catch {
          return line;
        }
      });
      callback(null, masked.join('\n'));
    },
  });
}
