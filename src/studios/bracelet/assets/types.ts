import type { ComponentType } from "react";
import type { AssetProps } from "../../../core/types";

/**
 * A bead is authored centered on (0,0) inside a ~100-unit box
 * (max radius ~48). The Stage positions and scales it into its slot.
 */
export type BeadAsset = ComponentType<AssetProps>;
