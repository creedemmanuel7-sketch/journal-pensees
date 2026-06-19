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
  const stepLabel = locale === "fr" ? "Étape" : "Step";
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
      className="relative w-full max-w-full space-y-16 md:space-y-20 lg:space-y-24"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      {screenshots.map((shot, index) => {
        const left = index % 2 === 0;
        const parallaxX = pointer.x * (left ? 14 : -14);
        const parallaxY = pointer.y * 10;

        return (
          <motion.article
            key={shot.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex w-full max-w-full flex-col items-stretch gap-6 md:gap-10 lg:gap-14 ${
              left ? "md:flex-row md:items-center" : "md:flex-row-reverse md:items-center"
            }`}
          >
            {/* Connecteur horizontal desktop */}
            <div
              aria-hidden
              className={`pointer-events-none absolute top-1/2 hidden h-px w-[calc(50%-11rem)] bg-gradient-to-r md:block lg:w-[calc(50%-13rem)] ${
                left
                  ? "left-[calc(50%+11rem)] from-rose/50 to-teal/30 lg:left-[calc(50%+13rem)]"
                  : "right-[calc(50%+11rem)] from-teal/30 to-rose/50 lg:right-[calc(50%+13rem)]"
              }`}
            />

            {/* Capture */}
            <motion.div
              style={{
                x: parallaxX,
                y: parallaxY,
                rotate: left ? pointer.x * 2.5 : pointer.x * -2.5,
              }}
              className="relative z-10 mx-auto w-full shrink-0 md:mx-0 md:w-[46%] lg:w-[44%]"
            >
              <div className="mx-auto overflow-hidden rounded-[1.75rem] border border-border bg-bg3 shadow-2xl shadow-black/50 sm:rounded-[2rem] md:max-w-none">
                <div className="relative mx-auto aspect-[486/1024] w-full max-w-[min(100%,320px)] sm:max-w-[340px] md:max-w-none md:w-full lg:max-w-[400px]">
                  <img
                    src={shot.image}
                    alt={shot.label[locale]}
                    width={486}
                    height={1024}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-center md:hidden">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose/30 bg-bg2 text-sm font-medium text-rose">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>

            {/* Numéro central desktop */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rose/30 bg-bg2 text-sm font-medium text-rose shadow-lg shadow-black/40 md:flex"
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Texte */}
            <motion.div
              initial={{ opacity: 0, x: left ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className={`min-w-0 flex-1 rounded-2xl border border-border bg-bg2/75 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-7 ${
                left ? "md:text-left" : "md:text-right"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-text3">
                {stepLabel} {String(index + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-2 text-xl font-medium text-text sm:text-2xl">
                {shot.label[locale]}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-text2 sm:text-base">
                {shot.description[locale]}
              </p>
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
