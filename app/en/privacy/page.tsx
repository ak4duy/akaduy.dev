import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";
import { translations } from "@/lib/i18n/index";

export const metadata: Metadata = {
  title: translations.EN.privacy.metadataTitle,
  description: translations.EN.privacy.metadataDescription,
};

export default function Page() {
  return <PrivacyPage initialLanguage="EN" />;
}
