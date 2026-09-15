import Seo from "@/components/seo/Seo";
import { seoForPath, medicalClinicSchema, faqPageSchema } from "@/constants/seo";
import { BeforeAfter } from "./components/BeforeAfter";
import DoctorBook from "./components/DoctorBook";
import Hero from "./components/Hero";
import { HomeFAQ } from "./components/HomeFAQ";
import ServicesOverview from "./components/Service";
import SignaturePackage from "./components/SignaturePackage";
import Testimonials from "./components/Testimonials";
import TrustStrip from "./components/TrustStrip";
import { HOME_FAQS } from "./data/homeFaqData";

export default function Home() {
  const seo = seoForPath("/");
  return (
    <>
      <Seo
        {...seo}
        jsonLd={[medicalClinicSchema(), faqPageSchema(HOME_FAQS)]}
      />
      <Hero />
      <TrustStrip />
      <ServicesOverview />
      <DoctorBook />
      <Testimonials />
      <BeforeAfter />
      <HomeFAQ />
      <SignaturePackage />
    </>
  );
}
