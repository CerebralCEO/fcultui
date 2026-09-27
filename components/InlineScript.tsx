"use client";

// Per Next 16 "preventing flash before hydration" guide: executes on the server-rendered HTML,
// inert on the client so React doesn't warn about rendering <script>.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
