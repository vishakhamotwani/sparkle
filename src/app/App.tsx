import type { ComponentType } from "react";
import { useState } from "react";
import { CupcakeScreen } from "../studios/cupcake/CupcakeScreen";
import { Home } from "./Home";
import { StudioScreen } from "./StudioScreen";
import { allStudios } from "./registry";

type ScreenProps = { studioId: string; onBack: () => void };

/**
 * Studios with their own interaction paradigm bring their own screen;
 * tool-and-tap studios share the generic StudioScreen.
 */
const SCREENS: Record<string, ComponentType<ScreenProps>> = {
  cupcake: CupcakeScreen,
};

export default function App() {
  const [screen, setScreen] = useState<string>("home");

  if (screen === "home") {
    return <Home studios={allStudios()} onPick={setScreen} />;
  }
  const Screen = SCREENS[screen] ?? StudioScreen;
  return <Screen studioId={screen} onBack={() => setScreen("home")} />;
}
