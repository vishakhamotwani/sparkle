import type { ComponentType } from "react";
import type { AssetProps } from "../core/types";

type ExtraButtonProps = {
  label: string;
  active: boolean;
  tint: string;
  component: ComponentType<AssetProps>;
  onToggle: () => void;
};

/** Toggles an on/off decoration (e.g. the bracelet tassel). */
export function ExtraButton({
  label,
  active,
  tint,
  component: Preview,
  onToggle,
}: ExtraButtonProps) {
  return (
    <button
      type="button"
      className={`shape-button${active ? " selected" : ""}`}
      aria-label={label}
      aria-pressed={active}
      onClick={onToggle}
    >
      <svg viewBox="-45 -18 90 160" aria-hidden="true">
        <Preview tint={tint} />
      </svg>
    </button>
  );
}
