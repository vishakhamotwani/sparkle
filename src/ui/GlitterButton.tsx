type GlitterButtonProps = {
  selected: boolean;
  onToggle: () => void;
};

/** Toggles glitter mode: taps then add/remove shimmer on beads. */
export function GlitterButton({ selected, onToggle }: GlitterButtonProps) {
  return (
    <button
      type="button"
      className={`emoji-button glitter-button${selected ? " selected" : ""}`}
      aria-label="Glitter"
      aria-pressed={selected}
      onClick={onToggle}
    >
      ✨
    </button>
  );
}
