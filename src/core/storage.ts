import type { Design, Placement, StudioDefinition } from "./types";

const storageKey = (studioId: string) => `sparkle:design:${studioId}`;
const backupKey = (studioId: string) => `sparkle:design:${studioId}:backup`;

export function saveDesign(design: Design): void {
  try {
    const json = JSON.stringify(design.placements);
    localStorage.setItem(storageKey(design.studioId), json);
    // Mirror every non-empty design so "Start over" (or anything that
    // empties the save) is recoverable on the next visit.
    if (design.placements.length > 0) {
      localStorage.setItem(backupKey(design.studioId), json);
    }
  } catch {
    // Storage full or unavailable (private mode) — the app still works.
  }
}

/** Load saved placements for the studio. */
export function loadPlacements(studio: StudioDefinition): Placement[] {
  return readPlacements(storageKey(studio.id), studio);
}

/** Load the last non-empty design, if one was ever saved. */
export function loadBackup(studio: StudioDefinition): Placement[] {
  return readPlacements(backupKey(studio.id), studio);
}

/** Forget the backup (the user declined to continue it). */
export function clearBackup(studioId: string): void {
  try {
    localStorage.removeItem(backupKey(studioId));
  } catch {
    // Nothing to do.
  }
}

/**
 * Parse a stored placement list, dropping anything that no longer matches
 * the studio's current slots/assets so old saves survive config changes.
 */
function readPlacements(key: string, studio: StudioDefinition): Placement[] {
  try {
    const raw = localStorage.getItem(key);
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
