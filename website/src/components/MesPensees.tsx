"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { mespenseesData } from "@/data/mespensees";
import { siteConfig } from "@/data/site";
import { motion } from "framer-motion";

export function MesPensees() {
  const { locale, t } = useLanguage();
  const section = t("mespensees");

  return (
    <AnimatedSection
      id="mespensees"
      className="relative border-t border-white/5 py-20 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-4 py-1.5 text-xs text-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          {section.privacy}
        </div>

        <h2 className="font-display text-4xl italic leading-tight text-text md:text-5xl">
          {section.title}
        </h2>
        <p className="mt-2 text-lg text-rose">{section.subtitle}</p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text2">
          {mespenseesData.pitch[locale]}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {mespenseesData.highlights.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-bg2/60 p-5"
            >
              <h3 className="font-medium text-text">{item.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                {item.description[locale]}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-widest text-text3">
            {section.featuresTitle}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mespenseesData.features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-bg2/60 p-5 transition-colors hover:border-rose/20"
              >
                <span className="text-xl" aria-hidden>
                  {feature.icon}
                </span>
                <h4 className="mt-3 font-medium text-text">
                  {feature.title[locale]}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-text2">
                  {feature.description[locale]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-bg2/40 p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-text3">
            {section.stackTitle}
          </h3>
          <div className="flex flex-wrap gap-2">
            {mespenseesData.stack.map((item) => (
              <span
                key={item.name}
                className="rounded-full border border-border bg-bg3 px-4 py-2 text-sm text-text2"
                title={item.category[locale]}
              >
                {item.name}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteConfig.apkPath}
              download
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-dark sm:w-auto"
            >
              {section.downloadCta}
            </a>
            <a
              href="/privacy"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-6 py-3 text-sm font-medium text-teal transition-colors hover:bg-teal/20 sm:w-auto"
            >
              {section.privacyCta}
            </a>
            <a
              href={siteConfig.mespenseesGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text2 transition-colors hover:border-rose/30 hover:text-text sm:w-auto"
            >
              {section.githubCta} →
            </a>
          </div>
        </div>

        <div id="screenshots" className="mt-20 w-full max-w-full overflow-hidden">
          <h3 className="mb-10 text-sm font-medium uppercase tracking-widest text-text3">
            {section.screenshotsTitle}
          </h3>
          <ScreenshotCarousel />
        </div>
      </div>
    </AnimatedSection>
  );
}
