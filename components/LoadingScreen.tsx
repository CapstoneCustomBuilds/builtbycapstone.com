"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-heading text-3xl font-light tracking-[0.3em] text-text-primary md:text-4xl"
          >
            CAPSTONE
            <span className="inline-block -translate-y-[0.4em] text-[0.35em] md:text-[0.45em] leading-none text-accent-gold">&#9670;</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
