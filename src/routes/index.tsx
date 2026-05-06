import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebPresence — Rich Presence for Web Services" },
      { name: "description", content: "Show what you're watching, listening to, or browsing on Discord — automatically. Free Chrome extension supporting YouTube, Netflix, Spotify, Twitch and more." },
    ],
  }),
  component: Index,
});

const PLATFORMS = [
  "YouTube", "Netflix", "Spotify", "Twitch", "GitHub", "X",
  "Reddit", "SoundCloud", "Prime Video", "Disney+", "Max",
  "Crunchyroll", "Stack Overflow", "Wikipedia", "VS Code Web",
];

function download() {
  fetch("/webpresence.zip")
    .then((r) => { if (!r.ok) throw new Error("Download failed"); return r.blob(); })
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "webpresence.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch((e) => alert(e.message));
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <span className="font-semibold">WebPresence</span>
          </div>
          <a href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
        </header>

        <section className="text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
            Discord Rich Presence · for the web
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">
            Show what you're doing.
            <br />
            <span className="text-primary">Everywhere on the web.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple Chrome extension that updates your Discord status with what you're watching, listening to, or browsing — across {PLATFORMS.length}+ websites. No install, no setup hassle.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={download}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Download Extension
            </button>
            <a href="#setup" className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-card transition">
              How it works
            </a>
          </div>
        </section>

        <section className="mt-20">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Supported platforms</div>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span key={p} className="rounded-full bg-secondary border border-border px-3 py-1 text-xs">{p}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="setup" className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Setup in under 2 minutes</h2>
          <ol className="space-y-4">
            {[
              ["Download & unzip", "Click the download button above and unzip the file."],
              ["Open chrome://extensions", "Enable Developer mode (top right), then click Load unpacked and pick the unzipped folder."],
              ["Create a Discord bot", <>Go to the <a className="text-primary hover:underline" href="https://discord.com/developers/applications" target="_blank" rel="noreferrer">Developer Portal</a>, create an application, copy the Bot Token and Application ID.</>],
              ["Connect", "Open the WebPresence popup, paste your token + app ID, hit Save & Connect."],
              ["Browse", "Open YouTube, Spotify or any supported site — your Discord status updates automatically."],
            ].map(([title, body], i) => (
              <li key={i} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <span className="flex-none h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold">{i + 1}</span>
                <div>
                  <div className="font-semibold">{title as string}</div>
                  <div className="text-sm text-muted-foreground mt-1">{body}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Not affiliated with Discord. Built with ♥ for the web.
        </footer>
      </div>
    </main>
  );
}
