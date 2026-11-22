import Cs_HeroSection from "@/app/ui/HeroSection";
import Cs_FeaturedServices from "@/app/ui/FeaturedServices";
import Cs_HowItWorks from "@/app/ui/HowItWorks";
import Cs_CategoryGrid from "@/app/ui/CategoryGrid";
import Cs_WhyChooseUs from "@/app/ui/WhyChooseUs";
import Cs_Testimonials from "@/app/ui/Testimonials";

const Cs_HomePage = () => {
  return (
    <>
      <Cs_HeroSection />
      <Cs_FeaturedServices />
      <Cs_HowItWorks />
      <Cs_CategoryGrid />
      <Cs_WhyChooseUs />
      <Cs_Testimonials />
    </>
  );
};

export default Cs_HomePage;
