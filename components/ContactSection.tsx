"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(813) 555-0199",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@builtbycapstone.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Tampa, Florida",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@builtbycapstone",
  },
];

const projectTypes = ["Custom Home", "Renovation", "Not Sure Yet"];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    name.trim().length > 0 &&
    isValidEmail &&
    phoneDigits.length === 10 &&
    message.trim().length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      projectType,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Still show success to the user — we don't want to expose internal errors
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <SectionWrapper id="contact">
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent-gold">
            Get in Touch
          </p>
          <h2 className="mb-6 font-heading text-3xl font-light leading-tight text-text-primary md:text-5xl">
            Start Your Project Today
          </h2>
          <p className="mb-10 max-w-md font-body text-base font-light leading-relaxed text-text-secondary">
            Ready to bring your vision to life? Reach out and let&apos;s discuss your project. We&apos;ll provide a free consultation and detailed estimate.
          </p>

          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-accent-gold" strokeWidth={1.5} />
                <div>
                  <span className="font-body text-sm text-text-primary">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex h-full min-h-[400px] items-center justify-center text-center"
            >
              <div>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
                  <svg className="h-8 w-8 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-2xl font-light text-text-primary">Thank You</h3>
                <p className="font-body text-sm font-light text-text-secondary">
                  We&apos;ve received your message and will be in touch within 24 hours.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-border-light bg-transparent pb-2 font-body text-sm text-text-primary outline-none transition-colors placeholder:text-text-light/50 focus:border-accent-gold"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full border-b border-border-light bg-transparent pb-2 font-body text-sm text-text-primary outline-none transition-colors placeholder:text-text-light/50 focus:border-accent-gold"
                    placeholder="(813) 555-0199"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-border-light bg-transparent pb-2 font-body text-sm text-text-primary outline-none transition-colors placeholder:text-text-light/50 focus:border-accent-gold"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
                  Project Type
                </span>
                <div className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-3 min-[520px]:gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={`min-h-[44px] px-5 py-2.5 font-body text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
                        projectType === type
                          ? "border border-accent-gold bg-accent-gold/[0.08] text-accent-gold"
                          : "border border-accent-taupe/30 bg-transparent text-text-secondary hover:border-accent-taupe/60 hover:bg-accent-taupe/[0.04]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="projectType" value={projectType} />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-light">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none border-b border-border-light bg-transparent pb-2 font-body text-sm text-text-primary outline-none transition-colors placeholder:text-text-light/50 focus:border-accent-gold"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="w-full bg-[#B8A99A] py-3.5 font-body text-xs font-medium uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-px hover:bg-[#A08474] hover:shadow-[0_4px_20px_rgba(184,151,126,0.3)] active:translate-y-0 active:bg-[#8F7565] disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
