"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/data/site";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { id: "hero", labelKey: "home" as const },
  { id: "mespensees", labelKey: "mespensees" as const },
  { id: "screenshots", labelKey: "screenshots" as const },
  { id: "about", labelKey: "about" as const },
  { id: "contact", labelKey: "contact" as const },
] as const;

export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const nav = t("nav");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-bg/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-8 lg:px-10">
        <a
          href="#hero"
          className="shrink-0 font-display text-lg italic text-text transition-colors hover:text-rose"
          onClick={() => setMenuOpen(false)}
        >
          {siteConfig.name}
        </a>

        <nav className="hidden items-center gap-5 lg:gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm text-text2 transition-colors hover:text-text"
            >
              {nav[item.labelKey]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <button
            type="button"
            onClick={() => setLocale("fr")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              locale === "fr"
                ? "bg-rose/15 text-rose"
                : "text-text3 hover:text-text2"
            }`}
            aria-label="Français"
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              locale === "en"
                ? "bg-teal/15 text-teal"
                : "text-text3 hover:text-text2"
            }`}
            aria-label="English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg2/80 text-text2 transition-colors hover:text-text md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <motion.nav
        id="mobile-navigation"
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-white/5 bg-bg/95 backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-3 md:px-8 lg:px-10">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-text2 transition-colors hover:bg-bg2 hover:text-text"
            >
              {nav[item.labelKey]}
            </a>
          ))}
        </div>
      </motion.nav>
    </motion.header>
  );
}
