import type { Design, Placement, StudioDefinition } from "./types";

const storageKey = (studioId: string) => `sparkle:design:${studioId}`;

export function saveDesign(design: Design): void {
  try {
    localStorage.setItem(
      storageKey(design.studioId),
      JSON.stringify(design.placements),
    );
  } catch {
    // Storage full or unavailable (private mode) — the app still works.
  }
}

/**
 * Load saved placements, dropping any that no longer match the studio's
 * current slots/assets so old saves survive config changes.
 */
export function loadPlacements(studio: StudioDefinition): Placement[] {
  try {
    const raw = localStorage.getItem(storageKey(studio.id));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const slotIds = new Set(studio.slots.map((s) => s.id));
    return parsed
      .filter(
        (p): p is Placement =>
          typeof p === "object" &&
          p !== null &&
          typeof (p as Placement).slotId === "string" &&
          slotIds.has((p as Placement).slotId) &&
          typeof (p as Placement).assetId === "string" &&
          (p as Placement).assetId in studio.assets,
      )
      .map((p) =>
        // Drop stickers that predate the stickerable rule.
        p.emoji && !studio.assets[p.assetId].stickerable
          ? { ...p, emoji: undefined }
          : p,
      );
  } catch {
    return [];
  }
}
