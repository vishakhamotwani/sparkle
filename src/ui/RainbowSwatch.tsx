type RainbowSwatchProps = {
  colors: string[];
  currentTint: string;
  onSelect: (color: string) => void;
};

/** Cycles the selected color through its list on every tap. */
export function RainbowSwatch({
  colors,
  currentTint,
  onSelect,
}: RainbowSwatchProps) {
  const handleTap = () => {
    const next = colors[(colors.indexOf(currentTint) + 1) % colors.length];
    onSelect(next);
  };

  return (
    <button
      type="button"
      className="swatch rainbow-swatch"
      aria-label="Rainbow — next color"
      onClick={handleTap}
    />
  );
}
