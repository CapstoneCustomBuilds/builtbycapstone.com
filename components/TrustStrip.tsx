"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  "Licensed & Insured",
  "Serving Tampa Bay",
  "Locally Owned & Operated",
  "Residential & Commercial",
];

export default function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !hLineRef.current || !vLineRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal line draws first
      gsap.fromTo(
        hLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Vertical line starts 0.3s after horizontal, staggered for "crosshair" feel
      gsap.fromTo(
        vLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-bg-secondary px-6 py-10"
    >
      <div className="relative mx-auto grid max-w-3xl grid-cols-2 grid-rows-2">
        {/* Horizontal cross line */}
        <div
          ref={hLineRef}
          className="absolute left-0 right-0 top-1/2 h-px bg-accent-taupe/25"
          style={{ transformOrigin: "center" }}
        />
        {/* Vertical cross line */}
        <div
          ref={vLineRef}
          className="absolute bottom-0 left-1/2 top-0 w-px bg-accent-taupe/25"
          style={{ transformOrigin: "center" }}
        />

        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
            className="flex items-center justify-center px-5 py-5 text-center md:px-8 md:py-7"
          >
            <span className="font-body text-xs font-normal uppercase tracking-[0.15em] text-text-light">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
