import { useState } from "react";
import { Home } from "./Home";
import { StudioScreen } from "./StudioScreen";
import { allStudios } from "./registry";

export default function App() {
  const [screen, setScreen] = useState<string>("home");

  if (screen === "home") {
    return <Home studios={allStudios()} onPick={setScreen} />;
  }
  return <StudioScreen studioId={screen} onBack={() => setScreen("home")} />;
}
