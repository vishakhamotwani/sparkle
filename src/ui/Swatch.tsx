type SwatchProps = {
  color: string;
  selected: boolean;
  /** Hidden on narrow screens, where the palette shrinks to essentials. */
  secondary?: boolean;
  onSelect: (color: string) => void;
};

export function Swatch({ color, selected, secondary, onSelect }: SwatchProps) {
  return (
    <button
      type="button"
      className={`swatch${selected ? " selected" : ""}${secondary ? " compact-hide" : ""}`}
      style={{ background: color }}
      aria-label={`Color ${color}`}
      aria-pressed={selected}
      onClick={() => onSelect(color)}
    />
  );
}
