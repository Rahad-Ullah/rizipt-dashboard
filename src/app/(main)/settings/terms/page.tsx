import LegalManagementPage from "@/components/settings/LegalManagementPage";

export default function page() {
  return (
    <LegalManagementPage
      typeKey="terms_of_service"
      title="Terms of Service"
      displayTitle="Get Terms of Service"
      subtitle="Last updated: 2024-02-15"
      initialContent={`<h1>Terms of Service</h1><p>Welcome to RIZIPT. By using our platform, you agree to these terms.</p>`}
    />
  );
}

