"use client";

import { Contact } from "@/components/Contact";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MesPensees } from "@/components/MesPensees";
import { AboutCreator } from "@/components/AboutCreator";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MesPensees />
        <AboutCreator />
        <Contact />
      </main>
    </>
  );
}
