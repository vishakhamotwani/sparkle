import type { ComponentType } from "react";
import type { AssetProps } from "../../../core/types";

/**
 * A cupcake layer is authored centered on (0,0) at its natural size;
 * the slot's translate positions it in the stack.
 */
export type CupcakeAsset = ComponentType<AssetProps>;
