type SwatchProps = {
  color: string;
  selected: boolean;
  onSelect: (color: string) => void;
};

export function Swatch({ color, selected, onSelect }: SwatchProps) {
  return (
    <button
      type="button"
      className={`swatch${selected ? " selected" : ""}`}
      style={{ background: color }}
      aria-label={`Color ${color}`}
      aria-pressed={selected}
      onClick={() => onSelect(color)}
    />
  );
}
