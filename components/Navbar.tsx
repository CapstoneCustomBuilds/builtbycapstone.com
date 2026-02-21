"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <a
            href="#"
            className={`font-heading text-xl font-light tracking-[0.3em] transition-all duration-500 ${
              mobileOpen ? "opacity-0" :
              scrolled ? "text-text-primary" : "text-white"
            }`}
          >
            CAPSTONE
            <span className="inline-block -translate-y-[0.4em] text-[0.45em] leading-none text-accent-gold">&#9670;</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-body text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-500 ${
                  scrolled
                    ? "text-text-secondary hover:text-text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`font-body rounded-none border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-500 ${
                scrolled
                  ? "border-accent-gold text-text-primary hover:bg-accent-gold hover:text-white"
                  : "border-white/40 text-white hover:border-white hover:bg-white hover:text-text-primary"
              }`}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-[60] flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-6 transition-all duration-300 ${
                mobileOpen ? "translate-y-[7px] rotate-45 bg-text-primary" :
                scrolled ? "bg-text-primary" : "bg-white"
              }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${
                mobileOpen ? "opacity-0" :
                scrolled ? "bg-text-primary" : "bg-white"
              }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45 bg-text-primary" :
                scrolled ? "bg-text-primary" : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col items-center justify-center bg-bg-primary md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="font-heading text-3xl font-light tracking-[0.15em] text-text-primary"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 border border-accent-gold px-8 py-3 font-body text-xs font-medium uppercase tracking-[0.15em] text-text-primary transition-colors hover:bg-accent-gold hover:text-white"
              >
                Get in Touch
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
