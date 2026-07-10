import type { StudioDefinition } from "../core/types";

type HomeProps = {
  studios: StudioDefinition[];
  onPick: (studioId: string) => void;
};

const COMING_SOON = [
  { icon: "🧁", name: "Cupcake" },
  { icon: "🍦", name: "Ice Cream" },
];

export function Home({ studios, onPick }: HomeProps) {
  return (
    <div className="home">
      <h1 className="home-title">✨ Sparkle Studio ✨</h1>
      <p className="home-subtitle">What do you want to make today?</p>
      <div className="home-grid">
        {studios.map((studio) => (
          <button
            key={studio.id}
            type="button"
            className="studio-card"
            aria-label={`Open ${studio.name}`}
            onClick={() => onPick(studio.id)}
          >
            <span className="studio-card-icon" aria-hidden="true">
              {studio.icon}
            </span>
            <span className="studio-card-name">{studio.name}</span>
          </button>
        ))}
        {COMING_SOON.map(({ icon, name }) => (
          <div key={name} className="studio-card locked" aria-disabled="true">
            <span className="studio-card-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="studio-card-name">{name}</span>
            <span className="coming-soon-pill">Coming soon</span>
          </div>
        ))}
        <div className="studio-card locked" aria-disabled="true">
          <span className="studio-card-icon" aria-hidden="true">
            🎨
          </span>
          <span className="studio-card-name">More soon!</span>
        </div>
      </div>
    </div>
  );
}
