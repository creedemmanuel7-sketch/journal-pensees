import { siteConfig } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d’utilisation — MesPensees",
  description:
    "Conditions d’utilisation de MesPensees : journal local, responsabilité du PIN, pas de copie cloud chez l’éditeur.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg px-5 py-12 text-text sm:py-16 md:px-8">
      <article className="mx-auto max-w-3xl break-words">
        <Link href="/" className="text-sm text-rose transition-colors hover:text-rose-dark">
          ← Retour au site
        </Link>
        <p className="mt-10 text-xs uppercase tracking-[0.18em] text-text3">MesPensees</p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">
          Conditions d’utilisation
        </h1>
        <p className="mt-4 text-sm text-text3">Dernière mise à jour : 28 août 2026</p>

        <section className="mt-10 space-y-4 leading-relaxed text-text2">
          <h2 className="text-2xl font-medium text-text">Objet</h2>
          <p>
            MesPensees est un journal intime personnel, fourni en l’état, sans
            compte ni abonnement obligatoire. Éditeur : ADJIGNON Kokou Crédo
            Gérald (Crédo), {siteConfig.location}.
          </p>
        </section>
        <section className="mt-10 space-y-4 leading-relaxed text-text2">
          <h2 className="text-2xl font-medium text-text">Usage et PIN</h2>
          <p>
            Vous êtes responsable de votre PIN, de vos mots-clés de récupération
            et de la sécurité de votre téléphone. L’éditeur ne peut pas restituer
            vos notes si l’appareil est perdu, réinitialisé, ou si ces secrets
            sont oubliés. Il n’existe pas de copie serveur chez MesPensees.
          </p>
        </section>
        <section className="mt-10 space-y-4 leading-relaxed text-text2">
          <h2 className="text-2xl font-medium text-text">Chiffrement</h2>
          <p>
            Les notes sont chiffrées localement (AES, dérivation PBKDF2). Ce
            n’est pas une certification « militaire » ni une garantie contre un
            attaquant qui disposerait déjà du téléphone déverrouillé.
          </p>
        </section>
        <section className="mt-10 space-y-4 leading-relaxed text-text2">
          <h2 className="text-2xl font-medium text-text">Contact</h2>
          <p>
            <a className="text-rose hover:text-rose-dark" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            . Voir aussi la{" "}
            <Link href="/privacy" className="text-rose hover:text-rose-dark">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
