import type { CupcakeAsset } from "./types";

/**
 * Emoji-based topping (same on-stage emoji style as bracelet stickers).
 * Fixed appearance — ignores tint.
 */
export function emojiTopper(emoji: string): CupcakeAsset {
  return function EmojiTopper() {
    return (
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={58}
        fontFamily="sans-serif"
      >
        {emoji}
      </text>
    );
  };
}
