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
        name: "yud-on.top",
        href: "https://github.com/ak4duy/yud-on.top",
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
      href: "https://discord.com/users/799965541283528714",
      icon: "/contact-icons/discord.svg",
      label: "Discord",
      value: "ak4duy",
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
      "Polls store your choice and use a salted hash to prevent duplicate votes.",
    pollError: "Could not load poll results.",
  },
};
