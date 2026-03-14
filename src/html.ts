/**
 * Escape HTML string.
 *
 * @group html
 */
export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generate an HTMLElement string representation.
 *
 * @group html
 */
export function genElement(tag: string): string;
export function genElement(
  tag: string,
  attributes: Record<string, unknown>,
): string;
export function genElement(tag: string, content: string | string[]): string;
export function genElement(
  tag: string,
  attributes: Record<string, unknown>,
  content: string | string[],
): string;
export function genElement(tag: string = "div", ...args: any[]) {
  const contentIndex = args.findIndex(
    (arg) => typeof arg === "string" || Array.isArray(arg),
  );
  const content: false | string | string[] =
    contentIndex !== -1 && args[contentIndex];
  const attributes: false | Record<string, unknown> =
    contentIndex !== 0 && args[0];

  const escapedTag = escapeHtml(tag);
  const openingTag = attributes
    ? `${escapedTag} ${stringifyAttributes(attributes)}`
    : escapedTag;

  if (VOID_ELEMENTS.has(tag.toLowerCase())) {
    return `<${openingTag.trim()} />`;
  }

  return [
    `<${openingTag.trim()}>`,
    Array.isArray(content) ? content.join("") : content || "",
    `</${escapedTag}>`,
  ].join("");
}

// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function stringifyAttributes(attributes: Record<string, unknown>) {
  return Object.entries(attributes)
    .filter(([_, value]) => value !== false)
    .map(([attribute, value]) => !value || value === true ? attribute : `${attribute}=${JSON.stringify(value)}`)
    .join(" ");
}
