import { createFileRoute } from "@tanstack/react-router";
import { downloadExtension } from "@/lib/aura";
import { useExtension } from "@/hooks/useExtension";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLang } from "@/lib/i18n";
import auraIcon from "@/assets/aura-icon.png";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download Aura — Discord Rich Presence for the web" },
      { name: "description", content: "Download Aura — Chromium extension, Android PWA install, and desktop build coming soon." },
      { property: "og:title", content: "Download Aura" },
      { property: "og:description", content: "Get Aura on Chrome/Edge/Brave, install as PWA on Android, or use the desktop build." },
    ],
  }),
  component: DownloadPage,
});

const T = {
  en: {
    h: "Get Aura", sub: "Pick your platform.",
    ext_h: "Browser extension", ext_sub: "Chrome, Edge, Brave, Arc, Opera, Vivaldi.",
    pwa_h: "Android (PWA)", pwa_sub: "Install the website as an app from your browser menu — works offline for the dashboard.",
    pwa_btn: "Open install instructions",
    pc_h: "Desktop", pc_sub: "Windows / macOS / Linux build is being prepared. The source is open and ready in /electron — run `npm run build:pc` locally.",
    pc_btn: "View build instructions",
    steps_h: "After installing the extension",
    steps: [
      ["Unzip the file", "Extract aura.zip to a folder."],
      ["Open chrome://extensions", "Or edge://, brave://, etc."],
      ["Enable Developer mode", "Toggle in the top-right."],
      ["Click 'Load unpacked'", "Select the extracted folder."],
      ["Open popup → Account", "Paste your Discord token and click Login & Connect."],
    ] as [string, string][],
  },
  pt: {
    h: "Obtém o Aura", sub: "Escolhe a tua plataforma.",
    ext_h: "Extensão de browser", ext_sub: "Chrome, Edge, Brave, Arc, Opera, Vivaldi.",
    pwa_h: "Android (PWA)", pwa_sub: "Instala o site como app pelo menu do browser — funciona offline para o painel.",
    pwa_btn: "Ver instruções de instalação",
    pc_h: "Desktop", pc_sub: "A versão Windows / macOS / Linux está em preparação. O código está em /electron — corre `npm run build:pc` localmente.",
    pc_btn: "Ver instruções de build",
    steps_h: "Depois de instalar a extensão",
    steps: [
      ["Descomprime o ficheiro", "Extrai aura.zip para uma pasta."],
      ["Abre chrome://extensions", "Ou edge://, brave://, etc."],
      ["Ativa Modo programador", "Botão no canto superior direito."],
      ["Clica em 'Carregar descompactada'", "Seleciona a pasta extraída."],
      ["Abre o popup → Conta", "Cola o token do Discord e clica Entrar e Conectar."],
    ] as [string, string][],
  },
  es: {
    h: "Obtener Aura", sub: "Elige tu plataforma.",
    ext_h: "Extensión de navegador", ext_sub: "Chrome, Edge, Brave, Arc, Opera, Vivaldi.",
    pwa_h: "Android (PWA)", pwa_sub: "Instala el sitio como app desde el menú del navegador — funciona offline para el panel.",
    pwa_btn: "Ver instrucciones",
    pc_h: "Escritorio", pc_sub: "La versión Windows / macOS / Linux está en preparación. El código está en /electron — ejecuta `npm run build:pc` localmente.",
    pc_btn: "Ver instrucciones de build",
    steps_h: "Después de instalar la extensión",
    steps: [
      ["Descomprime el archivo", "Extrae aura.zip a una carpeta."],
      ["Abre chrome://extensions", "O edge://, brave://, etc."],
      ["Activa Modo desarrollador", "Toggle en la esquina superior derecha."],
      ["Clic en 'Cargar descomprimida'", "Selecciona la carpeta."],
      ["Abre popup → Cuenta", "Pega tu token de Discord y clic en Iniciar sesión."],
    ] as [string, string][],
  },
};

function DownloadPage() {
  const { installed, version } = useExtension();
  const [lang] = useLang();
  const t = T[lang];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <SiteHeader />

        <section className="text-center">
          <img src={auraIcon} alt="" width={80} height={80} className="mx-auto rounded-2xl shadow-2xl shadow-primary/30" />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">{t.h}</h1>
          <p className="mt-3 text-muted-foreground">{t.sub}</p>
        </section>

        <div className="mt-12 grid gap-4">
          {/* Extension */}
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">{t.ext_h}</div>
                <div className="text-sm text-muted-foreground">{t.ext_sub}</div>
              </div>
              {installed ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Installed{version ? ` v${version}` : ""}
                </span>
              ) : (
                <button onClick={downloadExtension} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
                  aura.zip
                </button>
              )}
            </div>
          </div>

          {/* PWA */}
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
            <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">{t.pwa_h}</div>
            <p className="text-sm text-muted-foreground">{t.pwa_sub}</p>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-primary hover:underline">{t.pwa_btn}</summary>
              <div className="mt-3 text-muted-foreground space-y-1">
                <div>• Android (Chrome): menu ⋮ → "Add to home screen"</div>
                <div>• iOS (Safari): share → "Add to Home Screen"</div>
              </div>
            </details>
          </div>

          {/* Desktop */}
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
            <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">{t.pc_h}</div>
            <p className="text-sm text-muted-foreground">{t.pc_sub}</p>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-primary hover:underline">{t.pc_btn}</summary>
              <pre className="mt-3 rounded-lg bg-background border border-border p-3 text-xs overflow-x-auto"><code>{`npm install
npm run build:pc       # Linux
npm run build:pc:win   # Windows
npm run build:pc:mac   # macOS`}</code></pre>
            </details>
          </div>
        </div>

        <h2 className="mt-16 text-xl font-bold mb-4">{t.steps_h}</h2>
        <ol className="space-y-3">
          {t.steps.map(([title, desc], i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-border bg-card/30 backdrop-blur p-4">
              <span className="flex-none h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 text-primary-foreground grid place-items-center text-sm font-bold">{i + 1}</span>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </li>
          ))}
        </ol>

        <SiteFooter />
      </div>
    </main>
  );
}
