"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Toggle this to compare hero with/without background image
const SHOW_IMAGE = true;

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {SHOW_IMAGE ? (
        <>
          {/* Background image with Ken Burns */}
          <div className="absolute inset-0 animate-kenburns">
            <Image
              src="/images/hero-exterior.jpg"
              alt="Luxury custom home in Tampa Bay at golden hour"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Warm gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,transparent_70%)]" />
        </>
      ) : (
        /* Intentional warm gradient — no image */
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5B9AD] via-[#B8AEA2] to-[#A89E93]" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mb-6 font-body text-[11px] font-medium uppercase tracking-[0.3em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]"
        >
          Tampa Bay&apos;s Premier Custom Builder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="mb-6 font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.1] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]"
        >
          Building What Others
          <br />
          Only Imagine
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="mx-auto mb-10 max-w-xl font-body text-base font-light leading-relaxed text-white/70 md:text-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]"
        >
          Custom homes and renovations crafted with precision in the heart of Tampa Bay.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <a
            href="#about"
            className="editorial-link text-sm font-medium tracking-wide text-white transition-colors hover:text-accent-gold"
          >
            Explore Our Approach
            <svg
              className="ml-2 inline h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          Scroll
        </span>
        <div className="h-[60px] w-px overflow-hidden bg-white/20">
          <div className="animate-scroll-line h-full w-full bg-white/80" />
        </div>
      </div>
    </section>
  );
}
