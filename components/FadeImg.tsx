"use client";

import { useEffect, useRef, useState } from "react";

/** Plain <img> that fades in once decoded — also handles images that finished loading before hydration. */
export default function FadeImg({ className = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      ref={ref}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      {...props}
      className={`${className} ${loaded ? "" : "is-loading"}`.trim()}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
    />
  );
}
