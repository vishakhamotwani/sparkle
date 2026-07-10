import type { AssetDef } from "../core/types";

type ShapeButtonProps = {
  asset: AssetDef;
  tint: string;
  selected: boolean;
  onSelect: (assetId: string) => void;
};

export function ShapeButton({
  asset,
  tint,
  selected,
  onSelect,
}: ShapeButtonProps) {
  const BeadComponent = asset.component;
  return (
    <button
      type="button"
      className={`shape-button${selected ? " selected" : ""}`}
      aria-label={asset.id}
      aria-pressed={selected}
      onClick={() => onSelect(asset.id)}
    >
      <svg viewBox="-55 -55 110 110" aria-hidden="true">
        <BeadComponent tint={tint} />
      </svg>
    </button>
  );
}
