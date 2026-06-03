import type { Translation } from "@/lib/i18n/index";

export const en: Translation = {
  nav: {
    about: "About",
    experience: "Experience",
    blog: "Blog",
    contact: "Contact",
  },
  home: {
    intro:
      "Self-taught developer.\nCurrently working with Java, Python, Rust, and whatever breaks next.",
    currentlyWorkingOn: "currently working on",
    backgroundTitle: "Background",
    background: [
      "Self-taught developer back in 2017 by learning Lua",
      "Now learning things properly at university and working with Java, Python, Rust, and whatever breaks next",
    ],
    languagesTitle: "Languages & Tools",
    interestedTitle: "Interested In",
    projectsTitle: "Projects",
    educationTitle: "Education",
    university: "University",
    universityDescription:
      "Currently studying and learning things properly (maybe xd).",
    ongoing: "Ongoing",
    blogPostsTitle: "Posts",
    morePosts: "More posts coming soon...",
    contactTitle: "Get in Touch",
    footer: "code, ideas, and the journey in between.",
  },
  experience: {
    workingOnTitle: "Working on",
    projectsTitle: "Projects",
    contributedToTitle: "Contributed to",
    workingOn: [
      {
        name: "Resonance",
        href: "https://github.com/ak4duy/resonance-flyout",
        description: [
          "A modern Windows media flyout replacement built in Rust.",
        ],
        tags: ["Rust", "Typescript", "Tauri", "Svelte"],
      },
    ],
    projects: [
      {
        name: "akaduy.dev",
        href: "https://github.com/ak4duy/akaduy.dev",
        description: [
          "My personal portfolio and blog website.",
          "I write blogs here and share updates about my personal projects.",
        ],
        tags: ["Next.js", "React", "Typescript", "Markdown"],
      },
      {
        name: "1 in 10000 chance of Foxy jumpscare per second",
        href: "https://ankiweb.net/shared/info/1601646218",
        description: [
          "An add-on that makes your study thrilling.",
          "Every second, there is a 1 in 10000 chance that Foxy will randomly jumpscare you.",
        ],
        tags: ["Python", "PyQt", "Anki Add-on"],
      },
      {
        name: "DeskForge",
        href: "https://github.com/ak4duy/DeskForge",
        description: [
          "A simple TUI launcher editor for Linux no one asked for.",
        ],
        tags: ["Rust", "Ratatui"],
      },
    ],
    contributedTo: [
      {
        name: "Kopuz",
        href: "https://github.com/Kopuz-org/kopuz/",
        description: [
          "Open-source music player built with Rust and Dioxus.",
          "Contributed features and fixing bugs.",
        ],
        tags: ["Rust", "Dioxus"],
      },
    ],
  },
  contacts: [
    {
      href: "https://github.com/ak4duy",
      icon: "/contact-icons/github.svg",
      label: "GitHub",
      value: "@ak4duy",
      external: true,
    },
    {
      href: "https://matrix.to/#/@rien:akaduy.dev",
      icon: "/contact-icons/matrix-icon-white.png",
      label: "Matrix",
      value: "@rien:akaduy.dev",
      external: true,
    },
    {
      href: "https://discord.com/users/799965541283528714",
      icon: "/contact-icons/discord.svg",
      label: "Discord",
      value: "akaduy69420",
      external: true,
    },
    {
      href: "mailto:akaduy@yud-on.top",
      icon: "/contact-icons/mail.svg",
      label: "Email",
      value: "akaduy@yud-on.top",
      external: false,
    },
    {
      href: "https://github.com/ak4duy.gpg",
      icon: "/contact-icons/pgp.svg",
      label: "PGP Key",
      value: "For encrypted communication",
      external: true,
    },
  ],
  blog: {
    contents: "Contents",
    searchPlaceholder: "Search posts...",
    tagFilterLabel: "Filter posts by tag",
    allTags: "All tags",
    archive: "ARCHIVE",
    thisMonth: "This month",
    lastMonth: "Last month",
    clearTagFilter: "Clear tag filter",
    noSearchResults: "No posts found.",
    minuteRead: "min read",
    pollVote: "Submit",
    pollCancel: "Cancel",
    pollVotes: "votes",
    pollVoted: "Voted",
    pollUndo: "Undo vote",
    pollLoading: "Loading poll...",
    pollPrivacy:
      "All votes are anonymous. We do not collect personal information.",
    pollPrivacyLink: "Learn more",

    pollError: "Could not load poll results.",
  },
  privacy: {
    metadataTitle: "Privacy | akaduy",
    metadataDescription: "Privacy information for akaduy's personal website.",
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
  },
};
