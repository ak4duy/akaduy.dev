import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";
import { translations } from "@/lib/i18n/index";

export const metadata: Metadata = {
  title: translations.VN.privacy.metadataTitle,
  description: translations.VN.privacy.metadataDescription,
};

export default function Page() {
  return <PrivacyPage initialLanguage="VN" />;
}
