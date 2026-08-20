import LegalManagementPage from "@/components/settings/LegalManagementPage";

export default function page() {
  return (
    <LegalManagementPage
      typeKey="privacy_policy"
      title="Privacy Policy"
      displayTitle="Get Privacy Policy"
      subtitle="Last updated: 2024-02-15"
      initialContent={`<h1>Privacy Policy</h1><p>RIZIPT is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>`}
    />
  );
}

