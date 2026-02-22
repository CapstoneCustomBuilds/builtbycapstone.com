"use client";

import { Instagram, Facebook, Mail } from "lucide-react";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/builtbycapstone", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/builtbycapstone", label: "Facebook" },
  { icon: Mail, href: "mailto:info@builtbycapstone.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-dark px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <a href="#" className="font-heading text-xl font-light tracking-[0.3em] text-white">
            CAPSTONE
            <span className="inline-block -translate-y-[0.65em] md:-translate-y-[0.4em] text-[0.35em] md:text-[0.45em] leading-none text-accent-gold">&#9670;</span>
          </a>

          {/* Links */}
          <div className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-white/40 transition-colors hover:text-white"
              >
                <social.icon className="h-5 w-5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Copyright */}
        <p className="text-center font-body text-xs text-white/30">
          &copy; {new Date().getFullYear()} Capstone Custom Builds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
