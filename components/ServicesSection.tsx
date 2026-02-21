"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Custom Homes",
    description:
      "Bespoke residences designed and built to reflect your lifestyle. From modern minimalism to timeless coastal elegance, every detail is intentional.",
    image: "/images/service-custom-homes.jpg",
    alt: "Luxury custom home interior with open floor plan and natural light",
  },
  {
    number: "02",
    title: "Renovations",
    description:
      "Transform your existing space with precision renovations that enhance functionality and elevate aesthetics. Kitchens, bathrooms, whole-home transformations.",
    image: "/images/service-renovations.jpg",
    alt: "Modern kitchen renovation with marble island and pendant lights",
  },
];

function ServiceRow({
  service,
  reversed,
}: {
  service: (typeof services)[0];
  reversed: boolean;
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
        reversed ? "lg:[direction:rtl]" : ""
      }`}
    >
      {/* Image */}
      <div ref={imageRef} className={reversed ? "lg:[direction:ltr]" : ""}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={service.image}
            alt={service.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={reversed ? "lg:[direction:ltr]" : ""}
      >
        <span className="font-heading text-6xl font-light text-accent-taupe/40 md:text-7xl">
          {service.number}
        </span>
        <h3 className="mt-2 font-heading text-3xl font-light text-text-primary md:text-4xl">
          {service.title}
        </h3>
        <p className="mt-4 max-w-md font-body text-base font-light leading-relaxed text-text-secondary">
          {service.description}
        </p>
        <a
          href="#contact"
          className="editorial-link mt-6 inline-flex items-center gap-2 font-body text-sm font-medium tracking-wide text-text-primary transition-colors hover:text-accent-gold"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <SectionWrapper id="services">
      <div className="space-y-24 md:space-y-32">
        {services.map((service, i) => (
          <ServiceRow key={service.number} service={service} reversed={i % 2 !== 0} />
        ))}
      </div>
    </SectionWrapper>
  );
}
