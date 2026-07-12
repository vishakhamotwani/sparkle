import { useCallback, useEffect, useRef, useState } from "react";
import { exportStagePng } from "../../core/export";
import {
  clearBackup,
  loadBackup,
  loadPlacements,
  saveDesign,
} from "../../core/storage";
import type { Placement } from "../../core/types";
import { useDesign } from "../../core/useDesign";
import { Celebration } from "../../ui/Celebration";
import { RestorePrompt } from "../../ui/RestorePrompt";
import { Stage } from "../../ui/Stage";
import { StudioShell } from "../../ui/StudioShell";
import { Swatch } from "../../ui/Swatch";
import { ToolbarButton } from "../../ui/ToolbarButton";
import { SPRINKLE_MIX } from "./assets/Sprinkles";
import { CUPCAKE_COLORS, FLAVORS, TOPPINGS, cupcakeStudio } from "./config";

type CupcakeScreenProps = {
  studioId: string;
  onBack: () => void;
};

const TABS = [
  { id: "flavor", label: "Flavor", emoji: "🍓" },
  { id: "wrapper", label: "Wrapper", emoji: "🧁" },
  { id: "sprinkles", label: "Sprinkles", emoji: "🍬" },
  { id: "topping", label: "Topping", emoji: "🍒" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CupcakeScreen({ onBack }: CupcakeScreenProps) {
  const studio = cupcakeStudio;
  const base = studio.initialPlacements ?? [];
  const saved = loadPlacements(studio);
  // Backfill required layers a partial/older save might be missing.
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
  const [tab, setTab] = useState<TabId>("flavor");
  const [celebrating, setCelebrating] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    saveDesign(design);
  }, [design]);

  const bySlot = new Map(design.placements.map((p) => [p.slotId, p]));

  // One tap recolors frosting and cake together — via load() so the
  // whole flavor change is a single undo step.
  const pickFlavor = (flavor: (typeof FLAVORS)[number]) => {
    const others = design.placements.filter(
      (p) => p.slotId !== "frosting" && p.slotId !== "cake",
    );
    load([
      ...others,
      { slotId: "cake", assetId: "cake", tint: flavor.cake },
      { slotId: "frosting", assetId: "frosting", tint: flavor.frosting },
    ]);
  };

  const activeFlavor = FLAVORS.find(
    (f) =>
      bySlot.get("frosting")?.tint === f.frosting &&
      bySlot.get("cake")?.tint === f.cake,
  );

  const pickWrapper = (tint: string) =>
    place({ slotId: "wrapper", assetId: "wrapper", tint });

  const sprinkles = bySlot.get("sprinkles");
  const toggleSprinkles = () =>
    sprinkles
      ? clearSlot("sprinkles")
      : place({ slotId: "sprinkles", assetId: "sprinkles", tint: SPRINKLE_MIX });
  // Picking a color turns sprinkles on — one tap, no separate toggle needed.
  const pickSprinkleColor = (tint: string) =>
    place({ slotId: "sprinkles", assetId: "sprinkles", tint });

  const topping = bySlot.get("topping");
  const pickTopping = (id: string | null) => {
    if (id === null) {
      if (topping) clearSlot("topping");
      return;
    }
    const def = TOPPINGS.find((t) => t.id === id)!;
    place({ slotId: "topping", assetId: def.id, tint: def.tint });
  };

  const handleSave = () => {
    if (svgRef.current && !celebrating) setCelebrating(true);
  };

  const finishCelebration = useCallback(() => {
    if (svgRef.current) {
      void exportStagePng(svgRef.current, `sparkle-${studio.id}.png`);
    }
    setCelebrating(false);
  }, [studio.id]);

  const isPristine =
    JSON.stringify(design.placements) === JSON.stringify(base);

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
          <Stage
            studio={studio}
            design={design}
            onSlotTap={() => {}}
            svgRef={svgRef}
          />
        }
        tray={
          <div className="tray">
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
            {tab === "flavor" && (
              <div className="tray-row" role="group" aria-label="Flavors">
                {FLAVORS.map((flavor) => (
                  <button
                    key={flavor.id}
                    type="button"
                    className={`flavor-button${activeFlavor?.id === flavor.id ? " selected" : ""}`}
                    aria-pressed={activeFlavor?.id === flavor.id}
                    onClick={() => pickFlavor(flavor)}
                  >
                    <span className="flavor-emoji" aria-hidden="true">
                      {flavor.emoji}
                    </span>
                    <span className="flavor-name">{flavor.name}</span>
                  </button>
                ))}
              </div>
            )}
            {tab === "wrapper" && (
              <div className="tray-row" role="group" aria-label="Wrapper colors">
                {CUPCAKE_COLORS.map((color) => (
                  <Swatch
                    key={color}
                    color={color}
                    selected={bySlot.get("wrapper")?.tint === color}
                    onSelect={pickWrapper}
                  />
                ))}
              </div>
            )}
            {tab === "sprinkles" && (
              <div className="tray-row" role="group" aria-label="Sprinkles">
                <button
                  type="button"
                  className={`flavor-button${sprinkles ? " selected" : ""}`}
                  aria-pressed={!!sprinkles}
                  onClick={toggleSprinkles}
                >
                  <span className="flavor-emoji" aria-hidden="true">
                    🍬
                  </span>
                  <span className="flavor-name">
                    {sprinkles ? "On!" : "Off"}
                  </span>
                </button>
                <button
                  type="button"
                  className={`swatch rainbow-swatch${sprinkles?.tint === SPRINKLE_MIX ? " selected" : ""}`}
                  aria-label="Mixed colors"
                  aria-pressed={sprinkles?.tint === SPRINKLE_MIX}
                  onClick={() => pickSprinkleColor(SPRINKLE_MIX)}
                />
                {CUPCAKE_COLORS.map((color) => (
                  <Swatch
                    key={color}
                    color={color}
                    selected={sprinkles?.tint === color}
                    onSelect={pickSprinkleColor}
                  />
                ))}
              </div>
            )}
            {tab === "topping" && (
              <div className="tray-row" role="group" aria-label="Toppings">
                {TOPPINGS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`flavor-button${topping?.assetId === t.id ? " selected" : ""}`}
                    aria-pressed={topping?.assetId === t.id}
                    onClick={() => pickTopping(t.id)}
                  >
                    <span className="flavor-emoji" aria-hidden="true">
                      {t.emoji}
                    </span>
                    <span className="flavor-name">{t.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`flavor-button${!topping ? " selected" : ""}`}
                  aria-pressed={!topping}
                  onClick={() => pickTopping(null)}
                >
                  <span className="flavor-emoji" aria-hidden="true">
                    🚫
                  </span>
                  <span className="flavor-name">None</span>
                </button>
              </div>
            )}
          </div>
        }
      />
      {celebrating && (
        <Celebration message="Delicious! 🧁" onDone={finishCelebration} />
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
