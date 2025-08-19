import React, { useEffect, useState } from "react";

interface MainScreenProps {
  onNavigate: (
    screen: "main" | "message" | "gallery" | "music" | "snake"
  ) => void;
  hasStarted: boolean;
  onStart: () => void;
}

const menuItems = [
  { label: "Buka Pesan", screen: "message" },
  { label: "Buka Galeri", screen: "gallery" },
  { label: "Putar Musik", screen: "music" },
  { label: "Main Game", screen: "snake" },
] as const;

const MainScreen: React.FC<MainScreenProps> = ({
  onNavigate,
  hasStarted,
  onStart,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (!hasStarted && (key === "z" || key === "enter")) {
        onStart();
        return;
      }

      if (!hasStarted) return;

      switch (key) {
        case "arrowdown":
          setSelectedIndex((prev) => (prev + 1) % menuItems.length);
          break;
        case "arrowup":
          setSelectedIndex(
            (prev) => (prev - 1 + menuItems.length) % menuItems.length
          );
          break;
        case "z": // A / OK
          onNavigate(menuItems[selectedIndex].screen);
          break;
        case "x": // B / Kembali
          onNavigate("main");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onNavigate, hasStarted, onStart]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-[#9bbc0f] py-2 font-press-start text-[10px] leading-snug tracking-widest">
      {!hasStarted ? (
        <div className="text-center">
          <h1 className="text-yellow-300 text-xl mb-10">Selamat Datang!</h1>
          <p className="text-white mt-2 text-sm">Tekan tombol</p>
          <p className="text-yellow-400 text-sm font-bold mt-1">START</p>
          <p className="text-white text-sm">untuk mulai</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full justify-between h-full">
          <div className="text-lg text-amber-300 mt-5">MENU UTAMA</div>
          <div />
          <div className="flex flex-col gap-1 w-4/5 text-left text-sm">
            {menuItems.map((item, index) => (
              <div
                key={item.label}
                className={`px-3 py-2 rounded ${
                  index === selectedIndex
                    ? "bg-green-500 text-black"
                    : "text-[#9bbc0f]"
                }`}
              >
                {index === selectedIndex ? "#" : "\u00A0\u00A0"} {item.label}
              </div>
            ))}
          </div>
          <p className="text-gray-300 text-[10px] text-center mb-2 mt-4">
            <span className="text-yellow-500">↑↓</span>: Pilih |{" "}
            <span className="text-yellow-500">A</span>: OK |{" "}
            <span className="text-yellow-500">B</span>: Kembali
          </p>
        </div>
      )}
    </div>
  );
};

export default MainScreen;
