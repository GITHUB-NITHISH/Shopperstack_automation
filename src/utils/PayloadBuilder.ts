/**
 * Tiny template renderer for JSON payload files.
 * Replaces `{{key}}` tokens in any string leaf with values from `vars`.
 * Keeps payloads declarative in /data/testdata/api/payloads/*.json
 * while allowing dynamic values (faker, timestamps, tokens) at runtime.
 */
export function renderPayload<T = any>(template: unknown, vars: Record<string, string | number>): T {
  const json = JSON.stringify(template).replace(/{{\s*(\w+)\s*}}/g, (_m, k) => {
    if (!(k in vars)) throw new Error(`renderPayload: missing var "${k}"`);
    return String(vars[k]).replace(/"/g, '\\"');
  });
  return JSON.parse(json) as T;
}
