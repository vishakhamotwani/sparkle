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

/**
 * The rainbow bead fill — a conic-style SVG pattern of pie wedges the Stage
 * defines whenever the palette has a rainbow item (SVG has no native conic
 * gradient). Works on any bead shape and survives PNG export.
 */
export const RAINBOW_TINT = "url(#rainbow-conic)";
