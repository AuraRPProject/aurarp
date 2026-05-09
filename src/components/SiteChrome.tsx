import { Link } from "@tanstack/react-router";
import auraIcon from "@/assets/aura-icon.png";
import { useLang, L } from "@/lib/i18n";

export function SiteHeader() {
  const [lang, setLang] = useLang();
  const x = L[lang];
  return (
    <header className="flex items-center justify-between mb-12">
      <Link to="/" className="flex items-center gap-3">
        <img src={auraIcon} alt="Aura" width={32} height={32} className="rounded-lg" />
        <span className="font-semibold">Aura</span>
      </Link>
      <nav className="hidden sm:flex items-center gap-5 text-sm text-muted-foreground">
        <Link to="/download" className="hover:text-foreground transition">{x.nav_download}</Link>
        <Link to="/dashboard" className="hover:text-foreground transition">{x.nav_dashboard}</Link>
        <Link to="/changelog" className="hover:text-foreground transition">{x.nav_changelog}</Link>
      </nav>
      <div className="flex gap-1 rounded-md border border-border bg-card p-0.5 text-xs">
        {(["en", "pt", "es"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-2 py-1 rounded transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}

export function SiteFooter() {
  const [lang] = useLang();
  const x = L[lang];
  return (
    <footer className="mt-24 mb-6 text-center text-xs text-muted-foreground space-y-2">
      <p>
        {x.made_by}{" "}
        <a href="https://srzking.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          SrKing
        </a>
      </p>
      <p>{x.footer_disc}</p>
    </footer>
  );
}
