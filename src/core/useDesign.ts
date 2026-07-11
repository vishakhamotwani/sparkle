import { useReducer } from "react";
import type { Design, Placement } from "./types";

type State = {
  design: Design;
  /** Snapshots of previous placements — designs are tiny, so full copies are cheap. */
  past: Placement[][];
};

type Action =
  | { type: "PLACE"; placement: Placement }
  | { type: "CLEAR_SLOT"; slotId: string }
  | { type: "UNDO" }
  | { type: "RESET"; placements: Placement[] }
  | { type: "LOAD"; placements: Placement[] };

function withHistory(state: State, placements: Placement[]): State {
  return {
    design: { ...state.design, placements },
    past: [...state.past, state.design.placements],
  };
}

function reducer(state: State, action: Action): State {
  const { placements } = state.design;
  switch (action.type) {
    case "PLACE": {
      const { placement } = action;
      const existing = placements.find((p) => p.slotId === placement.slotId);
      if (
        existing &&
        existing.assetId === placement.assetId &&
        existing.tint === placement.tint &&
        existing.emoji === placement.emoji &&
        existing.glitter === placement.glitter
      ) {
        return state;
      }
      return withHistory(state, [
        ...placements.filter((p) => p.slotId !== placement.slotId),
        placement,
      ]);
    }
    case "CLEAR_SLOT": {
      if (!placements.some((p) => p.slotId === action.slotId)) return state;
      return withHistory(
        state,
        placements.filter((p) => p.slotId !== action.slotId),
      );
    }
    case "UNDO": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        design: { ...state.design, placements: previous },
        past: state.past.slice(0, -1),
      };
    }
    case "RESET": {
      // Undoable, so no scary confirmation dialog is needed.
      if (JSON.stringify(placements) === JSON.stringify(action.placements)) {
        return state;
      }
      return withHistory(state, action.placements);
    }
    case "LOAD": {
      // Replace the whole design (e.g. restoring a backup) — undoable.
      return withHistory(state, action.placements);
    }
  }
}

export function useDesign(
  studioId: string,
  initialPlacements: Placement[] = [],
  basePlacements: Placement[] = [],
) {
  const [state, dispatch] = useReducer(reducer, {
    design: { studioId, placements: initialPlacements },
    past: [],
  });

  return {
    design: state.design,
    canUndo: state.past.length > 0,
    place: (placement: Placement) => dispatch({ type: "PLACE", placement }),
    clearSlot: (slotId: string) => dispatch({ type: "CLEAR_SLOT", slotId }),
    undo: () => dispatch({ type: "UNDO" }),
    reset: () => dispatch({ type: "RESET", placements: basePlacements }),
    load: (placements: Placement[]) => dispatch({ type: "LOAD", placements }),
  };
}
