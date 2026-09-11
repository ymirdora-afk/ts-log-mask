/**
 * Default regular expressions for matching sensitive data inside strings.
 */
export const SSN_PATTERN = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g;
export const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
export const CREDIT_CARD_PATTERN = /\b(?:\d{4}[- ]?){3}\d{4}\b/g;
export const BEARER_TOKEN_PATTERN = /\bBearer\s+[A-Za-z0-9\-_.~+/]+=*/gi;

export const DEFAULT_PATTERNS = {
  ssn: SSN_PATTERN,
  email: EMAIL_PATTERN,
  creditCard: CREDIT_CARD_PATTERN,
  bearerToken: BEARER_TOKEN_PATTERN,
} as const;

export const DEFAULT_REGEX_PATTERNS: readonly RegExp[] = [
  SSN_PATTERN,
  EMAIL_PATTERN,
  CREDIT_CARD_PATTERN,
  BEARER_TOKEN_PATTERN,
];

export interface MaskOptions {
  /** Field keys to mask in structured objects (case-insensitive substring match). */
  fields?: string[];
  /** Replacement string for masked content. Defaults to '[REDACTED]'. */
  maskString?: string;
  /** Regular expressions to match and redact within string values. */
  patterns?: RegExp[];
  /** Whether to scan and redact patterns in string values. Defaults to true. */
  maskValues?: boolean;
  /** Maximum recursion depth for nested objects and arrays. Defaults to 10. */
  maxDepth?: number;
}
