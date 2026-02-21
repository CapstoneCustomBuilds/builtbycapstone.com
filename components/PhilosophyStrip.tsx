"use client";

import { motion } from "framer-motion";

export default function PhilosophyStrip() {
  return (
    <section className="bg-bg-primary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-heading text-2xl font-light italic leading-relaxed text-text-secondary md:text-3xl lg:text-4xl"
        >
          &ldquo;Where vision meets craftsmanship.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
