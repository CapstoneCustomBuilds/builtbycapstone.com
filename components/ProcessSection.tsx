"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start with a conversation — understanding your vision, lifestyle, budget, and timeline before anything is drawn or built.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Our design-forward team creates plans that balance aesthetics and function, working through every detail until it feels right.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "With clear plans in hand, our crews execute with precision. You'll have direct access to leadership throughout construction.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "A meticulous walkthrough ensures every finish meets our standards — and yours. We don't hand over keys until it's perfect.",
  },
];

export default function ProcessSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="process">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-16 max-w-2xl"
      >
        <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent-gold">
          Our Process
        </p>
        <h2 className="font-heading text-3xl font-light leading-tight text-text-primary md:text-5xl">
          From First Call to Final Walkthrough
        </h2>
      </motion.div>

      <div ref={sectionRef} className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-border-light md:left-8 md:block">
          <div
            ref={lineRef}
            className="h-full w-full origin-top bg-accent-gold"
          />
        </div>

        {/* Steps */}
        <div className="space-y-16 md:space-y-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="md:pl-20"
            >
              <span className="font-heading text-5xl font-light text-accent-taupe/40 md:text-6xl">
                {step.number}
              </span>
              <h3 className="mt-2 font-body text-lg font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 max-w-lg font-body text-sm font-light leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
