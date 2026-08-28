import { ChangelogView } from "@/components/ChangelogView";
import { siteConfig } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouveautés — MesPensees",
  description:
    "Journal des versions de MesPensees (SemVer) : ce qui a été ajouté, corrigé ou sécurisé à chaque publication.",
  alternates: { canonical: `${siteConfig.url}/changelog` },
};

export default function ChangelogPage() {
  return <ChangelogView />;
}
