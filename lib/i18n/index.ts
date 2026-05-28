import { en } from "@/lib/i18n/en";
import { vn } from "@/lib/i18n/vn";

export const languages = ["EN", "VN"] as const;

export type Language = (typeof languages)[number];

type ExperienceItem = {
  name: string;
  href: string;
  description: string[];
  tags: string[];
};

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
  experience: {
    workingOnTitle: string;
    projectsTitle: string;
    contributedToTitle: string;
    workingOn: ExperienceItem[];
    projects: ExperienceItem[];
    contributedTo: ExperienceItem[];
  };
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
    tagFilterLabel: string;
    allTags: string;
    clearTagFilter: string;
    noSearchResults: string;
    minuteRead: string;
    pollVote: string;
    pollCancel: string;
    pollVotes: string;
    pollVoted: string;
    pollUndo: string;
    pollLoading: string;
    pollPrivacy: string;
    pollPrivacyLink: string;
    pollError: string;
  };
};

export const translations: Record<Language, Translation> = {
  EN: en,
  VN: vn,
};
