import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";

export const metadata: Metadata = {
  title: "Privacy | ak4duy",
  description: "Privacy information for ak4duy's personal website.",
};

export default function Page() {
  return (
    <PrivacyPage
      initialLanguage="EN"
      content={{
        title: "Privacy",
        updated: "Last updated: 28 May, 2026",
        intro:
          "This page explains what data is, and is not, intentionally collected when you visit this website.",
        homeLabel: "Home",
        sections: [
          {
            title: "No accounts or advertising trackers",
            paragraphs: [
              "This website does not require user accounts and does not intentionally collect personal information through forms on this site.",
              "This website does not use advertising trackers or sell visitor data.",
            ],
          },
          {
            title: "Blog polls",
            paragraphs: [
              "If you vote in a blog poll, the vote choice is stored with the poll ID so the poll results can be counted.",
              "To reduce vote spam, the API creates a salted hash from technical request data such as IP address, User-Agent, and poll ID. The raw IP address is not stored in the poll database.",
            ],
          },
          {
            title: "Hosting and security",
            paragraphs: [
              "Hosting and network providers may temporarily process technical information such as IP address, browser information, request metadata, and security logs as part of delivering and protecting the website.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              "If you have questions about this privacy page, you can contact me through the contact links on this website.",
            ],
          },
        ],
      }}
    />
  );
}
