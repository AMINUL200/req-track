import React from "react";
import HeroSection from "../../component/landingPageCom/HeroSection";
import FeaturedJobsSection from "../../component/landingPageCom/FeaturedJobsSection";
import HowItWorkSection from "../../component/landingPageCom/HowItWorkSection";
import PlatformFeaturesSection from "../../component/landingPageCom/PlatformFeaturesSection";
import WhyChooseUsSection from "../../component/landingPageCom/WhyChooseUsSection";
import StatisticsSection from "../../component/landingPageCom/StatisticsSection";
import Testimonials from "../../component/landingPageCom/Testimonials";
import CTASection from "../../component/landingPageCom/CTASection";
import LatestJobsSection from "../../component/landingPageCom/LatestJobssection";
import FAQSection from "../../component/landingPageCom/FAQSection";

const LandingPage = () => {
  return (
    <div>
      {/* Section 1: Hero Section */}
      <HeroSection />
      {/* Section 2: Featured Jobs */}
      <FeaturedJobsSection/>
      {/* Section 3: How It Works */}
      <HowItWorkSection/>
      {/* Section 4: Platform features */}
      <PlatformFeaturesSection/>
      {/* Section 5: Why Choose Us */}
      <WhyChooseUsSection/>
      {/* Section 6: Statistics */}
      <StatisticsSection/>
      {/* Section 7: Testimonials */}
      <Testimonials/>
      {/* Section 8 : CTA  */}
      <CTASection/>
      {/* Section 9 : lates Jobs */}
      <LatestJobsSection/>
      {/* Section 10: FAQ  */}
      <FAQSection/>
    </div>
  );
};

export default LandingPage;
