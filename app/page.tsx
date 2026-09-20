import SiteNavigation from "@/components/SiteNavigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import GatheringSection from "@/components/GatheringSection";
import CtaRevealSection from "@/components/CtaRevealSection";

export default function Home() {
  return (
    <main className="bg-bg text-fg relative">
      <SiteNavigation />
      <HeroSection />
      <ManifestoSection />
      <ActivitiesSection />
      <div className="relative w-full bg-[#24331C]">
        <GatheringSection />
      </div>
      <CtaRevealSection />
    </main>
  );
}
