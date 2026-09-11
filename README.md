# ts-log-mask

A lightweight, zero-dependency TypeScript log sanitizer that masks sensitive fields (passwords, tokens, SSNs, credit cards, emails) in structured log output before it reaches stdout.

## Features

- **Key-based Redaction**: Automatically masks sensitive object keys including `password`, `secret`, `token`, `authorization`, `ssn`, and `creditCard`.
- **In-Value Pattern Masking**: Scans string values for Social Security numbers, email addresses, credit cards, and Bearer authorization tokens.
- **Deep Traversal**: Recursively sanitizes nested objects and arrays with configurable max depth protection.
- **Safe & Immutable**: Protects against circular references and returns sanitized clones without mutating source data.

## Installation

```bash
npm install ts-log-mask
```

## Quick Start

```typescript
import { createMasker } from 'ts-log-mask';

const mask = createMasker();

const logData = {
  event: 'user_login',
  user: {
    email: 'alex@example.com',
    password: 'SuperSecretPassword123!',
    profile: {
      ssn: '123-45-6789',
    },
  },
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
};

console.log(mask(logData));
```

## Options

Pass configuration options to `createMasker`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fields` | `string[]` | Default fields | Object keys to mask (case-insensitive) |
| `maskString` | `string` | `'[REDACTED]'` | Replacement token for sensitive values |
| `patterns` | `RegExp[]` | Standard PII | Regular expressions to redact inside strings |
| `maskValues` | `boolean` | `true` | Scan and redact regex matches within strings |
| `maxDepth` | `number` | `10` | Maximum recursion depth for nested objects |

## License

MIT
