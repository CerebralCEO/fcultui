"use client";

import { motion } from "framer-motion";

// Remounts per screen (the rail in the layout does not): the article softly rises in while the rail stays put.
export default function DetailTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="detail-body"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
