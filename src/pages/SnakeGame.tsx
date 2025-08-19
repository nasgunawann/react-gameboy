import React, { useState, useEffect } from "react";

type Direction = "up" | "down" | "left" | "right";

interface Cell {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onNavigate: (screen: "main" | "message" | "gallery" | "snake") => void;
}

const GRID_SIZE = 10;
const INITIAL_SNAKE: Cell[] = [{ x: 5, y: 5 }];

const SnakeGame: React.FC<SnakeGameProps> = ({ onNavigate }) => {
  const [snake, setSnake] = useState<Cell[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Cell>({ x: 2, y: 3 });
  const [direction, setDirection] = useState<Direction>("right");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"ready" | "playing" | "gameover">(
    "ready"
  );

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setDirection("right");
    setScore(0);
    setStatus("playing");
  };

  useEffect(() => {
    if (status !== "playing") return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        switch (direction) {
          case "up":
            head.y -= 1;
            break;
          case "down":
            head.y += 1;
            break;
          case "left":
            head.x -= 1;
            break;
          case "right":
            head.x += 1;
            break;
        }

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE
        ) {
          setStatus("gameover");
          return prev;
        }

        if (prev.some((cell) => cell.x === head.x && cell.y === head.y)) {
          setStatus("gameover");
          return prev;
        }

        let newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [direction, food, status]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Tombol Start / A
      if (status === "ready" && (key === "z" || key === "enter")) {
        resetGame();
        return;
      }
      if (status === "gameover" && (key === "z" || key === "enter")) {
        resetGame();
        return;
      }

      // Tombol B
      if ((status === "ready" || status === "gameover") && key === "x") {
        onNavigate("main"); // kembali ke menu utama
        return;
      }

      // Movement saat bermain
      if (status === "playing") {
        switch (key) {
          case "arrowup":
            setDirection("up");
            break;
          case "arrowdown":
            setDirection("down");
            break;
          case "arrowleft":
            setDirection("left");
            break;
          case "arrowright":
            setDirection("right");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, onNavigate]);

  return (
    <div className="relative flex flex-col items-center p-4">
      {/* Overlay status with black background */}
      {(status === "ready" || status === "gameover") && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-lg">
          <div
            className={`text-lg font-bold text-center px-2 whitespace-pre-line ${
              status === "ready"
                ? "text-yellow-400 text-sm"
                : "text-red-500 text-sm"
            }`}
          >
            {status === "ready"
              ? "TEKAN START \nUNTUK MULAI GAME"
              : "GAME OVER\nTEKAN START UNTUK MULAI ULANG"}
          </div>
        </div>
      )}

      <div className="grid grid-cols-10 gap-0.5 bg-gray-900 p-1">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((cell) => cell.x === x && cell.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={idx}
              className={`w-6 h-6 ${
                isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-800"
              } border border-gray-700`}
            />
          );
        })}
      </div>

      <div className="mt-2 text-white">Score: {score}</div>
    </div>
  );
};

export default SnakeGame;
