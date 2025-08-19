import { useState } from "react";
import GameboyShell from "./components/GameboyShell";
import MainScreen from "./pages/MainScreen";
import MessageScreen from "./pages/MessageScreen";
import GalleryScreen from "./pages/GalleryScreen";
import MusicScreen from "./pages/MusicScreen";
import SnakeGame from "./pages/SnakeGame";
import "./index.css";

// Define the Screen type
export type Screen = "main" | "message" | "gallery" | "music" | "snake";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [hasStarted, setHasStarted] = useState(false);

  // Navigation handler
  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "main":
        return (
          <MainScreen
            onNavigate={handleNavigate}
            hasStarted={hasStarted}
            onStart={() => setHasStarted(true)}
          />
        );
      case "message":
        return <MessageScreen onNavigate={handleNavigate} />;
      case "gallery":
        return <GalleryScreen onNavigate={handleNavigate} />;
      case "music":
        return <MusicScreen onNavigate={handleNavigate} />;
      case "snake":
        return <SnakeGame onNavigate={handleNavigate} />;
      default:
        const _exhaustiveCheck: never = currentScreen;
        return _exhaustiveCheck;
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black overflow-hidden">
      <GameboyShell currentScreen={currentScreen} onNavigate={handleNavigate}>
        {renderScreen()}
      </GameboyShell>
    </div>
  );
}

export default App;
