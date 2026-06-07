"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { mespenseesData } from "@/data/mespensees";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { PointerEvent } from "react";

export function ScreenshotCarousel() {
  const { locale } = useLanguage();
  const screenshots = mespenseesData.screenshots;
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    });
  }

  return (
    <div
      className="relative space-y-12 overflow-hidden md:space-y-10"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-rose/40 via-border to-teal/40 md:block" />

      {screenshots.map((shot, index) => {
        const left = index % 2 === 0;
        const x = pointer.x * (left ? 14 : -14);
        const y = pointer.y * 10;

        return (
          <motion.article
            key={shot.id}
            initial={{ opacity: 0, y: 46, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`relative grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-5 ${
              left ? "" : "md:[&>div:first-child]:col-start-3"
            }`}
          >
            <motion.div
              style={{ x, y, rotate: left ? pointer.x * 2 : pointer.x * -2 }}
              className={`relative z-10 mx-auto overflow-hidden rounded-[1.5rem] border border-border bg-bg3 shadow-2xl shadow-black/40 sm:rounded-[2rem] md:mx-0 ${
                left ? "md:justify-self-end" : "md:justify-self-start"
              }`}
            >
              <div className="relative aspect-[9/16] w-[min(76vw,260px)] sm:w-[300px]">
                <Image
                  src={shot.image}
                  alt={shot.label[locale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 76vw, 300px"
                />
              </div>
            </motion.div>

            <div className="relative z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-rose/30 bg-bg2 text-rose md:flex">
              {index + 1}
            </div>

            <motion.div
              initial={{ opacity: 0, x: left ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className={`rounded-2xl border border-border bg-bg2/70 p-5 text-left ${
                left ? "md:text-left" : "md:col-start-1 md:row-start-1 md:text-right"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-text3">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-2 text-xl font-medium text-text">
                {shot.label[locale]}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-text2">
                {shot.description[locale]}
              </p>
              {index < screenshots.length - 1 && (
                <span className="mt-4 inline-flex text-rose" aria-hidden>
                  {left ? "↓ ↘" : "↙ ↓"}
                </span>
              )}
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
