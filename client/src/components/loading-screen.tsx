import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const characters = [
  {
    id: "happy",
    svg: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M40 70C40 70 50 80 60 80C70 80 80 70 80 70"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.circle
          cx="40"
          cy="50"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
        <motion.circle
          cx="80"
          cy="50"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      </svg>
    )
  },
  {
    id: "thinking",
    svg: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M40 70C40 70 50 70 60 70C70 70 80 70 80 70"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.circle
          cx="40"
          cy="50"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1, y: [0, -5, 0] }}
          transition={{ 
            scale: { duration: 0.3, delay: 0.4 },
            y: { duration: 1, repeat: Infinity }
          }}
        />
        <motion.circle
          cx="80"
          cy="50"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1, y: [0, -5, 0] }}
          transition={{ 
            scale: { duration: 0.3, delay: 0.4 },
            y: { duration: 1, repeat: Infinity, delay: 0.2 }
          }}
        />
      </svg>
    )
  }
];

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Laden..." }: LoadingScreenProps) {
  const [currentCharacter, setCurrentCharacter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={characters[currentCharacter].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-primary"
          >
            {characters[currentCharacter].svg}
          </motion.div>
        </AnimatePresence>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg font-medium text-foreground"
        >
          {message}
        </motion.p>
        <motion.div
          className="mt-2 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
