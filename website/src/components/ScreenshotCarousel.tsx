"use client";

/* eslint-disable @next/next/no-img-element */
import { useLanguage } from "@/contexts/LanguageContext";
import { mespenseesData } from "@/data/mespensees";
import { motion } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";

export function ScreenshotCarousel() {
  const { locale } = useLanguage();
  const screenshots = mespenseesData.screenshots;
  const stepLabel = locale === "fr" ? "Etape" : "Step";
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
      className="relative mx-auto max-w-5xl space-y-10 overflow-hidden md:space-y-12"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-gradient-to-b from-rose/40 via-border to-teal/40 md:block" />

      {screenshots.map((shot, index) => {
        const left = index % 2 === 0;
        const x = pointer.x * (left ? 10 : -10);
        const y = pointer.y * 8;

        return (
          <motion.article
            key={shot.id}
            initial={{ opacity: 0, y: 46, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:gap-6"
          >
            <motion.div
              style={{ x, y, rotate: left ? pointer.x * 2 : pointer.x * -2 }}
              className={`relative z-10 mx-auto overflow-hidden rounded-[1.75rem] border border-border bg-bg3 shadow-2xl shadow-black/40 sm:rounded-[2rem] md:mx-0 ${
                left
                  ? "md:col-start-1 md:justify-self-end"
                  : "md:col-start-3 md:justify-self-start"
              }`}
            >
              <div className="relative aspect-[486/1024] w-[min(82vw,300px)] sm:w-[320px] lg:w-[340px]">
                <img
                  src={shot.image}
                  alt={shot.label[locale]}
                  width={486}
                  height={1024}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <div className="relative z-20 hidden h-12 w-12 items-center justify-center justify-self-center rounded-full border border-rose/30 bg-bg2 text-sm font-medium text-rose shadow-lg shadow-black/30 md:col-start-2 md:row-start-1 md:flex">
              {String(index + 1).padStart(2, "0")}
            </div>

            <motion.div
              initial={{ opacity: 0, x: left ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className={`rounded-2xl border border-border bg-bg2/75 p-5 text-left shadow-xl shadow-black/20 backdrop-blur sm:p-6 ${
                left
                  ? "md:col-start-3 md:row-start-1 md:text-left"
                  : "md:col-start-1 md:row-start-1 md:text-right"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-text3">
                {stepLabel} {String(index + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-2 text-xl font-medium text-text">
                {shot.label[locale]}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-text2">
                {shot.description[locale]}
              </p>
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
