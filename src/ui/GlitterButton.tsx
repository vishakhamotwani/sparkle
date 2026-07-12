type GlitterButtonProps = {
  selected: boolean;
  onToggle: () => void;
};

/**
 * Sits at the end of the shapes row, styled like a shape option, but
 * toggles glitter mode instead of picking a shape.
 */
export function GlitterButton({ selected, onToggle }: GlitterButtonProps) {
  return (
    <button
      type="button"
      className={`shape-button glitter-button${selected ? " selected" : ""}`}
      aria-label="Glitter"
      aria-pressed={selected}
      onClick={onToggle}
    >
      ✨
    </button>
  );
}
