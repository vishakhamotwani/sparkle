import { useId } from "react";
import { GemOverlay } from "./GemOverlay";
import { PatternOverlay } from "./Patterns";
import type { NailProps, NailShape } from "./types";

// Sparkle positions as fractions of the nail's half-height.
const SPARKS: [number, number, number][] = [
  [-14, -0.55, 1.0],
  [12, -0.3, 1.3],
  [-8, 0.02, 0.8],
  [16, 0.3, 1.1],
  [-16, 0.5, 0.9],
  [4, 0.72, 0.7],
];

const SPARK_PATH =
  "M 0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z";

/**
 * Shared nail renderer: base color, then pattern and glitter clipped to
 * the silhouette, then gems on top; a soft glow ring when selected.
 */
export function NailBase({
  shape,
  tint,
  pattern,
  glitter,
  gems = [],
  selected,
  onGemTap,
}: NailProps & { shape: NailShape }) {
  const clipId = useId();
  const h = shape.height / 2;
  return (
    <g>
      <clipPath id={clipId}>
        <path d={shape.path} />
      </clipPath>
      {selected && (
        <path
          d={shape.path}
          fill="none"
          stroke="#FF6FB5"
          strokeWidth={10}
          opacity={0.45}
          data-export-hide
        />
      )}
      <path
        d={shape.path}
        fill={tint}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={3}
      />
      {pattern && (
        <g clipPath={`url(#${clipId})`}>
          <PatternOverlay type={pattern} height={shape.height} />
        </g>
      )}
      {glitter && (
        <g clipPath={`url(#${clipId})`}>
          {SPARKS.map(([x, fy, s], i) => (
            <path
              key={i}
              className="glitter-spark"
              d={SPARK_PATH}
              transform={`translate(${x} ${fy * h}) scale(${s})`}
              fill="#ffffff"
              opacity={0.9}
            />
          ))}
        </g>
      )}
      {/* Shine highlight */}
      <ellipse
        cx={-16}
        cy={-h * 0.35}
        rx={7}
        ry={h * 0.2}
        fill="white"
        opacity={0.35}
        transform={`rotate(-12 -16 ${-h * 0.35})`}
      />
      <GemOverlay shape={shape} gems={gems} onGemTap={onGemTap} />
    </g>
  );
}
