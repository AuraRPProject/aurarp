import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import auraIcon from "@/assets/aura-icon.png";
import { downloadExtension } from "@/lib/aura";
import { useExtension } from "@/hooks/useExtension";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — Rich Presence for the Web" },
      { name: "description", content: "Show what you're watching, listening to or browsing on Discord — automatically. Free Chromium extension supporting 40+ web platforms." },
    ],
  }),
  component: Index,
});

type Lang = "en" | "pt" | "es";

const T: Record<Lang, Record<string, string>> = {
  en: {
    badge: "Discord Rich Presence — for the open web",
    h1a: "Your aura,", h1b: "wherever you browse.",
    sub: "A tiny extension that updates your Discord profile with whatever you're watching, listening to, or doing on the web.",
    download: "Download", changelog: "Changelog", installed: "Aura is installed",
    free: "Free · Chromium browsers · No account required",
    example_h: "Looks like this on your profile",
    ex_listening: "Listening to Spotify", ex_song: "Midnight City", ex_artist: "M83 — Hurry Up, We're Dreaming",
    ex_open: "Open in browser",
    feat_h: "What it does",
    f1: "Auto-detects your activity on 40+ web platforms.",
    f2: "Custom activity with image, state and type.",
    f3: "Per-site toggles, idle awareness, incognito skip.",
    f4: "Token stays local — no servers, no DB, no telemetry.",
    plat_h: "40+ platforms supported",
    bye_h: "Sad to see you go.", bye_sub: "Thanks for trying Aura. Reinstall anytime.",
    bye_close: "Close",
    footer: "Not affiliated with Discord. Crafted with ♥.",
  },
  pt: {
    badge: "Discord Rich Presence — para a web aberta",
    h1a: "A tua aura,", h1b: "em qualquer lado da web.",
    sub: "Uma extensão pequena que atualiza o teu perfil do Discord com o que estás a ver, ouvir ou fazer na web.",
    download: "Descarregar", changelog: "Novidades", installed: "Aura está instalado",
    free: "Grátis · Navegadores Chromium · Sem conta necessária",
    example_h: "Aparece assim no teu perfil",
    ex_listening: "A ouvir no Spotify", ex_song: "Midnight City", ex_artist: "M83 — Hurry Up, We're Dreaming",
    ex_open: "Abrir no browser",
    feat_h: "O que faz",
    f1: "Deteta automaticamente em mais de 40 sites.",
    f2: "Atividade personalizada com imagem, estado e tipo.",
    f3: "Toggle por site, modo ausente, ignora anónimos.",
    f4: "O token fica local — sem servidores, sem DB, sem telemetria.",
    plat_h: "Mais de 40 plataformas",
    bye_h: "Triste por te ver partir.", bye_sub: "Obrigado por experimentares o Aura. Volta quando quiseres.",
    bye_close: "Fechar",
    footer: "Não afiliado com o Discord. Feito com ♥.",
  },
  es: {
    badge: "Discord Rich Presence — para la web abierta",
    h1a: "Tu aura,", h1b: "donde sea que navegues.",
    sub: "Una extensión pequeña que actualiza tu perfil de Discord con lo que estás viendo, escuchando o haciendo en la web.",
    download: "Descargar", changelog: "Novedades", installed: "Aura está instalado",
    free: "Gratis · Navegadores Chromium · Sin cuenta",
    example_h: "Se ve así en tu perfil",
    ex_listening: "Escuchando en Spotify", ex_song: "Midnight City", ex_artist: "M83 — Hurry Up, We're Dreaming",
    ex_open: "Abrir en navegador",
    feat_h: "Qué hace",
    f1: "Detecta automáticamente en 40+ sitios.",
    f2: "Actividad personalizada con imagen, estado y tipo.",
    f3: "Toggle por sitio, ausente automático, ignora incógnito.",
    f4: "El token queda local — sin servidores, sin DB, sin telemetría.",
    plat_h: "Más de 40 plataformas",
    bye_h: "Triste verte partir.", bye_sub: "Gracias por probar Aura. Vuelve cuando quieras.",
    bye_close: "Cerrar",
    footer: "No afiliado con Discord. Hecho con ♥.",
  },
};

const PLATFORMS = [
  "YouTube","Netflix","Spotify","Twitch","Kick","GitHub","GitLab","X","Reddit","SoundCloud",
  "Prime Video","Disney+","Max","Crunchyroll","Stack Overflow","Wikipedia","VS Code Web",
  "Apple Music","Tidal","Deezer","Vimeo","LinkedIn","Medium","Notion","Figma",
  "ChatGPT","Claude","Gemini","Gmail","Pinterest","TikTok","Instagram",
  "Letterboxd","AniList","MyAnimeList","Steam","Last.fm","Bandcamp","Genius",
  "Coursera","Udemy","Khan Academy","MDN","Duolingo",
];

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [bye, setBye] = useState(false);
  const { installed, version } = useExtension();

  useEffect(() => {
    const saved = localStorage.getItem("aura-lang") as Lang | null;
    if (saved && T[saved]) setLang(saved);
    else { const nav = (navigator.language || "en").slice(0, 2) as Lang; if (T[nav]) setLang(nav); }
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("goodbye") === "1") setBye(true);
  }, []);

  const change = (l: Lang) => { setLang(l); localStorage.setItem("aura-lang", l); };
  const x = T[lang];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {bye && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 backdrop-blur p-6 animate-[fadeSlide_.4s_ease-out]">
          <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold mb-2">{x.bye_h}</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{x.bye_sub}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={downloadExtension} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">{x.download}</button>
              <button onClick={() => { setBye(false); window.history.replaceState({}, "", "/"); }} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card transition">{x.bye_close}</button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/15 blur-[120px] animate-pulse" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <header className="flex items-center justify-between mb-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={auraIcon} alt="Aura" width={36} height={36} className="rounded-lg" />
            <span className="font-semibold text-lg">Aura</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/download" className="hover:text-foreground">{x.download}</Link>
            <Link to="/changelog" className="hover:text-foreground">{x.changelog}</Link>
          </nav>
          <div className="flex gap-1 rounded-md border border-border bg-card p-0.5 text-xs">
            {(["en","pt","es"] as Lang[]).map(l => (
              <button key={l} onClick={() => change(l)}
                className={`px-2 py-1 rounded ${lang===l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Hero — minimal */}
        <section className="text-center pt-8">
          <span className="inline-block rounded-full border border-border bg-card/50 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground animate-[fadeSlide_.5s_ease-out]">
            {x.badge}
          </span>
          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] animate-[fadeSlide_.6s_ease-out]">
            {x.h1a}<br />
            <span className="text-primary">{x.h1b}</span>
          </h1>
          <p className="mt-7 text-lg text-muted-foreground max-w-xl mx-auto animate-[fadeSlide_.7s_ease-out]">{x.sub}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-[fadeSlide_.8s_ease-out]">
            {installed ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {x.installed}{version ? ` · v${version}` : ""}
              </div>
            ) : (
              <button onClick={downloadExtension} className="rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/30">
                {x.download}
              </button>
            )}
            <Link to="/changelog" className="rounded-lg border border-border bg-card/50 backdrop-blur px-7 py-3.5 text-sm font-semibold hover:bg-card transition">
              {x.changelog}
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{x.free}</p>
        </section>

        {/* Example card */}
        <section className="mt-24 flex justify-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-primary/10 animate-[fadeSlide_.9s_ease-out]">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">{x.example_h}</div>
            <div className="rounded-xl bg-background/60 border border-border p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">{x.ex_listening}</div>
              <div className="flex gap-3">
                <div className="relative h-16 w-16 rounded-md bg-gradient-to-br from-primary to-purple-500 flex-none animate-pulse" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{x.ex_song}</div>
                  <div className="text-xs text-muted-foreground truncate">{x.ex_artist}</div>
                  <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-1/3 bg-primary animate-[grow_3s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full rounded-md border border-border bg-card text-xs py-2 hover:bg-background transition">{x.ex_open}</button>
            </div>
          </div>
        </section>

        {/* Minimal feature grid (no rotation, less noise) */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold mb-8 text-center">{x.feat_h}</h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {[x.f1, x.f2, x.f3, x.f4].map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/50 backdrop-blur p-5 text-sm leading-relaxed">{f}</div>
            ))}
          </div>
        </section>

        {/* Platforms — compact pills */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold mb-6 text-center">{x.plat_h}</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {PLATFORMS.map(p => (
              <span key={p} className="rounded-full bg-card border border-border px-3 py-1 text-xs text-muted-foreground">{p}</span>
            ))}
          </div>
        </section>

        <footer className="mt-24 mb-6 text-center text-xs text-muted-foreground">{x.footer}</footer>
      </div>

      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
        @keyframes grow { 0%,100% { width: 20%; } 50% { width: 80%; } }
      `}</style>
    </main>
  );
}
