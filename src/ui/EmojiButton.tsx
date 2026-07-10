type EmojiButtonProps = {
  emoji: string;
  selected: boolean;
  onSelect: (emoji: string) => void;
};

export function EmojiButton({ emoji, selected, onSelect }: EmojiButtonProps) {
  return (
    <button
      type="button"
      className={`emoji-button${selected ? " selected" : ""}`}
      aria-label={`Sticker ${emoji}`}
      aria-pressed={selected}
      onClick={() => onSelect(emoji)}
    >
      {emoji}
    </button>
  );
}
