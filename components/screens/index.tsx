/*
 * Demo screens (390 × 844 logical px). Placeholders until live React Native web / Flutter renders
 * replace them — see docs/PLAN.md §2. Animations run only while the parent .device has [data-playing].
 */
import type { CSSProperties } from "react";
import type { ScreenDesign } from "@/lib/data";
import type { Tone } from "../device/Device";
import "./screens.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Onboarding() {
  return (
    <div className="sc sc-onb">
      <div className="sc-row sc-onb-top">
        <span className="sc-onb-brand">
          <i /> Bloom
        </span>
        <span className="sc-muted">Skip</span>
      </div>
      <div className="sc-onb-art">
        <div className="sc-onb-ring" />
        <div className="sc-onb-orb" />
        <div className="sc-onb-chip c1">
          <b /> 12-day streak
        </div>
        <div className="sc-onb-chip c2">+ Morning run</div>
        <div className="sc-onb-chip c3">Read 20 pages ✓</div>
      </div>
      <div className="sc-onb-copy">
        <h2>
          Grow a little
          <br />
          every day
        </h2>
        <p>Build habits that stick with gentle reminders and beautiful progress.</p>
      </div>
      <div className="sc-dots">
        <i className="on" />
        <i />
        <i />
      </div>
      <div className="sc-btn sc-btn-dark">Get started</div>
    </div>
  );
}

function Auth() {
  return (
    <div className="sc sc-auth">
      <div className="sc-auth-logo">
        <i />
      </div>
      <h2>Welcome back</h2>
      <p className="sc-muted">Sign in to continue to Nova</p>
      <div className="sc-auth-form">
        <label>Email</label>
        <div className="sc-field">sara@nova.app</div>
        <label>Password</label>
        <div className="sc-field sc-pw">
          {Array.from({ length: 10 }, (_, n) => (
            <b key={n} style={i(n)} />
          ))}
          <em />
        </div>
        <div className="sc-row sc-auth-meta">
          <span>
            <i className="sc-check" /> Remember me
          </span>
          <span className="sc-accent">Forgot?</span>
        </div>
        <div className="sc-btn sc-btn-accent sc-auth-btn">
          <span>Sign in</span>
          <i />
        </div>
      </div>
      <div className="sc-divider">
        <span>or continue with</span>
      </div>
      <div className="sc-social">
        <i>G</i>
        <i>X</i>
        <i>f</i>
      </div>
      <p className="sc-auth-foot">
        New here? <b>Create account</b>
      </p>
    </div>
  );
}

function Finance() {
  const bars = [42, 68, 51, 90, 62, 76, 38];
  return (
    <div className="sc sc-fin">
      <div className="sc-row">
        <div className="sc-row sc-gap12">
          <i className="sc-avatar" />
          <div>
            <p className="sc-muted sc-small">Good morning</p>
            <p className="sc-strong">Sara Lee</p>
          </div>
        </div>
        <i className="sc-icon-btn">
          <b />
        </i>
      </div>
      <div className="sc-fin-card">
        <p className="sc-small">Total balance</p>
        <h3>$24,830.50</h3>
        <p className="sc-fin-up">+2.4% this month</p>
        <div className="sc-row sc-fin-num">
          <span>•••• 4291</span>
          <span>VISA</span>
        </div>
        <i className="sc-fin-shine" />
      </div>
      <div className="sc-row sc-fin-actions">
        {["Send", "Request", "Top up", "More"].map((l) => (
          <div key={l}>
            <i />
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="sc-row">
        <p className="sc-strong">Spending</p>
        <span className="sc-muted sc-small">This week</span>
      </div>
      <div className="sc-fin-chart">
        {bars.map((h, n) => (
          <div key={n} className={n === 3 ? "on" : undefined}>
            <b style={{ ...i(n), height: `${h}%` }} />
            <span>{"MTWTFSS"[n]}</span>
          </div>
        ))}
      </div>
      <div className="sc-fin-tx">
        {[
          ["Spotify", "Subscription", "-$9.99"],
          ["Salary", "Acme Inc.", "+$4,200"],
          ["Blue Bottle", "Coffee", "-$6.50"],
        ].map(([a, b, c], n) => (
          <div key={a} className="sc-row">
            <div className="sc-row sc-gap12">
              <i className={`t${n}`} />
              <div>
                <p className="sc-strong">{a}</p>
                <p className="sc-muted sc-small">{b}</p>
              </div>
            </div>
            <span className={c.startsWith("+") ? "sc-pos" : "sc-strong"}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Music() {
  return (
    <div className="sc sc-music">
      <div className="sc-row sc-music-top">
        <i className="sc-chev" />
        <span className="sc-small sc-caps">Now playing</span>
        <i className="sc-more" />
      </div>
      <div className="sc-music-art">
        <div className="sc-vinyl">
          <i />
        </div>
      </div>
      <div className="sc-row sc-music-meta">
        <div>
          <h2>Midnight Drive</h2>
          <p className="sc-muted">Neon Coast</p>
        </div>
        <i className="sc-heart" />
      </div>
      <div className="sc-progress">
        <b />
      </div>
      <div className="sc-row sc-small sc-muted">
        <span>1:24</span>
        <span>3:48</span>
      </div>
      <div className="sc-row sc-music-ctrl">
        <i className="sm" />
        <i className="prev" />
        <i className="play">
          <b />
          <b />
        </i>
        <i className="next" />
        <i className="sm" />
      </div>
      <div className="sc-eq">
        {Array.from({ length: 28 }, (_, n) => (
          <b key={n} style={{ ...i(n), height: `${20 + ((n * 37) % 70)}%` }} />
        ))}
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div className="sc sc-shop">
      <div className="sc-row">
        <i className="sc-icon-btn light">
          <span className="sc-back" />
        </i>
        <span className="sc-strong">Details</span>
        <i className="sc-icon-btn light sc-bag">
          <em>2</em>
        </i>
      </div>
      <div className="sc-shop-stage">
        <div className="sc-shop-disc" />
        <div className="sc-bottle">
          <i className="cap" />
          <i className="body">
            <b>AURA</b>
          </i>
        </div>
        <div className="sc-shop-shadow" />
      </div>
      <div className="sc-row">
        <div>
          <h2>Aura Bottle</h2>
          <p className="sc-muted">★ 4.9 · 2.1k reviews</p>
        </div>
        <h3 className="sc-price">$38</h3>
      </div>
      <p className="sc-muted sc-shop-desc">Double-walled steel keeps drinks cold for 24 hours and hot for 12.</p>
      <div className="sc-swatches">
        <i className="s0" />
        <i className="s1" />
        <i className="s2" />
        <i className="s3" />
        <b className="ring" />
      </div>
      <div className="sc-row sc-shop-cta">
        <div className="sc-qty">
          <span>−</span>1<span>+</span>
        </div>
        <div className="sc-btn sc-btn-dark">Add to bag</div>
      </div>
    </div>
  );
}

function Chat() {
  const msgs: [string, "in" | "out"][] = [
    ["Hey! Are we still on for tonight?", "in"],
    ["Yes! 7pm at Lumen 🍜", "out"],
    ["Perfect. I booked a table by the window", "in"],
    ["You're the best", "out"],
    ["Bringing the photos from the trip too", "out"],
  ];
  return (
    <div className="sc sc-chat">
      <div className="sc-row sc-chat-head">
        <div className="sc-row sc-gap12">
          <span className="sc-back dark" />
          <i className="sc-avatar b" />
          <div>
            <p className="sc-strong">Maya Chen</p>
            <p className="sc-online sc-small">Online</p>
          </div>
        </div>
        <div className="sc-row sc-gap12">
          <i className="sc-call" />
          <i className="sc-video" />
        </div>
      </div>
      <div className="sc-chat-body">
        <span className="sc-date">Today</span>
        {msgs.map(([t, d], n) => (
          <p key={n} className={`sc-bubble ${d}`} style={i(n)}>
            {t}
          </p>
        ))}
        <p className="sc-bubble in sc-typing" style={i(5)}>
          <b />
          <b />
          <b />
        </p>
      </div>
      <div className="sc-row sc-chat-input">
        <i className="plus" />
        <span>Message</span>
        <i className="mic" />
      </div>
    </div>
  );
}

function Fitness() {
  const rings = [
    { r: 118, c: "#FA114F", v: 0.84 },
    { r: 92, c: "#A6FF00", v: 0.72 },
    { r: 66, c: "#00D8FF", v: 0.6 },
  ];
  return (
    <div className="sc sc-fit">
      <p className="sc-muted sc-small sc-caps">Tuesday, Jun 18</p>
      <h1>Activity</h1>
      <div className="sc-rings">
        <svg viewBox="0 0 280 280">
          {rings.map((g, n) => {
            const len = 2 * Math.PI * g.r;
            return (
              <g key={n}>
                <circle cx="140" cy="140" r={g.r} stroke={g.c} strokeOpacity="0.22" strokeWidth="22" fill="none" />
                <circle
                  className="sc-ring"
                  cx="140"
                  cy="140"
                  r={g.r}
                  stroke={g.c}
                  strokeWidth="22"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={len}
                  style={{ ...i(n), "--len": len, strokeDashoffset: len * (1 - g.v) } as CSSProperties}
                  transform="rotate(-90 140 140)"
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="sc-fit-stats">
        {[
          ["Move", "420/500", "KCAL", "#FA114F"],
          ["Exercise", "32/30", "MIN", "#A6FF00"],
          ["Stand", "9/12", "HRS", "#00D8FF"],
        ].map(([a, b, c, col]) => (
          <div key={a}>
            <p className="sc-small">{a}</p>
            <p className="sc-fit-val" style={{ color: col }}>
              {b}
              <span>{c}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="sc-fit-week">
        {[60, 80, 45, 95, 70, 30, 84].map((h, n) => (
          <div key={n}>
            <b style={{ ...i(n), height: `${h}%` }} />
            <span>{"MTWTFSS"[n]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Travel() {
  return (
    <div className="sc sc-trav">
      <div className="sc-row">
        <div>
          <p className="sc-muted sc-small">Where to next?</p>
          <h2>Explore</h2>
        </div>
        <i className="sc-avatar c" />
      </div>
      <div className="sc-search">Search destinations</div>
      <div className="sc-trav-hero">
        <i className="sun" />
        <i className="cloud c1" />
        <i className="cloud c2" />
        <i className="m m1" />
        <i className="m m2" />
        <i className="m m3" />
        <div className="sc-trav-label">
          <h3>Iceland</h3>
          <p>12 trips · from $890</p>
        </div>
        <i className="sc-heart w" />
      </div>
      <div className="sc-chips">
        <span className="on">Mountains</span>
        <span>Beaches</span>
        <span>Cities</span>
        <span>Forests</span>
      </div>
      <div className="sc-row">
        <p className="sc-strong">Popular</p>
        <span className="sc-accent sc-small">See all</span>
      </div>
      <div className="sc-trav-row">
        <div className="sc-trav-track">
          {["Lofoten", "Dolomites", "Patagonia", "Kyoto"].map((n, k) => (
            <div key={n} className={`card k${k}`}>
              <i />
              <p>{n}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Meditation() {
  return (
    <div className="sc sc-med">
      <div className="sc-row">
        <i className="sc-x" />
        <span className="sc-small sc-caps">Breathe</span>
        <i className="sc-more" />
      </div>
      <div className="sc-breath">
        <i className="r3" />
        <i className="r2" />
        <i className="r1" />
        <div className="core">
          <span className="a">Breathe in</span>
          <span className="b">Breathe out</span>
        </div>
      </div>
      <p className="sc-med-time">04:32</p>
      <p className="sc-muted sc-center">Relax your shoulders and follow the circle</p>
      <div className="sc-med-ctrl">
        <i className="sm" />
        <i className="pause">
          <b />
          <b />
        </i>
        <i className="sm" />
      </div>
    </div>
  );
}

function Weather() {
  return (
    <div className="sc sc-wx">
      <div className="sc-center">
        <p className="sc-strong">San Francisco</p>
        <p className="sc-small sc-dim">Tue, 18 June</p>
      </div>
      <div className="sc-wx-art">
        <div className="sun">
          <i className="rays" />
          <i className="disc" />
        </div>
        <i className="cloud" />
      </div>
      <h1 className="sc-wx-temp">24°</h1>
      <p className="sc-center sc-dim">Partly cloudy · H 26° L 17°</p>
      <div className="sc-wx-stats">
        {[
          ["Wind", "12 km/h"],
          ["Humidity", "48%"],
          ["UV", "5 Mod"],
        ].map(([a, b]) => (
          <div key={a}>
            <span className="sc-small sc-dim">{a}</span>
            <p className="sc-strong">{b}</p>
          </div>
        ))}
      </div>
      <div className="sc-wx-hours">
        {[
          ["Now", "24°"],
          ["14", "25°"],
          ["15", "26°"],
          ["16", "24°"],
          ["17", "22°"],
        ].map(([a, b], n) => (
          <div key={a} className={n === 0 ? "on" : undefined} style={i(n)}>
            <span className="sc-small">{a}</span>
            <i />
            <p>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const groups: [string, string, "on" | "off" | string][][] = [
    [
      ["Airplane Mode", "#FF9500", "off"],
      ["Wi-Fi", "#0A84FF", "Home"],
      ["Bluetooth", "#0A84FF", "On"],
    ],
    [
      ["Notifications", "#FF3B30", "on"],
      ["Focus", "#5E5CE6", "off"],
      ["Dark Mode", "#1C1C1E", "off"],
      ["Haptics", "#FF2D55", "on"],
    ],
  ];
  let t = 0;
  return (
    <div className="sc sc-set">
      <h1>Settings</h1>
      <div className="sc-set-search">Search</div>
      <div className="sc-set-group">
        <div className="sc-row sc-set-profile">
          <div className="sc-row sc-gap12">
            <i className="sc-avatar d" />
            <div>
              <p className="sc-strong">Sara Lee</p>
              <p className="sc-small sc-muted">Account, sync &amp; more</p>
            </div>
          </div>
          <i className="sc-chevr" />
        </div>
      </div>
      {groups.map((g, gi) => (
        <div className="sc-set-group" key={gi}>
          {g.map(([label, color, v]) => {
            const toggle = v === "on" || v === "off";
            const idx = toggle ? t++ : 0;
            return (
              <div className="sc-row sc-set-row" key={label}>
                <div className="sc-row sc-gap12">
                  <i className="sc-set-ic" style={{ background: color }} />
                  <span>{label}</span>
                </div>
                {toggle ? (
                  <i className={`sc-toggle ${v}`} style={i(idx)}>
                    <b />
                  </i>
                ) : (
                  <span className="sc-muted">
                    {v} <i className="sc-chevr" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Delivery() {
  return (
    <div className="sc sc-del">
      <div className="sc-map">
        <svg viewBox="0 0 390 520" preserveAspectRatio="none">
          <rect width="390" height="520" fill="#E8EDF1" />
          <path d="M-10 140 C 120 120, 220 190, 400 150" stroke="#fff" strokeWidth="18" fill="none" />
          <path d="M60 -10 L 110 540" stroke="#fff" strokeWidth="14" fill="none" />
          <path d="M-10 360 C 150 330, 260 420, 400 380" stroke="#fff" strokeWidth="16" fill="none" />
          <path d="M290 -10 L 250 540" stroke="#fff" strokeWidth="12" fill="none" />
          <ellipse cx="185" cy="265" rx="62" ry="44" fill="#CFE8D3" />
          <ellipse cx="340" cy="470" rx="70" ry="50" fill="#CFE8D3" />
          <path
            className="sc-route"
            d="M96 438 C 90 360, 150 330, 200 300 S 270 200, 285 120"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <i className="pin a" />
        <i className="pin b" />
        <i className="courier" />
        <div className="sc-row sc-del-top">
          <i className="sc-icon-btn light">
            <span className="sc-back" />
          </i>
          <span className="sc-pill">Order #4821</span>
        </div>
      </div>
      <div className="sc-sheet">
        <i className="grab" />
        <p className="sc-muted sc-small">Arriving in</p>
        <h2>12 min</h2>
        <div className="sc-steps">
          {[0, 1, 2, 3].map((n) => (
            <i key={n} style={i(n)}>
              <b />
            </i>
          ))}
        </div>
        <div className="sc-row sc-small sc-muted">
          <span>Picked up</span>
          <span>On the way</span>
          <span>Delivered</span>
        </div>
        <div className="sc-row sc-courier">
          <div className="sc-row sc-gap12">
            <i className="sc-avatar e" />
            <div>
              <p className="sc-strong">Daniel K.</p>
              <p className="sc-small sc-muted">★ 4.9 · Courier</p>
            </div>
          </div>
          <div className="sc-row sc-gap12">
            <i className="sc-round" />
            <i className="sc-round acc" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const screenRegistry: Record<ScreenDesign, { tone: Tone; Component: () => React.ReactElement }> = {
  onboarding: { tone: "light", Component: Onboarding },
  auth: { tone: "dark", Component: Auth },
  finance: { tone: "dark", Component: Finance },
  music: { tone: "dark", Component: Music },
  shop: { tone: "light", Component: Shop },
  chat: { tone: "light", Component: Chat },
  fitness: { tone: "dark", Component: Fitness },
  travel: { tone: "light", Component: Travel },
  meditation: { tone: "dark", Component: Meditation },
  weather: { tone: "dark", Component: Weather },
  settings: { tone: "light", Component: Settings },
  delivery: { tone: "light", Component: Delivery },
};
