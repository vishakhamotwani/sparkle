import type { CSSProperties } from "react";
import { useEffect, useMemo } from "react";

const CONFETTI_COLORS = [
  "#FF6FB5",
  "#FF5A5F",
  "#FFA33E",
  "#FFD93D",
  "#6BCB77",
  "#4DD4E8",
  "#4D96FF",
  "#B983FF",
];

// Fade-in + confetti + message, with the overlay fading back out at the
// end (see the celebration-fade keyframes) before the download fires.
const DURATION_MS = 2600;

type CelebrationProps = {
  /** Called once the party is over (~2.3s). */
  onDone: () => void;
};

/** Short full-screen confetti burst with a "So pretty!" message. */
export function Celebration({ onDone }: CelebrationProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        style: {
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          width: 7 + Math.random() * 7,
          height: 9 + Math.random() * 9,
          borderRadius: Math.random() < 0.3 ? "50%" : 2,
          "--dx": `${(Math.random() * 2 - 1) * 48}vw`,
          "--dy": `${-20 + Math.random() * 75}vh`,
          "--rot": `${(Math.random() * 2 - 1) * 720}deg`,
          animationDelay: `${Math.random() * 0.25}s`,
        } as CSSProperties,
      })),
    [],
  );

  useEffect(() => {
    const timer = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(timer);
    // Run once for this celebration; the component unmounts when done.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="celebration" role="status" aria-label="Saved!">
      {pieces.map((piece) => (
        <span key={piece.id} className="confetti-piece" style={piece.style} />
      ))}
      <div className="celebration-message">So pretty! ✨</div>
    </div>
  );
}
