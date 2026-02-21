import HeroSection from "@/components/HeroSection";
import PhilosophyStrip from "@/components/PhilosophyStrip";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import ProcessSection from "@/components/ProcessSection";
import TrustStrip from "@/components/TrustStrip";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PhilosophyStrip />
      <ServicesSection />
      <AboutSection />
      <VisionSection />
      <ProcessSection />
      <TrustStrip />
      <ContactSection />
    </>
  );
}
