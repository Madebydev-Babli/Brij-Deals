import StatsSection from "@/server-components/StatsSection";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import WhatAreYouLookingFor from "@/client-components/WhatAreYouLookingFor";
import ArtiSection from "@/client-components/ArtiSection";
import WhyChooseUsSection from "@/server-components/WhyChooseUsSection";
import JoinWhatAppCommunitySection from "@/server-components/JoinWhatAppCommunitySection";
import BlogsSection from "@/client-components/BlogsSection";
import FAQsSection from "@/server-components/FAQsSection";
import HeroSectionServer from "@/server-components/HeroSection";

export default function Home() {
  return (
    <>
      <WebsiteLayout>
        <HeroSectionServer />
        <WhatAreYouLookingFor />
        <StatsSection />
        <ArtiSection />
        <WhyChooseUsSection />
        <JoinWhatAppCommunitySection />
        <BlogsSection />
        <FAQsSection page="/" />
      </WebsiteLayout>
    </>
  );
}
