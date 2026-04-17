"use client";

import { useState } from "react";
import StartScreen from "../components/StartScreen";
import GameBoard from "../components/GameBoard";
import EndScreen from "../components/EndScreen";

export default function Home() {
  const [screen, setScreen] = useState<"start" | "game" | "end">("start");

  return (
    <main className="container">
      {screen === "start" && <StartScreen onStart={() => setScreen("game")} />}
      {screen === "game" && <GameBoard onFinish={() => setScreen("end")} />}
      {screen === "end" && <EndScreen onRestart={() => setScreen("start")} />}
    </main>
  );
}