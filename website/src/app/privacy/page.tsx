import { siteConfig } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — MesPensees",
  description:
    "Politique de confidentialité de MesPensees : application locale, sans serveur, sans compte et avec données chiffrées sur l'appareil.",
};

const permissions = [
  "Caméra : utilisée pour les fonctions liées aux photos et, selon les réglages de l'app, aux mécanismes de sécurité comme l'intrusion.",
  "Micro : utilisé pour l'audio ou la dictée lorsque l'appareil et l'utilisateur l'autorisent.",
  "Stockage local : utilisé pour conserver les notes, images, audios, réglages et données chiffrées sur l'appareil.",
  "Notifications : utilisées pour envoyer des rappels génériques, sans afficher de contenu sensible.",
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg px-5 py-12 text-text sm:py-16 md:px-8">
      <article className="mx-auto max-w-3xl break-words">
        <Link href="/" className="text-sm text-rose transition-colors hover:text-rose-dark">
          ← Retour au site
        </Link>

        <p className="mt-10 text-xs uppercase tracking-[0.18em] text-text3 sm:text-sm sm:tracking-[0.2em]">
          MesPensees
        </p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-text3">Dernière mise à jour : juin 2026</p>

        <section className="mt-10 space-y-5 leading-relaxed text-text2">
          <p>
            MesPensees est conçue comme une application 100 % locale. Elle ne
            nécessite pas de compte, ne communique pas avec un serveur MesPensees
            et ne synchronise pas vos données personnelles dans le cloud.
          </p>
          <p>
            Vos notes, images, audios, statistiques personnelles et réglages
            restent sur votre appareil. Les données sensibles sont stockées
            localement et chiffrées. L’accès peut être protégé par PIN et, si
            votre appareil le permet, par biométrie.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-text">Données traitées</h2>
          <p className="mt-4 leading-relaxed text-text2">
            L’application traite uniquement les contenus que vous créez ou
            configurez dans MesPensees : textes, médias ajoutés, audios,
            préférences, rappels, capsules temporelles et paramètres de sécurité.
            Ces éléments ne sont pas envoyés à Crédo Adjignon ni à un serveur
            MesPensees.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-text">Permissions</h2>
          <ul className="mt-4 space-y-3 text-text2">
            {permissions.map((item) => (
              <li key={item} className="rounded-2xl border border-border bg-bg2 p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-text">Notifications et widgets</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Les notifications sont génériques et pensées pour éviter d’exposer le
            contenu de vos pensées. Les widgets privilégient également les actions
            rapides ou aperçus non sensibles afin de limiter les risques sur un
            écran d’accueil visible par d’autres personnes.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-text">Suppression des données</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Vous pouvez supprimer vos contenus depuis l’application ou réinitialiser
            localement les données selon les options disponibles sur votre appareil.
            La désinstallation de l’application supprime généralement ses données
            locales, selon le comportement d’Android et les sauvegardes activées
            par l’utilisateur.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-text">Contact</h2>
          <p className="mt-4 leading-relaxed text-text2">
            Pour toute question liée à la confidentialité, contactez{" "}
            <a className="text-rose hover:text-rose-dark" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
