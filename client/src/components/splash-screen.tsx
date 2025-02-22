import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PartyPopper, Music, Sparkles } from "lucide-react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for exit animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Main logo animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-64 h-64 flex items-center justify-center"
        >
          <img
            src="/crazyrid3r-logo.gif"
            alt="Party Games"
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </motion.div>

        {/* Floating party elements - moved closer to the logo */}
        <motion.div
          className="absolute -top-8 -left-8"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PartyPopper className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.div
          className="absolute -bottom-8 -right-8"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          <Music className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.div
          className="absolute -top-8 -right-8"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.p
        className="absolute bottom-10 text-lg font-semibold text-primary"
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [0.95, 1, 0.95]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading Party Games...
      </motion.p>
    </motion.div>
  );
}