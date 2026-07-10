type CustomColorSwatchProps = {
  currentTint: string;
  selected: boolean;
  onSelect: (tint: string) => void;
};

/** Opens the browser's native color picker for any color beyond the palette. */
export function CustomColorSwatch({
  currentTint,
  selected,
  onSelect,
}: CustomColorSwatchProps) {
  // <input type="color"> only accepts #rrggbb; fall back when the current
  // tint is an ombre url() or shorthand.
  const inputValue = /^#[0-9a-f]{6}$/i.test(currentTint)
    ? currentTint
    : "#ff6fb5";

  return (
    <label
      className={`swatch custom-swatch${selected ? " selected" : ""}`}
      aria-label="Pick any color"
    >
      🎨
      <input
        type="color"
        value={inputValue}
        onChange={(e) => onSelect(e.target.value)}
      />
    </label>
  );
}
