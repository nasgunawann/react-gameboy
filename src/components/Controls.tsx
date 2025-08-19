import React from "react";

interface ControlsProps {
  onA?: () => void;
  onB?: () => void;
  onStart?: () => void;
  onSelect?: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onA, onB, onStart, onSelect }) => {
  const BASE = import.meta.env.BASE_URL; // otomatis mengikuti base path

  // Audio helper
  const playNavigate = () => new Audio(`${BASE}sfx/select.wav`).play();
  const playSelect = () => new Audio(`${BASE}sfx/navigate.wav`).play();

  // Trigger keyboard event + audio
  const triggerKey = (key: string, isNavigate = false) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    isNavigate ? playNavigate() : playSelect();
  };

  return (
    <div className="w-full mb-16 flex flex-col items-center gap-2">
      {/* Baris utama: D-Pad kiri, A/B kanan */}
      <div className="flex justify-between items-center w-full">
        {/* D-Pad */}
        <div className="relative w-40 h-auto">
          <img
            src={`${BASE}assets/dpad.png`}
            alt="D-Pad"
            className="w-full h-full pointer-events-none select-none"
            draggable={false}
          />
          <button
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl active:bg-red-300/50"
            onClick={() => triggerKey("ArrowUp", true)}
          />
          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl active:bg-blue-300/50"
            onClick={() => triggerKey("ArrowDown", true)}
          />
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl active:bg-green-300/50"
            onClick={() => triggerKey("ArrowLeft", true)}
          />
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl active:bg-purple-300/50"
            onClick={() => triggerKey("ArrowRight", true)}
          />
        </div>

        {/* Tombol A & B */}
        <div className="flex gap-6">
          <button
            className="w-14 h-14 rounded-full bg-red-500 text-white font-bold shadow-lg hover:bg-red-400 active:scale-95 active:ring-4 active:ring-red-300 transition-all"
            onClick={() => {
              triggerKey("x"); // tombol B
              onB?.();
            }}
          >
            B
          </button>
          <button
            className="w-14 h-14 rounded-full bg-red-500 text-white font-bold shadow-lg hover:bg-red-400 active:scale-95 active:ring-4 active:ring-red-300 transition-all"
            onClick={() => {
              triggerKey("z"); // tombol A
              onA?.();
            }}
          >
            A
          </button>
        </div>
      </div>

      {/* Tombol Start/Select */}
      <div className="flex justify-center gap-8 mt-3">
        <button
          className="px-3 py-1 text-xs bg-gray-600 text-white rounded-full active:bg-gray-500 transition-all"
          onClick={() => {
            triggerKey("Enter");
            onStart?.();
          }}
        >
          START
        </button>
        <button
          className="px-3 py-1 text-xs bg-gray-600 text-white rounded-full active:bg-gray-500 transition-all"
          onClick={() => {
            triggerKey("Shift");
            onSelect?.();
          }}
        >
          SELECT
        </button>
      </div>
    </div>
  );
};

export default Controls;
