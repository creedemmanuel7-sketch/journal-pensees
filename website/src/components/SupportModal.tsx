"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/data/site";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type SupportModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SupportModal({ open, onClose }: SupportModalProps) {
  const { t } = useLanguage();
  const support = t("support");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  async function copyNumber() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(siteConfig.phone);
      setCopied(true);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[calc(100svh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-bg2 p-5 shadow-2xl shadow-black/50 sm:p-6 md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-rose/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-teal/10 blur-3xl" />

            <div className="relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-0 top-0 rounded-full border border-border px-3 py-1 text-xs text-text3 transition-colors hover:text-text"
              >
                {support.close}
              </button>

              <p className="pr-24 text-xs uppercase tracking-[0.18em] text-text3 sm:text-sm sm:tracking-[0.2em]">
                Moov Money
              </p>
              <h2
                id="support-title"
                className="mt-3 font-display text-3xl italic leading-tight text-text sm:text-4xl"
              >
                {support.title}
              </h2>
              <p className="mt-2 text-rose">{support.subtitle}</p>
              <p className="mt-5 text-sm leading-relaxed text-text2">
                {support.body}
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-bg/70 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-widest text-text3">
                  {support.numberLabel}
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="break-all font-mono text-lg text-text sm:text-xl">
                    {siteConfig.phone}
                  </span>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="rounded-full bg-rose px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
                  >
                    {copied ? support.copied : support.copy}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex aspect-square max-h-36 items-center justify-center rounded-2xl border border-dashed border-border bg-bg/50 text-center text-xs uppercase tracking-widest text-text3">
                {support.qr}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
