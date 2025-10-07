import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-primary flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text">
          SunuMarket
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
          <div className="h-2 w-2 bg-secondary rounded-full animate-pulse delay-150" />
          <div className="h-2 w-2 bg-secondary rounded-full animate-pulse delay-300" />
        </div>
        <p className="text-primary-foreground text-xl font-light">
          Valoriser · Certifier · Connecter
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
