import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLang } from "@/lib/i18n";
import { useExtension } from "@/hooks/useExtension";
import { downloadExtension } from "@/lib/aura";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Aura Dashboard — your activity at a glance" },
      { name: "description", content: "Local dashboard reading data straight from your Aura extension. No login, no server." },
    ],
  }),
  component: Dashboard,
});

const T = {
  en: { h: "Your dashboard", sub: "Reads your Aura data locally — nothing is sent anywhere.", not_installed: "Install the Aura extension to see your stats here.", today: "Today", week: "This week", platforms: "Top platforms", current: "Currently showing", none: "Nothing yet — open a supported site.", install: "Download Aura", min: "min" },
  pt: { h: "O teu painel", sub: "Lê os dados do Aura localmente — nada é enviado.", not_installed: "Instala a extensão Aura para veres as estatísticas aqui.", today: "Hoje", week: "Esta semana", platforms: "Top plataformas", current: "A mostrar agora", none: "Ainda nada — abre um site suportado.", install: "Descarregar Aura", min: "min" },
  es: { h: "Tu panel", sub: "Lee tus datos de Aura localmente — no se envía nada.", not_installed: "Instala la extensión Aura para ver tus estadísticas aquí.", today: "Hoy", week: "Esta semana", platforms: "Top plataformas", current: "Mostrando ahora", none: "Nada aún — abre un sitio compatible.", install: "Descargar Aura", min: "min" },
};

type DashData = {
  trackedToday?: Record<string, number>;
  trackedByApp?: Record<string, number>;
  current?: { name?: string; details?: string; state?: string } | null;
};

function Dashboard() {
  const [lang] = useLang();
  const t = T[lang];
  const { installed } = useExtension();
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMsg = (e: MessageEvent) => {
      if (e.data?.source === "aura-extension" && e.data.type === "dashdata") setData(e.data.data || {});
    };
    window.addEventListener("message", onMsg);
    const ping = () => window.postMessage({ source: "aura-page", type: "dashreq" }, "*");
    ping();
    const i = setInterval(ping, 4000);
    return () => { window.removeEventListener("message", onMsg); clearInterval(i); };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayMin = Math.round(((data?.trackedToday?.[today] || 0) / 60));
  const weekMin = Math.round(Object.values(data?.trackedToday || {}).reduce((a, b) => a + b, 0) / 60);

  const top = Object.entries(data?.trackedByApp || {})
    .filter(([k]) => k.startsWith(today + ":"))
    .map(([k, v]) => [k.split(":")[1], v as number] as const)
    .sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = top[0]?.[1] || 1;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <SiteHeader />

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t.h}</h1>
        <p className="mt-3 text-muted-foreground">{t.sub}</p>

        {!installed ? (
          <div className="mt-12 rounded-2xl border border-border bg-card/50 p-10 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-muted-foreground mb-6">{t.not_installed}</p>
            <button onClick={downloadExtension} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">{t.install}</button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/40 p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.today}</div>
                <div className="text-4xl font-bold">{todayMin} <span className="text-base font-normal text-muted-foreground">{t.min}</span></div>
              </div>
              <div className="rounded-xl border border-border bg-card/40 p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.week}</div>
                <div className="text-4xl font-bold">{weekMin} <span className="text-base font-normal text-muted-foreground">{t.min}</span></div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card/40 p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t.current}</div>
              {data?.current ? (
                <div>
                  <div className="font-semibold">{data.current.name}</div>
                  <div className="text-sm text-muted-foreground">{data.current.details}</div>
                  <div className="text-sm text-muted-foreground">{data.current.state}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">{t.none}</div>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card/40 p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">{t.platforms}</div>
              {top.length ? (
                <div className="space-y-2">
                  {top.map(([id, sec]) => (
                    <div key={id} className="grid grid-cols-[100px_1fr_50px] gap-3 items-center text-sm">
                      <span className="capitalize">{id}</span>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-400" style={{ width: `${Math.max(8, (sec / max) * 100)}%` }} />
                      </div>
                      <span className="text-muted-foreground text-right">{Math.round(sec / 60)}m</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">{t.none}</div>
              )}
            </div>
          </>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
