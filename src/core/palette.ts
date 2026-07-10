/**
 * Ombre tints are stored in placements as SVG paint server references
 * ("url(#ombre-…)"); the Stage renders a matching <linearGradient> def for
 * every ombre in the studio's palette.
 */
export function ombreId(from: string, to: string): string {
  return `ombre-${from.slice(1)}-${to.slice(1)}`;
}

export function ombreTint(from: string, to: string): string {
  return `url(#${ombreId(from, to)})`;
}
