import React, { useEffect, useRef, useState } from "react";

interface GalleryScreenProps {
  onNavigate: (screen: "main" | "message" | "music" | "snake") => void;
}

interface Photo {
  image: string;
}

// Base path otomatis mengikuti vite.config.js
const BASE = import.meta.env.BASE_URL;

// Array photos dinamis
// Pastikan gambar ada di folder public/images/
// Gambar harus bernama photo1.jpg, photo2.jpg, dst.
const photos: Photo[] = Array.from({ length: 16 }, (_, i) => ({
  image: `${BASE}images/photo${i + 1}.jpg`,
}));

const GalleryScreen: React.FC<GalleryScreenProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [printing, setPrinting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll saat photo muncul
  useEffect(() => {
    if (containerRef.current && currentIndex >= 0) {
      const el = containerRef.current.children[currentIndex] as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentIndex]);

  // Print photo secara otomatis
  useEffect(() => {
    if (printing && currentIndex < photos.length - 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < photos.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [printing, currentIndex]);

  // Tombol A/B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "z") {
        printing ? handleReset() : handleStart();
      } else if (key === "x") {
        onNavigate("main");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [printing]);

  const handleStart = () => {
    setPrinting(true);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setPrinting(false);
    setCurrentIndex(-1);
  };

  return (
    <div className="flex flex-col h-full text-xs text-gray-800">
      <div className="bg-yellow-200 text-center font-bold py-1 mb-2 text-[10px] rounded shadow">
        PHOTOBOX
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-[#1a1a2e] rounded p-2 overflow-y-auto space-y-3"
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`h-[140px] w-full rounded border-4 border-gray-800 overflow-hidden shadow transition-all duration-500 ${
              index <= currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            {index <= currentIndex ? (
              <div className="relative w-full h-full">
                <img
                  src={photo.image}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#9bbc0f]">
                READY
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-gray-300">
        <p>
          <span className="text-yellow-500">A</span>: Cetak / Cetak Ulang |{" "}
          <br />
          <span className="text-yellow-500">B</span>: Kembali
        </p>
      </div>
    </div>
  );
};

export default GalleryScreen;
