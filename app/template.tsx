"use client";

import { motion } from "framer-motion";

// Remounts on every navigation → soft cross-route fade/rise
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="page-transition"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  );
}
