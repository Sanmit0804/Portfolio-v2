'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RotatingText({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2500); // changes every 2.5s
    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden leading-tight font-medium text-blue-400">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: '100%', opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '-100%', opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="whitespace-nowrap flex items-center justify-center px-4"
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
