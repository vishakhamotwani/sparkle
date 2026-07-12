import { RAINBOW_TINT } from "../core/palette";

type RainbowSwatchProps = {
  selected: boolean;
  onSelect: (tint: string) => void;
};

/** Selects the rainbow fill — all colors at once on one bead. */
export function RainbowSwatch({ selected, onSelect }: RainbowSwatchProps) {
  return (
    <button
      type="button"
      className={`swatch rainbow-swatch${selected ? " selected" : ""}`}
      aria-label="Rainbow"
      aria-pressed={selected}
      onClick={() => onSelect(RAINBOW_TINT)}
    />
  );
}
