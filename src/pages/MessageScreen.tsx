import React, { useEffect, useRef, useState } from "react";

interface MessageScreenProps {
  onNavigate: (screen: "main" | "gallery" | "music" | "snake") => void;
}

const fullMessage = `Halo, selamat datang di Gameboy Mini!
Ini adalah pesan yang ditampilkan di layar Gameboy Mini.
Terima kasih telah mencoba aplikasi ini.

Jika kamu suka, silakan bagikan kepada teman-temanmu.
Jika ada pertanyaan atau saran, jangan ragu untuk menghubungi saya.

Dibuat dengan ❤️.

- Oleh Nasgunawann.`;

// 🔊 Typing Sound Logic (Global)
let cachedTypingBuffer: AudioBuffer | null = null;
const audioCtx = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

const preloadTypingSound = async () => {
  if (!cachedTypingBuffer) {
    const res = await fetch("./sfx/type.wav");
    const arrayBuffer = await res.arrayBuffer();
    cachedTypingBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  }
};

const playTypingSound = () => {
  if (!cachedTypingBuffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = cachedTypingBuffer;
  source.connect(audioCtx.destination);
  source.playbackRate.value = Math.random() * 0.4 + 0.9; // pitch random
  source.start(0);
};

const MessageScreen: React.FC<MessageScreenProps> = ({ onNavigate }) => {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    preloadTypingSound(); // 🔁 preload 1x
    startTypewriter();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "x") {
        onNavigate("main");
      } else if (key === "z") {
        if (isTyping) {
          skipTyping();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTyping, onNavigate]);

  const startTypewriter = () => {
    let i = 0;
    setTypedText("");
    setIsTyping(true);

    intervalRef.current = setInterval(() => {
      if (i < fullMessage.length) {
        const char = fullMessage[i];
        setTypedText((prev) => prev + (char === "\n" ? "<br>" : char));

        // Play typing sound (skip spasi biar hemat suara)
        if (char !== " ") playTypingSound();

        i++;
      } else {
        clearInterval(intervalRef.current!);
        setIsTyping(false);
      }
    }, 50); // Typing speed
  };

  const skipTyping = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const htmlMessage = fullMessage.replace(/\n/g, "<br>");
    setTypedText(htmlMessage);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full justify-between text-[#9bbc0f] text-xs p-4">
      {/* Message content */}
      <div
        className="overflow-y-auto whitespace-pre-line mb-2 leading-relaxed scroll-smooth"
        dangerouslySetInnerHTML={{ __html: typedText }}
      />

      {/* Controls guide */}
      <div className="mt-4 text-center text-[10px] text-gray-300">
        {isTyping ? (
          <p>
            <span className="text-yellow-500">A</span>: Skip |{" "}
            <span className="text-yellow-500">B</span>: Kembali
          </p>
        ) : (
          <p>
            <span className="text-yellow-500">A</span>: Lanjut |{" "}
            <span className="text-yellow-500">B</span>: Kembali
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageScreen;
