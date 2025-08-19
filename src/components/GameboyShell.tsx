import React, { useEffect, useState } from "react";
import Controls from "./Controls";

type ScreenName = "main" | "message" | "gallery" | "music" | "snake";

interface GameboyShellProps {
  children: React.ReactNode;
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const Speaker: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 4,
  cols = 3,
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className={`flex gap-1 ml-${row}`}>
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="w-2 h-2 bg-gray-700 rounded-full" />
          ))}
        </div>
      ))}
    </div>
  );
};

const FlashOverlay: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none animate-pulse rounded-md"
      style={{
        backgroundColor: "#2d5016",
        boxShadow: "inset 0 0 20px #1a2e10, inset 0 0 8px #1a2e10",
      }}
    />
  );
};

const GameboyShell: React.FC<GameboyShellProps> = ({
  children,
  currentScreen,
}) => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const timeout = setTimeout(() => setFlash(false), 50); // flash durasi singkat
    return () => clearTimeout(timeout);
  }, [currentScreen]);

  return (
    <div className="w-[400px] h-[700px] bg-gradient-to-br from-gray-100 to-gray-300 rounded-[20px] shadow-2xl p-4 flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex justify-between text-[10px] text-gray-600 font-semibold mb-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span>POWER</span>
        </div>
      </div>

      {/* Screen */}
      <div
        className="w-full h-[350px] border-[6px] border-black rounded-md p-2 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundColor: "#2d5016",
          boxShadow: "inset 0 0 20px #1a2e10, inset 0 0 8px #1a2e10",
        }}
      >
        <FlashOverlay active={flash} />
        <div className="w-full h-full overflow-hidden">{children}</div>
      </div>

      {/* Controls */}
      <Controls
        onA={() =>
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }))
        }
        onB={() =>
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }))
        }
        onStart={() =>
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
        }
        onSelect={() =>
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }))
        }
      />

      {/* Speaker */}
      <Speaker />
    </div>
  );
};

export default GameboyShell;
