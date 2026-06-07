import { siteConfig } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — MesPensees",
  description:
    "Mentions légales du site vitrine MesPensees édité par Crédo Adjignon.",
};

export default function LegalPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg px-5 py-12 text-text sm:py-16 md:px-8">
      <article className="mx-auto max-w-3xl break-words">
        <Link href="/" className="text-sm text-rose transition-colors hover:text-rose-dark">
          ← Retour au site
        </Link>

        <p className="mt-10 text-xs uppercase tracking-[0.18em] text-text3 sm:text-sm sm:tracking-[0.2em]">
          MesPensees
        </p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">Mentions légales</h1>
        <p className="mt-4 text-sm text-text3">Dernière mise à jour : juin 2026</p>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Éditeur</h2>
          <div className="mt-4 space-y-2 text-text2">
            <p>Nom : ADJIGNON Kokou Crédo Gérald</p>
            <p>Nom courant : Crédo Adjignon</p>
            <p>Localisation : {siteConfig.location}</p>
            <p>
              Email :{" "}
              <a className="text-rose hover:text-rose-dark" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
            <p>
              Téléphone :{" "}
              <a className="text-rose hover:text-rose-dark" href={`tel:${siteConfig.phone}`}>
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Objet du site</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Ce site présente MesPensees, une application Android de journal intime
            local et chiffré. Il sert de vitrine, de point d’information, de lien
            de téléchargement temporaire APK et de contact avec l’éditeur.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Hébergement</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Hébergeur : Vercel Inc. ou hébergeur à compléter après mise en ligne.
            L’URL de production sera renseignée lorsque le déploiement final sera
            validé.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Propriété intellectuelle</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Les textes, visuels, éléments d’interface, noms, contenus et
            présentations liés à MesPensees appartiennent à leur éditeur, sauf
            mention contraire. Toute reproduction ou réutilisation non autorisée
            est interdite.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Responsabilité</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Les informations du site sont fournies à titre indicatif et peuvent
            évoluer. L’éditeur ne peut pas garantir l’absence d’erreur, ni être
            tenu responsable d’un usage inadapté de l’application, d’une perte de
            données liée à l’appareil ou d’une mauvaise conservation du PIN par
            l’utilisateur.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium">Données et analytics</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Ce site n’ajoute pas d’analytics et ne collecte pas activement de
            données personnelles. Si un outil de mesure d’audience est ajouté plus
            tard, la politique de confidentialité sera mise à jour.
          </p>
        </section>
      </article>
    </main>
  );
}
