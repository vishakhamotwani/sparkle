import type { StudioDefinition } from "../core/types";
import { braceletStudio } from "../studios/bracelet/config";

const registry: Record<string, StudioDefinition> = {
  [braceletStudio.id]: braceletStudio,
};

export function getStudio(id: string): StudioDefinition {
  const studio = registry[id];
  if (!studio) throw new Error(`Unknown studio: ${id}`);
  return studio;
}

export function allStudios(): StudioDefinition[] {
  return Object.values(registry);
}
