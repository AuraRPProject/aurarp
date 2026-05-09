import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Aura Changelog — what's new" },
      { name: "description", content: "All Aura releases and what's new in each version." },
      { property: "og:title", content: "Aura Changelog" },
    ],
  }),
  component: ChangelogPage,
});

const T = {
  en: { h: "Changelog", sub: "Every Aura release, in one place.",
    items: {
      "1.5.0": ["Platforms grouped by category in popup", "Live preview while editing custom activity", "Enable / Disable all sites with one click", "Made by SrKing credit", "Website: dashboard, full i18n, PWA installable on Android"],
      "1.4.0": ["Minimalist play-style icon", "13+ new platforms (Kick, GitLab, Claude, Gemini, Steam, Letterboxd…)", "Custom activity now supports state line + image URL", "Cleaner Discord gateway identify"],
      "1.3.0": ["Update notifications inside the popup", "Uninstall thank-you page", "About tab with version info"],
      "1.2.0": ["Activity thumbnails (external assets)", "Top apps today bar chart", "Open-in-browser button on activity"],
      "1.1.0": ["User token login (your own profile)", "Logs panel", "Reset & manage settings"],
      "1.0.0": ["First release — auto-detect, custom activity, per-site toggles, EN/PT/ES"],
    } as Record<string, string[]>
  },
  pt: { h: "Novidades", sub: "Cada versão do Aura, num só sítio.",
    items: {
      "1.5.0": ["Plataformas agrupadas por categoria no popup", "Pré-visualização ao vivo da atividade custom", "Ativar / Desativar todos os sites com um clique", "Crédito 'Feito por SrKing'", "Site: dashboard, traduções completas, PWA instalável no Android"],
      "1.4.0": ["Ícone minimalista com play", "13+ novas plataformas", "Atividade custom com estado e imagem", "Identify do gateway mais limpo"],
      "1.3.0": ["Notificações de atualização no popup", "Página de despedida ao desinstalar", "Aba 'Sobre' com versão"],
      "1.2.0": ["Miniaturas na atividade", "Top apps de hoje", "Botão 'Abrir' na atividade"],
      "1.1.0": ["Login com token de utilizador", "Painel de logs", "Repor e gerir definições"],
      "1.0.0": ["Primeira versão — auto-deteção, atividade custom, toggles, EN/PT/ES"],
    } as Record<string, string[]>
  },
  es: { h: "Novedades", sub: "Cada versión de Aura, en un solo sitio.",
    items: {
      "1.5.0": ["Plataformas agrupadas por categoría en popup", "Vista previa en vivo al editar actividad custom", "Activar / Desactivar todos los sitios con un clic", "Crédito 'Hecho por SrKing'", "Sitio: dashboard, traducciones completas, PWA instalable en Android"],
      "1.4.0": ["Icono minimalista con play", "13+ plataformas nuevas", "Actividad custom con estado e imagen", "Identify del gateway más limpio"],
      "1.3.0": ["Notificaciones de actualización en popup", "Página de despedida al desinstalar", "Pestaña 'Acerca de'"],
      "1.2.0": ["Miniaturas en la actividad", "Top apps de hoy", "Botón 'Abrir' en la actividad"],
      "1.1.0": ["Login con token de usuario", "Panel de logs", "Restablecer ajustes"],
      "1.0.0": ["Primera versión — auto-detección, actividad custom, toggles, EN/PT/ES"],
    } as Record<string, string[]>
  },
};

const RELEASES = [
  { v: "1.5.0", date: "2026-05" },
  { v: "1.4.0", date: "2026-05" },
  { v: "1.3.0", date: "2026-04" },
  { v: "1.2.0", date: "2026-03" },
  { v: "1.1.0", date: "2026-02" },
  { v: "1.0.0", date: "2026-01" },
];

function ChangelogPage() {
  const [lang] = useLang();
  const t = T[lang];
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <SiteHeader />
        <h1 className="text-4xl font-bold tracking-tight">{t.h}</h1>
        <p className="mt-3 text-muted-foreground">{t.sub}</p>

        <div className="mt-12 space-y-6">
          {RELEASES.map((r, idx) => (
            <article key={r.v} className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 relative">
              {idx === 0 && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider rounded-full bg-primary/20 text-primary px-2 py-0.5 font-bold">Latest</span>
              )}
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-xl font-bold">v{r.v}</h2>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <ul className="space-y-2 text-sm">
                {(t.items[r.v] || []).map((it, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">•</span><span className="text-muted-foreground">{it}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
