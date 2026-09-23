import SiteNavigation from "@/components/SiteNavigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import FaqSection from "@/components/FaqSection";
import CtaRevealSection from "@/components/CtaRevealSection";

export default function Home() {
  return (
    <main className="bg-bg text-fg relative">
      <SiteNavigation />
      <HeroSection />
      <ManifestoSection />
      <ActivitiesSection />
      <FaqSection />
      <CtaRevealSection />
    </main>
  );
}
