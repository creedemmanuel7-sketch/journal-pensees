"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/data/site";
import { motion } from "framer-motion";

const links = [
  { key: "portfolio" as const, href: siteConfig.portfolio },
  { key: "linkedin" as const, href: siteConfig.linkedin },
  { key: "github" as const, href: siteConfig.github },
] as const;

export function AboutCreator() {
  const { t } = useLanguage();
  const section = t("about");

  return (
    <AnimatedSection
      id="about"
      className="relative border-t border-white/5 py-20 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border bg-bg2/60 p-6 sm:p-8"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rose/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-teal/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.18em] text-text3 sm:text-sm sm:tracking-[0.2em]">
                {siteConfig.location}
              </p>
              <h2 className="mt-4 font-display text-4xl italic leading-tight text-text md:text-5xl">
                {section.title}
              </h2>
              <p className="mt-3 text-rose">{section.subtitle}</p>
            </div>
          </motion.div>

          <div>
            <p className="text-base leading-relaxed text-text2">{section.body}</p>
            <p className="mt-5 text-base leading-relaxed text-text2">
              {section.extra}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {links.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full justify-center rounded-full border border-border bg-bg2 px-5 py-3 text-sm text-text2 transition-colors hover:border-rose/40 hover:text-text sm:w-auto"
                >
                  {section[link.key]} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
