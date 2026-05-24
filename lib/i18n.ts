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
    description: string;
    tags: string[];
  }>;

  contacts: Array<{
    href: string;
    label: string;
    value: string;
    external: boolean;
    icon: "github" | "discord" | "mail" | "key";
  }>;
};

export const translations: Record<Language, Translation> = {
  EN: {
    nav: {
      about: "About",
      experience: "Experience",
      blog: "Blog",
      contact: "Contact",
    },
    home: {
      intro:
        "Self-taught developer.\nCurrently working with Java, Python, Rust, and whatever breaks next.",
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
      footer: "born to use java, forced to use rust",
    },
    projects: [
      {
        name: "Kopuz",
        href: "https://github.com/Kopuz-org/kopuz/pulls?q=is%3Apr+is%3Aclosed+author%3Aak4duy",
        description:
          "Open-source music player built with Rust and Dioxus.\nCurrently contributing features and fixing bugs.",
        tags: ["Rust", "Dioxus"],
      },
      {
        name: "1 in 10000 chance of Foxy jumpscare per second",
        href: "https://github.com/ak4duy/1_10000_jumpscare",
        description:
          "An add-on that makes your study thrilling.\nEvery second, there is a 1 in 10000 chance that Foxy will randomly jumpscare you.",
        tags: ["Python", "PyQt", "Anki Add-on"],
      },
      {
        name: "DeskForge",
        href: "https://github.com/ak4duy/DeskForge",
        description: "A simple TUI launcher editor for Linux no one asked for.",
        tags: ["Rust", "Ratatui"],
      },
    ],

    contacts: [
      {
        href: "https://github.com/ak4duy",
        icon: "github",
        label: "GitHub",
        value: "@ak4duy",
        external: true,
      },
      {
        href: "https://discord.com/users/799965541283528714",
        icon: "discord",
        label: "Discord",
        value: "ak4duy",
        external: true,
      },
      {
        href: "mailto:akaduy@protonmail.me",
        icon: "mail",
        label: "Email",
        value: "akaduy@protonmail.me",
        external: false,
      },
      {
        href: "https://github.com/ak4duy.gpg",
        icon: "key",
        label: "PGP Key",
        value: "For encrypted communication",
        external: true,
      },
    ],
  },
  VN: {
    nav: {
      about: "Giới thiệu",
      experience: "Kinh nghiệm",
      blog: "Blog",
      contact: "Liên hệ",
    },
    home: {
      intro:
        "Lập trình viên tự học (đa số).\nHiện đang làm với Java, Python, Rust, và bất cứ thứ gì.",
      backgroundTitle: "Nền tảng",
      background: [
        "Tự học lập trình từ năm 2017 bằng Lua",
        "Hiện đang học bài bản hơn ở đại học và làm với Java, Python, Rust, và bất cứ thứ gì.",
      ],
      languagesTitle: "Ngôn ngữ & Công cụ",
      interestedTitle: "Đang quan tâm",
      projectsTitle: "Dự án",
      educationTitle: "Học vấn",
      university: "Đại học",
      universityDescription:
        "Đang học và cố gắng học cho đàng hoàng (chắc vậy xd).",
      ongoing: "Đang học",
      blogPostsTitle: "Bài viết",
      morePosts: "Sẽ có thêm bài viết sau...",
      contactTitle: "Liên hệ",
      footer: "tuong tuong mot cau gi do ve cuoc song",
    },
    projects: [
      {
        name: "Kopuz",
        href: "https://github.com/Kopuz-org/kopuz/pulls?q=is%3Apr+is%3Aclosed+author%3Aak4duy",
        description:
          "Trình phát nhạc mã nguồn mở xây bằng Rust và Dioxus.\nHiện đang đóng góp tính năng và sửa lỗi.",
        tags: ["Rust", "Dioxus"],
      },
      {
        name: "1 in 10000 chance of Foxy jumpscare per second",
        href: "https://github.com/ak4duy/1_10000_jumpscare",
        description:
          "Một add-on vui vẻ cho Anki.\nMỗi giây sẽ có 1/10000 cơ hội Foxy jumpscare ngẫu nhiên.",
        tags: ["Python", "PyQt", "Anki Add-on"],
      },
      {
        name: "DeskForge",
        href: "https://github.com/ak4duy/DeskForge",
        description:
          "Một TUI chỉnh launcher đơn giản cho Linux mà chẳng ai xài.",
        tags: ["Rust", "Ratatui"],
      },
    ],

    contacts: [
      {
        href: "https://github.com/ak4duy",
        icon: "github",
        label: "GitHub",
        value: "@ak4duy",
        external: true,
      },
      {
        href: "https://discord.com/users/799965541283528714",
        icon: "discord",
        label: "Discord",
        value: "ak4duy",
        external: true,
      },
      {
        href: "mailto:akaduy@protonmail.me",
        icon: "mail",
        label: "Email",
        value: "akaduy@protonmail.me",
        external: false,
      },
      {
        href: "https://github.com/ak4duy.gpg",
        icon: "key",
        label: "PGP Key",
        value: "Dùng cho liên lạc mã hóa",
        external: true,
      },
    ],
  },
};
