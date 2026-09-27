"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthState } from "./AuthProvider";

/** Header account control: "Sign in" when signed out, avatar + menu when signed in. */
export default function AccountButton() {
  const { loaded, signedIn, user, openAuth, signOut } = useAuthState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!loaded) return <li className="account" aria-hidden />;

  if (!signedIn || !user) {
    return (
      <li className="account">
        <button onClick={() => openAuth()}>Sign in</button>
      </li>
    );
  }

  return (
    <li className="account" ref={ref}>
      <button className="account-avatar" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Account">
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span>{user.name[0]?.toUpperCase()}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="account-menu"
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="account-who">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <p className="account-perk">Flutter code unlocked</p>
            <button
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
