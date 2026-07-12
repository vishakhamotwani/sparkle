type GlitterButtonProps = {
  selected: boolean;
  onToggle: () => void;
};

/**
 * Sits at the end of the shapes row but reads as a mode toggle, not a
 * shape: ghost outline, ✨ icon, and a small label.
 */
export function GlitterButton({ selected, onToggle }: GlitterButtonProps) {
  return (
    <button
      type="button"
      className={`glitter-button${selected ? " selected" : ""}`}
      aria-pressed={selected}
      onClick={onToggle}
    >
      <span className="glitter-icon" aria-hidden="true">
        ✨
      </span>
      <span className="glitter-label">Glitter</span>
    </button>
  );
}
