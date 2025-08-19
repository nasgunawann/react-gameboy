import React, { useEffect, useRef, useState } from "react";

interface MusicScreenProps {
  onNavigate: (screen: "main" | "message" | "gallery" | "snake") => void;
}

interface Song {
  title: string;
  file: string;
}

//Tambahkan musik yang ingin dimainkan
// Pastikan file musik ada di folder public/sfx/
const songs: Song[] = [
  { title: "Happy Birthday!", file: "./audio/happybirthday.mp3" },
];

const MusicScreen: React.FC<MusicScreenProps> = ({ onNavigate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "arrowdown") {
        setSelectedIndex((prev) => (prev + 1) % songs.length);
      } else if (key === "arrowup") {
        setSelectedIndex((prev) => (prev - 1 + songs.length) % songs.length);
      } else if (key === "z") {
        // Tombol A → Play/Pause lagu
        if (currentIndex === selectedIndex) {
          setIsPlaying((prev) => !prev);
        } else {
          setCurrentIndex(selectedIndex);
          setIsPlaying(true);
        }
      } else if (key === "x") {
        // Tombol B → Kembali
        onNavigate("main");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, currentIndex, onNavigate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentIndex !== null) {
      audio.src = songs[currentIndex].file;
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex]);

  return (
    <div className="flex flex-col h-full text-xs text-[#9bbc0f] p-3">
      <div className="text-center font-bold text-[10px] mb-2 text-yellow-300">
        Pilih Lagu untuk Diputar
      </div>

      <ul className="flex-1 overflow-y-auto space-y-2">
        {songs.map((song, index) => (
          <li
            key={index}
            className={`p-2 rounded flex justify-between items-center ${
              index === selectedIndex
                ? "bg-green-500 text-black"
                : "bg-[#1a1a2e] text-white"
            }`}
          >
            <span>
              {index === selectedIndex ? "# " : "\u00A0\u00A0"}
              {song.title}
            </span>
            {currentIndex === index && (
              <span className="text-[10px]">{isPlaying ? "▶" : "❚❚"}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 text-center text-[10px] text-gray-300">
        <span className="text-yellow-500">↑↓</span>: Pilih |{" "}
        <span className="text-yellow-500">A</span>: Play/Pause | <br></br>
        <span className="text-yellow-500">B</span>: Kembali
      </div>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} hidden />
    </div>
  );
};

export default MusicScreen;
