import { APIResponse, expect } from '@playwright/test';
import type { ZodSchema } from 'zod';

/**
 * Reusable API assertion helpers.
 *
 * These wrap the boilerplate `expect(res.status(), '...').toBe(x)` patterns so
 * every spec reads as intent, not as plumbing. All helpers default to
 * `expect.soft(...)` so a single test run reports every failure instead of
 * stopping at the first one — pass `{ soft: false }` when you need a hard fail.
 */
export interface AssertOpts {
  /** When false, use hard `expect` (aborts on first failure). Default: true. */
  soft?: boolean;
  /** Extra label prefixed to the assertion message. */
  label?: string;
}

const ex = (opts?: AssertOpts) => (opts?.soft === false ? expect : expect.soft);

/** Assert the HTTP status code of an API response. */
export function validateStatus(res: APIResponse,expectedStatus: number, opts?: AssertOpts): void {
        ex(opts)(
            res.status(),`${opts?.label ?? 'Status'} - Expected ${expectedStatus},but got ${res.status()} ${res.statusText()}`
        ).toBe(expectedStatus);
}

/** Assert the HTTP statusText (e.g. "Bad Request"). */
export function validateStatusText(res: APIResponse, expectedText: string, opts?: AssertOpts,): void {
  ex(opts)(
    res.statusText(), `${opts?.label ?? 'StatusText'} — expected "${expectedText}", got "${res.statusText()}"`,
  ).toBe(expectedText);
}

/**
 * Assert the standard ShoppersStack error envelope shape:
 *   { statusCode, message, data }
 *
 * `data` may be either a plain string ("Given user ID or password is wrong")
 * or an object of field-errors ({ city: 'must not be null' }).
 */
export function validateError(body: any, statusCode: number, message: string, 
    data: string | Record<string, unknown>, opts?: AssertOpts,): void {
  ex(opts)(body, `${opts?.label ?? 'Error body'} — envelope`).toMatchObject({
    statusCode,
    message,
    data,
  });
}

/** Assert that a response body conforms to a Zod schema. */
export function validateSchema<T>( body: unknown,schema: ZodSchema<T>,opts?: AssertOpts,): void {
  const result = schema.safeParse(body);
  ex(opts)( result.success, `${opts?.label ?? 'Schema'} — validation failed: 
    ${result.success ? '' : JSON.stringify(result.error.issues, null, 2)}`).toBe(true);
}

/** Assert that response body is empty (used by some ShoppersStack 400s). */
export async function validateEmptyBody(res: APIResponse, opts?: AssertOpts): Promise<void> {
  const text = await res.text();
  ex(opts)(text, `${opts?.label ?? 'Body'} — expected empty`).toBe('');
}

/** Assert that a response completed within the expected time threshold. */
export function validateResponseTime( durationMs: number, expectedMaxMs: number, opts?: AssertOpts,): void {
  ex(opts)(
    durationMs, `${opts?.label ?? 'Response Time'} — expected < ${expectedMaxMs}ms, took ${durationMs}ms`,
  ).toBeLessThan(expectedMaxMs);
}
