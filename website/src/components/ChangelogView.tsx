"use client";

import { KIND_LABEL, releases, versioningScheme } from "@/data/changelog";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const kindClass: Record<string, string> = {
  added: "border-teal/40 bg-teal/10 text-teal",
  changed: "border-rose/30 bg-rose/10 text-rose",
  fixed: "border-border bg-bg3 text-text2",
  security: "border-teal/50 bg-teal/15 text-teal",
  removed: "border-border bg-bg4 text-text3",
};

export function ChangelogView() {
  const { locale } = useLanguage();
  const copy =
    locale === "fr"
      ? {
          back: "← Retour au site",
          kicker: "Versions",
          title: "Nouveautés",
          lead: "Comme Linear, Vercel ou GitHub : une page publique, versions lisibles, plus récent en haut. On suit Semantic Versioning (MAJEUR.MINEUR.CORRECTIF) et Keep a Changelog.",
          semver: "MAJEUR = rupture · MINEUR = nouveauté compatible · CORRECTIF = bug / sécurité",
          unreleased: "À venir",
          released: "Publié",
          empty: "Pas encore de date de publication.",
        }
      : {
          back: "← Back to site",
          kicker: "Releases",
          title: "What’s new",
          lead: "Same idea as Linear, Vercel or GitHub: a public page, readable versions, newest first. We follow Semantic Versioning (MAJOR.MINOR.PATCH) and Keep a Changelog.",
          semver: "MAJOR = breaking · MINOR = compatible feature · PATCH = bug / security",
          unreleased: "Upcoming",
          released: "Released",
          empty: "No release date yet.",
        };

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg px-5 py-12 text-text sm:py-16 md:px-8">
      <article className="mx-auto w-full max-w-3xl break-words">
        <Link
          href="/"
          className="text-sm text-rose transition-colors hover:text-rose-dark"
        >
          {copy.back}
        </Link>

        <p className="mt-10 text-xs uppercase tracking-[0.18em] text-text3">
          {copy.kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-text2">{copy.lead}</p>
        <p className="mt-3 text-sm text-text3">{copy.semver}</p>
        <p className="mt-2 text-xs text-text3">
          <a
            className="text-rose hover:text-rose-dark"
            href={versioningScheme.spec}
            target="_blank"
            rel="noopener noreferrer"
          >
            semver.org
          </a>
          {" · "}
          <a
            className="text-rose hover:text-rose-dark"
            href={versioningScheme.changelogSpec}
            target="_blank"
            rel="noopener noreferrer"
          >
            keepachangelog.com
          </a>
        </p>

        <ol className="mt-14 space-y-14">
          {releases.map((release) => (
            <li
              key={release.version}
              id={`v${release.version.replace(/\./g, "-")}`}
              className="scroll-mt-28"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-display text-3xl italic text-text">
                  {release.version}
                </h2>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs uppercase tracking-wider ${
                    release.status === "unreleased"
                      ? "border-rose/30 text-rose"
                      : "border-teal/30 text-teal"
                  }`}
                >
                  {release.status === "unreleased"
                    ? copy.unreleased
                    : copy.released}
                </span>
                <time className="text-sm text-text3">
                  {release.date || copy.empty}
                </time>
              </div>
              <h3 className="mt-3 text-lg text-rose">
                {release.title[locale]}
              </h3>
              <p className="mt-2 leading-relaxed text-text2">
                {release.summary[locale]}
              </p>
              <ul className="mt-6 space-y-3">
                {release.items.map((item) => (
                  <li
                    key={item.text.fr}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-bg2/50 p-4 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <span
                      className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${kindClass[item.kind]}`}
                    >
                      {KIND_LABEL[item.kind][locale]}
                    </span>
                    <p className="text-sm leading-relaxed text-text2 sm:text-base">
                      {item.text[locale]}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-16 text-sm text-text3">
          {locale === "fr"
            ? "Fichier source du projet : CHANGELOG.md à la racine du dépôt."
            : "Source of truth in the repo: CHANGELOG.md at the project root."}{" "}
          <a
            className="text-rose hover:text-rose-dark"
            href={`${siteConfig.mespenseesGithub}/blob/main/CHANGELOG.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </article>
    </main>
  );
}
