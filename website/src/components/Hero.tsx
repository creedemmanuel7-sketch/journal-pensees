"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/data/site";
import { motion } from "framer-motion";
import { useState } from "react";
import { HeroSceneWrapper } from "./HeroSceneWrapper";
import { SupportModal } from "./SupportModal";

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.linkedin },
  { label: "GitHub", href: siteConfig.github },
] as const;

export function Hero() {
  const { t } = useLanguage();
  const hero = t("hero");
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 sm:pt-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-rose/5 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-teal/5 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:py-16 md:grid-cols-2 md:items-center md:gap-12 md:px-8 lg:px-10">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-xs uppercase tracking-[0.18em] text-text3 sm:text-sm sm:tracking-[0.2em]"
          >
            {hero.greeting}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-[clamp(3rem,17vw,4.5rem)] italic leading-[0.95] text-text md:text-6xl lg:text-7xl"
          >
            {siteConfig.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-2 text-sm text-text3"
          >
            {hero.by} {siteConfig.creatorShortName}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-lg text-rose md:text-xl"
          >
            {hero.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-text2"
          >
            {hero.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <a
              href="#mespensees"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-rose-dark sm:w-auto"
            >
              {hero.cta}
            </a>
            <a
              href={siteConfig.apkPath}
              download
              className="inline-flex w-full items-center justify-center rounded-full border border-teal/40 bg-teal/10 px-6 py-3 text-sm font-medium text-teal transition-colors hover:bg-teal/20 sm:w-auto"
            >
              {hero.download}
            </a>
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="inline-flex w-full items-center justify-center rounded-full border border-rose/30 px-6 py-3 text-sm font-medium text-rose transition-colors hover:bg-rose/10 sm:w-auto"
            >
              {hero.support}
            </button>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center rounded-full border border-border px-5 py-3 text-sm text-text2 transition-colors hover:border-rose/40 hover:text-text sm:w-auto"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative z-10 hidden h-[280px] overflow-hidden rounded-[2rem] sm:block md:h-[420px]"
        >
          <HeroSceneWrapper />
        </motion.div>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />

      <motion.a
        href="#mespensees"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-text3 transition-colors hover:text-text2 sm:flex"
        aria-label={hero.scroll}
      >
        <span>{hero.scroll}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="block h-8 w-px bg-gradient-to-b from-rose/60 to-transparent"
        />
      </motion.a>
    </section>
  );
}
