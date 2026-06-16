import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Funnel } from "@/components/Funnel";
import { Differentiator } from "@/components/Differentiator";
import { AuditReport } from "@/components/AuditReport";
import { Pricing } from "@/components/Pricing";
import { Honesty } from "@/components/Honesty";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.brand.ko,
  alternateName: site.brand.latin,
  url: site.url,
  telephone: site.contact.phone,
  email: site.contact.email,
  areaServed: "KR",
  description: "동네 가게를 위한 네이버·인스타그램·카카오톡 통합 디지털 마케팅. 무료 진단 제공.",
  makesOffer: [
    { "@type": "Offer", name: "진단", price: "99000", priceCurrency: "KRW" },
    { "@type": "Offer", name: "기본", price: "350000", priceCurrency: "KRW" },
    { "@type": "Offer", name: "성장", price: "650000", priceCurrency: "KRW" },
    { "@type": "Offer", name: "프리미엄", price: "1200000", priceCurrency: "KRW" },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Funnel />
        <Differentiator />
        <AuditReport />
        <Pricing />
        <Honesty />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
