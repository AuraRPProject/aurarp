import { useEffect, useState } from "react";

export type Lang = "en" | "pt" | "es";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("aura-lang") as Lang | null;
    if (saved && ["en", "pt", "es"].includes(saved)) setLang(saved);
    else {
      const nav = (navigator.language || "en").slice(0, 2) as Lang;
      if (["en", "pt", "es"].includes(nav)) setLang(nav);
    }
  }, []);
  const set = (l: Lang) => { setLang(l); localStorage.setItem("aura-lang", l); window.dispatchEvent(new CustomEvent("aura-lang", { detail: l })); };
  useEffect(() => {
    const h = (e: Event) => setLang((e as CustomEvent).detail as Lang);
    window.addEventListener("aura-lang", h);
    return () => window.removeEventListener("aura-lang", h);
  }, []);
  return [lang, set];
}

export const L = {
  en: {
    nav_home: "Home", nav_download: "Download", nav_dashboard: "Dashboard", nav_changelog: "Changelog",
    installed: "Aura is installed", made_by: "Made by",
    footer_disc: "Not affiliated with Discord. Crafted with ♥.",
    download_zip: "Download aura.zip", download_pc: "Windows / Mac / Linux app",
    pc_soon: "Desktop build coming soon — same source, packaged.",
    pwa_install: "Install on Android/iOS",
  },
  pt: {
    nav_home: "Início", nav_download: "Descarregar", nav_dashboard: "Painel", nav_changelog: "Novidades",
    installed: "Aura está instalado", made_by: "Feito por",
    footer_disc: "Não afiliado com o Discord. Feito com ♥.",
    download_zip: "Descarregar aura.zip", download_pc: "App Windows / Mac / Linux",
    pc_soon: "Versão desktop em breve — mesmo código, empacotado.",
    pwa_install: "Instalar no Android/iOS",
  },
  es: {
    nav_home: "Inicio", nav_download: "Descargar", nav_dashboard: "Panel", nav_changelog: "Novedades",
    installed: "Aura está instalado", made_by: "Hecho por",
    footer_disc: "No afiliado con Discord. Hecho con ♥.",
    download_zip: "Descargar aura.zip", download_pc: "App Windows / Mac / Linux",
    pc_soon: "Versión escritorio próximamente — mismo código, empaquetado.",
    pwa_install: "Instalar en Android/iOS",
  },
} as const;
