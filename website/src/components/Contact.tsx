"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/data/site";

const socials = [
  { name: "Portfolio", href: siteConfig.portfolio },
  { name: "LinkedIn", href: siteConfig.linkedin },
  { name: "GitHub", href: siteConfig.github },
  { name: "MesPensees", href: siteConfig.mespenseesGithub },
] as const;

export function Contact() {
  const { locale, setLocale, t } = useLanguage();
  const section = t("contact");
  const footer = t("footer");

  return (
    <AnimatedSection
      id="contact"
      className="relative border-t border-white/5 py-20 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <h2 className="font-display text-4xl italic leading-tight text-text md:text-5xl">
          {section.title}
        </h2>
        <p className="mt-3 text-text2">{section.subtitle}</p>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-8">
          <div className="rounded-2xl border border-border bg-bg2/50 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-widest text-text3">
              {section.email}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 block break-all text-base text-rose transition-colors hover:text-rose-dark sm:text-lg"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-bg2/50 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-widest text-text3">
              {section.phone}
            </p>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="mt-3 block text-lg text-teal transition-colors hover:text-text"
            >
              {siteConfig.phone}
            </a>
            <p className="mt-4 text-sm text-text2">{section.location}</p>
            <p className="mt-1 text-text">{siteConfig.location}</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg2/50 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-widest text-text3">
              {section.social}
            </p>
            <ul className="mt-4 space-y-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text2 transition-colors hover:text-teal"
                  >
                    {social.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-sm text-text3 md:mt-20 md:flex-row md:text-left">
          <p className="max-w-full">
            © {new Date().getFullYear()} {siteConfig.creatorShortName}. {footer.rights}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="/privacy" className="transition-colors hover:text-text2">
              {footer.privacy}
            </a>
            <a href="/legal" className="transition-colors hover:text-text2">
              {footer.legal}
            </a>
            <button
              type="button"
              onClick={() => setLocale("fr")}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                locale === "fr" ? "bg-rose/15 text-rose" : "text-text3 hover:text-text2"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                locale === "en" ? "bg-teal/15 text-teal" : "text-text3 hover:text-text2"
              }`}
            >
              EN
            </button>
          </div>
          <p className="max-w-full">{footer.madeWith}</p>
        </footer>
      </div>
    </AnimatedSection>
  );
}
