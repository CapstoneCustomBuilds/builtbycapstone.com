"use client";

import { motion } from "framer-motion";

const items = [
  "Licensed & Insured",
  "Serving the Tampa Bay Area",
  "Locally Owned & Operated",
  "Residential & Commercial",
];

export default function TrustStrip() {
  return (
    <section className="bg-bg-secondary px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center"
      >
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-6">
            {i > 0 && (
              <span className="hidden text-[8px] text-accent-gold/40 md:inline">&#9670;</span>
            )}
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
              {item}
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
