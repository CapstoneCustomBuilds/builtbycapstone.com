"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !image1Ref.current || !image2Ref.current || !image3Ref.current) return;

    const ctx = gsap.context(() => {
      // Curtain reveals — each image wipes in from left
      const images = [image1Ref.current, image2Ref.current, image3Ref.current];
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            delay: i * 0.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // Parallax — images move at different speeds
      gsap.to(image1Ref.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image3Ref.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-primary px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Row 1: Large landscape left + tall narrow right */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large landscape — staircase */}
          <div ref={image1Ref} className="col-span-12 md:col-span-8">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/vision-1.jpg"
                alt="Modern architectural staircase with dramatic natural light"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </div>

          {/* Tall narrow — luxury architectural detail */}
          <div ref={image2Ref} className="col-span-12 md:col-span-4 md:mt-16">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/vision-2.jpg"
                alt="Luxury architectural detail"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Wide cinematic — aerial/waterfront */}
        <div ref={image3Ref} className="mt-6">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src="/images/vision-3.jpg"
              alt="Modern luxury landscaping and hardscape design"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Overlay text */}
        <div className="mt-12 max-w-xl md:mt-16">
          <h2 className="font-heading text-3xl font-light leading-tight text-text-primary md:text-4xl lg:text-5xl">
            Crafting Tampa Bay&apos;s Next Generation of Homes
          </h2>
        </div>
      </div>
    </section>
  );
}
