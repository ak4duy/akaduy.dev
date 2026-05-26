import { en } from "@/lib/i18n/en";
import { vn } from "@/lib/i18n/vn";

export const languages = ["EN", "VN"] as const;

export type Language = (typeof languages)[number];

export type Translation = {
  nav: {
    about: string;
    experience: string;
    blog: string;
    contact: string;
  };
  home: {
    intro: string;
    currentlyWorkingOn: string;
    backgroundTitle: string;
    background: string[];
    languagesTitle: string;
    interestedTitle: string;
    projectsTitle: string;
    educationTitle: string;
    university: string;
    universityDescription: string;
    ongoing: string;
    blogPostsTitle: string;
    morePosts: string;
    contactTitle: string;
    footer: string;
  };
  projects: Array<{
    name: string;
    href: string;
    description: string[];
    tags: string[];
  }>;
  contacts: Array<{
    href: string;
    label: string;
    value: string;
    external: boolean;
    icon: string;
  }>;
  blog: {
    contents: string;
    searchPlaceholder: string;
    noSearchResults: string;
    minuteRead: string;
  };
};

export const translations: Record<Language, Translation> = {
  EN: en,
  VN: vn,
};
