import LegalManagementPage from "@/components/settings/LegalManagementPage";

export default function page() {
  return (
    <LegalManagementPage
      typeKey="about_us"
      title="About Us"
      displayTitle="Get About Us"
      subtitle="Last updated: 2024-02-18"
      initialContent={`<h1>About RIZIPT</h1><p>RIZIPT is a cutting-edge receipt scanning and merchant management platform built to streamline the way businesses handle transactions, loyalty programs, and offer redemptions.</p>`}
    />
  );
}

