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

  const openingTag = attributes
    ? `${tag} ${Object.entries(attributes)
        .map(([attribute, value]) => `${attribute}=${JSON.stringify(value)}`)
        .join(" ")}`
    : tag;
  const contentStr = Array.isArray(content) ? content.join("") : content || "";

  return `<${openingTag.trim()}>${contentStr}</${tag}>`;
}
