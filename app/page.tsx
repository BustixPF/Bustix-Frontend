import {
  Hero,
  WaveDivider,
  PopularRoutes,
  UpcomingDepartures,
  Benefits,
  HowItWorks,
  PartnerCompanies,
  CompanyCta,
} from "@/components/home/page";

export default function Home() {
  return (
    <main>
      <Hero />
      <WaveDivider />
      <PopularRoutes />
      <UpcomingDepartures />
      <Benefits />
      <HowItWorks />
      <PartnerCompanies />
      <CompanyCta />
    </main>
  );
}