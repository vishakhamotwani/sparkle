import type { PatternId } from "./types";

/**
 * Pattern overlays drawn to cover a generous nail bounding box
 * (±44 wide, height from the shape); the caller clips to the nail.
 * Fixed white-on-translucent styling so they read on any base color.
 */
export function PatternOverlay({
  type,
  height,
}: {
  type: PatternId;
  height: number;
}) {
  const h = height / 2;
  switch (type) {
    case "stripes":
      return (
        <g stroke="rgba(255,255,255,0.75)" strokeWidth={7} fill="none">
          {[-2, -1, 0, 1, 2].map((i) => (
            <line
              key={i}
              x1={-60 + i * 30}
              y1={h + 20}
              x2={20 + i * 30}
              y2={-h - 20}
            />
          ))}
        </g>
      );
    case "dots":
      return (
        <g fill="rgba(255,255,255,0.8)">
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 3 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={-22 + col * 22 + (row % 2 ? 11 : 0)}
                cy={-h + 18 + row * (height / 5.2)}
                r={5.5}
              />
            )),
          )}
        </g>
      );
    case "marble":
      return (
        <g fill="none" strokeLinecap="round">
          <path
            d={`M -40 ${-h * 0.5} Q -5 ${-h * 0.3} 8 ${-h * 0.62} T 44 ${-h * 0.5}`}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={6}
          />
          <path
            d={`M -44 ${h * 0.15} Q -12 ${h * 0.38} 10 ${h * 0.1} T 44 ${h * 0.28}`}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={9}
          />
          <path
            d={`M -40 ${h * 0.62} Q 0 ${h * 0.48} 40 ${h * 0.68}`}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={5}
          />
        </g>
      );
    case "checker":
      return (
        <g fill="rgba(255,255,255,0.72)">
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) =>
              (row + col) % 2 === 0 ? (
                <rect
                  key={`${row}-${col}`}
                  x={-44 + col * 22}
                  y={-h + row * (height / 6)}
                  width={22}
                  height={height / 6}
                />
              ) : null,
            ),
          )}
        </g>
      );
    case "french":
      return (
        <path
          d={`M -46 ${-h + height * 0.24} Q 0 ${-h + height * 0.34} 46 ${-h + height * 0.24} L 46 ${-h - 8} L -46 ${-h - 8} Z`}
          fill="rgba(255,255,255,0.95)"
        />
      );
  }
}
