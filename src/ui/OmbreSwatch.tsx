import { ombreTint } from "../core/palette";

type OmbreSwatchProps = {
  from: string;
  to: string;
  selected: boolean;
  onSelect: (tint: string) => void;
};

export function OmbreSwatch({ from, to, selected, onSelect }: OmbreSwatchProps) {
  return (
    <button
      type="button"
      className={`swatch${selected ? " selected" : ""}`}
      style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
      aria-label={`Ombre ${from} to ${to}`}
      aria-pressed={selected}
      onClick={() => onSelect(ombreTint(from, to))}
    />
  );
}
