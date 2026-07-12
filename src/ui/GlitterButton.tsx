type GlitterButtonProps = {
  selected: boolean;
  onToggle: () => void;
};

/** Toggles glitter mode: taps then add/remove shimmer on beads. */
export function GlitterButton({ selected, onToggle }: GlitterButtonProps) {
  return (
    <button
      type="button"
      className={`glitter-button${selected ? " selected" : ""}`}
      aria-pressed={selected}
      onClick={onToggle}
    >
      Glitter ✨
    </button>
  );
}
