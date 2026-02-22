"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";

const values = [
  {
    title: "Transparent Pricing",
    description:
      "No hidden costs, no surprises. You see every line item before we break ground, and we keep you informed at every stage.",
  },
  {
    title: "Design-Forward Approach",
    description:
      "We don't just build — we create. Every project starts with a design vision that pushes boundaries while honoring your taste.",
  },
  {
    title: "Hands-On Leadership",
    description:
      "Our principals are on-site, not behind a desk. You work directly with decision-makers from first meeting to final walkthrough.",
  },
];

export default function AboutSection() {
  return (
    <SectionWrapper id="about" bg="secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-16 max-w-2xl"
      >
        <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent-gold">
          About Capstone
        </p>
        <h2 className="font-heading text-3xl font-light leading-tight text-text-primary md:text-5xl">
          Built Different from Day One
        </h2>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3 md:gap-0">
        {values.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`px-0 py-6 md:px-8 md:py-0 ${
              i > 0 ? "border-t border-border-light md:border-t-0 md:border-l" : ""
            } ${i === 0 ? "md:pl-0" : ""}`}
          >
            <h3 className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-text-primary">
              {value.title}
            </h3>
            <p className="font-body text-sm font-light leading-relaxed text-text-secondary">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
