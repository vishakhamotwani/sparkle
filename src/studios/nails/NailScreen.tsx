import { useCallback, useEffect, useRef, useState } from "react";
import { exportStagePng } from "../../core/export";
import { RAINBOW_TINT, ombreTint } from "../../core/palette";
import {
  clearBackup,
  loadBackup,
  loadPlacements,
  saveDesign,
} from "../../core/storage";
import type { Placement } from "../../core/types";
import { useDesign } from "../../core/useDesign";
import { incrementStudioSaves } from "../../lib/supabase";
import { Celebration } from "../../ui/Celebration";
import { CustomColorSwatch } from "../../ui/CustomColorSwatch";
import { GlitterButton } from "../../ui/GlitterButton";
import { OmbreSwatch } from "../../ui/OmbreSwatch";
import { RainbowSwatch } from "../../ui/RainbowSwatch";
import { RestorePrompt } from "../../ui/RestorePrompt";
import { StudioShell } from "../../ui/StudioShell";
import { Swatch } from "../../ui/Swatch";
import { ToolbarButton } from "../../ui/ToolbarButton";
import { GemOverlay } from "./assets/GemOverlay";
import { ovalShape } from "./assets/OvalNail";
import { NailBase } from "./assets/NailBase";
import type { PatternId } from "./assets/types";
import { NailStage } from "./NailStage";
import {
  GEM_ANCHORS,
  GEM_SHAPES,
  GEM_SIZES,
  NAIL_PALETTE,
  NAIL_SHAPES,
  PATTERNS,
  gemAssetId,
  nailStudio,
} from "./config";

type NailScreenProps = {
  studioId: string;
  onBack: () => void;
};

const TABS = [
  { id: "shape", label: "Shape", emoji: "💅" },
  { id: "color", label: "Color", emoji: "🌈" },
  { id: "pattern", label: "Pattern", emoji: "〰️" },
  { id: "glitter", label: "Glitter", emoji: "✨" },
  { id: "gems", label: "Gems", emoji: "💎" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const HINTS: Partial<Record<TabId, string>> = {
  color: "Tap a nail to paint it",
  pattern: "Tap a nail to add the pattern",
  glitter: "Turn glitter on, then tap nails — or sparkle them all",
  gems: "Tap a nail to place the gem — tap a gem to take it off",
};

const GEM_COLORS = [
  "#FFD700",
  "#C0C0C0",
  "#FFFFFF",
  "#FF6FB5",
  "#FF5A5F",
  "#4D96FF",
  "#B983FF",
  "#6BCB77",
  "#333333",
];

export function NailScreen({ onBack }: NailScreenProps) {
  const studio = nailStudio;
  const base = studio.initialPlacements ?? [];
  const saved = loadPlacements(studio);
  const initial =
    saved.length > 0
      ? [
          ...base.filter((p) => !saved.some((s) => s.slotId === p.slotId)),
          ...saved,
        ]
      : base;
  const { design, canUndo, place, clearSlot, undo, reset, load } = useDesign(
    studio.id,
    initial,
    base,
  );
  const [backupOffer, setBackupOffer] = useState<Placement[] | null>(() => {
    if (saved.length > 0) return null;
    const backup = loadBackup(studio);
    return backup.length > 0 ? backup : null;
  });
  const [tab, setTab] = useState<TabId>("shape");
  const [color, setColor] = useState("#FF6FB5");
  const [pattern, setPattern] = useState<PatternId | null>(null);
  const [gemShape, setGemShape] = useState<(typeof GEM_SHAPES)[number]>("circle");
  const [gemSize, setGemSize] = useState<(typeof GEM_SIZES)[number]>("md");
  const [gemColor, setGemColor] = useState("#FFD700");
  const [activeNail, setActiveNail] = useState<number | null>(null);
  /** When true, the next nail tap adds glitter; when false, removes it. */
  const [glitterOn, setGlitterOn] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    saveDesign(design);
  }, [design]);

  const bySlot = new Map(design.placements.map((p) => [p.slotId, p]));
  const nailPlacement = (n: number) => bySlot.get(`nail-${n}`);
  const currentShapeId = nailPlacement(0)?.assetId ?? "nail-oval";

  // Shape applies to all five nails as one undoable step.
  const pickShape = (shapeId: string) => {
    load(
      design.placements.map((p) =>
        p.slotId.startsWith("nail-") ? { ...p, assetId: shapeId } : p,
      ),
    );
  };

  const paintNail = (n: number, tint: string) => {
    const nail = nailPlacement(n);
    if (nail) place({ ...nail, tint });
  };

  const applyColorToAll = () =>
    load(
      design.placements.map((p) =>
        p.slotId.startsWith("nail-") ? { ...p, tint: color } : p,
      ),
    );

  const patternNail = (n: number) => {
    if (pattern === null) {
      if (bySlot.get(`pattern-${n}`)) clearSlot(`pattern-${n}`);
      return;
    }
    place({ slotId: `pattern-${n}`, assetId: `pattern-${pattern}` });
  };

  const applyPatternToAll = () => {
    const others = design.placements.filter(
      (p) => !p.slotId.startsWith("pattern-"),
    );
    load(
      pattern === null
        ? others
        : [
            ...others,
            ...Array.from({ length: 5 }, (_, n) => ({
              slotId: `pattern-${n}`,
              assetId: `pattern-${pattern}`,
            })),
          ],
    );
  };

  const paintGlitter = (n: number) => {
    const nail = nailPlacement(n);
    if (nail) place({ ...nail, glitter: glitterOn ? true : undefined });
  };

  const allGlittered = [0, 1, 2, 3, 4].every((n) => nailPlacement(n)?.glitter);
  const applyGlitterToAll = () =>
    load(
      design.placements.map((p) =>
        p.slotId.startsWith("nail-")
          ? { ...p, glitter: allGlittered ? undefined : true }
          : p,
      ),
    );

  const gemNail = (n: number) => {
    for (let a = 0; a < GEM_ANCHORS; a++) {
      if (!bySlot.get(`gem-${n}-${a}`)) {
        place({
          slotId: `gem-${n}-${a}`,
          assetId: gemAssetId(gemShape, gemSize),
          tint: gemColor,
        });
        return;
      }
    }
  };

  const handleNailTap = (n: number) => {
    setActiveNail(n);
    if (tab === "color") paintNail(n, color);
    else if (tab === "pattern") patternNail(n);
    else if (tab === "glitter") paintGlitter(n);
    else if (tab === "gems") gemNail(n);
  };

  const handleGemTap = (n: number, anchor: number) => {
    clearSlot(`gem-${n}-${anchor}`);
  };

  const handleSave = () => {
    if (svgRef.current && !celebrating) setCelebrating(true);
  };

  const finishCelebration = useCallback(() => {
    if (svgRef.current) {
      void exportStagePng(svgRef.current, `sparkle-${studio.id}.png`);
      void incrementStudioSaves(studio.id);
    }
    setCelebrating(false);
  }, [studio.id]);

  const isPristine =
    JSON.stringify(design.placements) === JSON.stringify(base);

  const presetTints = new Set<string>([RAINBOW_TINT]);
  for (const item of NAIL_PALETTE) {
    if (typeof item === "string") presetTints.add(item);
    else if ("ombre" in item) presetTints.add(ombreTint(...item.ombre));
  }

  const applyAllButton = (label: string, onPress: () => void) => (
    <button type="button" className="tab-button" onClick={onPress}>
      {label}
    </button>
  );

  return (
    <>
      <StudioShell
        title={studio.name}
        onBack={onBack}
        toolbar={
          <>
            <ToolbarButton
              label="Undo"
              icon="↩️"
              disabled={!canUndo}
              onPress={undo}
            />
            <ToolbarButton
              label="Save"
              icon="📸"
              disabled={celebrating}
              onPress={handleSave}
            />
            <ToolbarButton
              label="Start over"
              icon="🌈"
              disabled={isPristine}
              onPress={reset}
            />
          </>
        }
        stage={
          <NailStage
            design={design}
            activeNail={activeNail}
            onNailTap={handleNailTap}
            onGemTap={tab === "gems" ? handleGemTap : () => {}}
            svgRef={svgRef}
          />
        }
        tray={
          <div className="tray">
            {HINTS[tab] && (
              <div className="sticker-hint" role="status">
                {HINTS[tab]}
              </div>
            )}
            <div className="tray-row cupcake-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tab-button${tab === t.id ? " selected" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <span aria-hidden="true">{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
            {tab === "shape" && (
              <div className="tray-row" role="group" aria-label="Nail shapes">
                {NAIL_SHAPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`flavor-button${currentShapeId === s.id ? " selected" : ""}`}
                    aria-pressed={currentShapeId === s.id}
                    onClick={() => pickShape(s.id)}
                  >
                    <svg viewBox="-46 -92 92 184" width={30} height={44} aria-hidden="true">
                      <path d={s.path} fill="#FF9EC9" stroke="rgba(0,0,0,0.2)" strokeWidth={4} />
                    </svg>
                    <span className="flavor-name">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
            {tab === "color" && (
              <div className="tray-row" role="group" aria-label="Nail colors">
                {applyAllButton("Apply to all", applyColorToAll)}
                {NAIL_PALETTE.map((item) => {
                  if (typeof item === "string") {
                    return (
                      <Swatch
                        key={item}
                        color={item}
                        selected={color === item}
                        onSelect={setColor}
                      />
                    );
                  }
                  if ("rainbow" in item) {
                    return (
                      <RainbowSwatch
                        key="rainbow"
                        selected={color === RAINBOW_TINT}
                        onSelect={setColor}
                      />
                    );
                  }
                  if ("ombre" in item) {
                    const [from, to] = item.ombre;
                    return (
                      <OmbreSwatch
                        key={`${from}-${to}`}
                        from={from}
                        to={to}
                        selected={color === ombreTint(from, to)}
                        onSelect={setColor}
                      />
                    );
                  }
                  return (
                    <CustomColorSwatch
                      key="custom"
                      currentTint={color}
                      selected={!presetTints.has(color)}
                      onSelect={setColor}
                    />
                  );
                })}
              </div>
            )}
            {tab === "pattern" && (
              <div className="tray-row" role="group" aria-label="Patterns">
                {applyAllButton("Apply to all", applyPatternToAll)}
                {PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`flavor-button${pattern === p.id ? " selected" : ""}`}
                    aria-pressed={pattern === p.id}
                    onClick={() => setPattern(p.id)}
                  >
                    <svg viewBox="-46 -92 92 184" width={30} height={44} aria-hidden="true">
                      <NailBase shape={ovalShape} tint="#FF9EC9" pattern={p.id} />
                    </svg>
                    <span className="flavor-name">{p.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`flavor-button${pattern === null ? " selected" : ""}`}
                  aria-pressed={pattern === null}
                  onClick={() => setPattern(null)}
                >
                  <span className="flavor-emoji" aria-hidden="true">
                    🚫
                  </span>
                  <span className="flavor-name">None</span>
                </button>
              </div>
            )}
            {tab === "glitter" && (
              <div className="tray-row" role="group" aria-label="Glitter">
                <GlitterButton
                  selected={glitterOn}
                  onToggle={() => setGlitterOn((on) => !on)}
                />
                {applyAllButton(
                  allGlittered ? "Un-sparkle all" : "Sparkle all ✨",
                  applyGlitterToAll,
                )}
              </div>
            )}
            {tab === "gems" && (
              <>
                <div className="tray-row" role="group" aria-label="Gem shapes and sizes">
                  {GEM_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      className={`flavor-button${gemShape === shape ? " selected" : ""}`}
                      aria-pressed={gemShape === shape}
                      onClick={() => setGemShape(shape)}
                    >
                      <svg viewBox="-20 -20 40 40" width={34} height={34} aria-hidden="true">
                        <GemOverlay
                          shape={ovalShape}
                          gems={[{ anchor: 1, shape, size: "md", tint: gemColor }]}
                        />
                      </svg>
                      <span className="flavor-name">{shape}</span>
                    </button>
                  ))}
                  {GEM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`tab-button${gemSize === size ? " selected" : ""}`}
                      aria-pressed={gemSize === size}
                      onClick={() => setGemSize(size)}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="tray-row" role="group" aria-label="Gem colors">
                  {GEM_COLORS.map((c) => (
                    <Swatch
                      key={c}
                      color={c}
                      selected={gemColor === c}
                      onSelect={setGemColor}
                    />
                  ))}
                  <CustomColorSwatch
                    currentTint={gemColor}
                    selected={!GEM_COLORS.includes(gemColor)}
                    onSelect={setGemColor}
                  />
                </div>
              </>
            )}
          </div>
        }
      />
      {celebrating && (
        <Celebration message="Gorgeous! 💅" onDone={finishCelebration} />
      )}
      {backupOffer && (
        <RestorePrompt
          creationName={studio.creationName ?? "creation"}
          onYes={() => {
            load(backupOffer);
            setBackupOffer(null);
          }}
          onNo={() => {
            clearBackup(studio.id);
            setBackupOffer(null);
          }}
        />
      )}
    </>
  );
}
