import type { Translation } from "@/lib/i18n/index";

export const vn: Translation = {
  nav: {
    about: "Giới thiệu",
    experience: "Kinh nghiệm",
    blog: "Blog",
    contact: "Liên hệ",
  },
  home: {
    intro:
      "Lập trình viên tự học (đa số).\nHiện đang làm với Java, Python, Rust, và bất cứ thứ gì.",
    currentlyWorkingOn: "đang code project",
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
    footer: "code, ideas, and the journey in between.",
  },
  projects: [
    {
      name: "yud-on.top",
      href: "https://github.com/ak4duy/yud-on.top",
      description: [
        "Đây là trang web cá nhân và blog của tôi.",
        "Tôi thường ghi blog ở đây và chia sẻ về dự án cá nhân của mình.",
      ],
      tags: ["Next.js", "React", "Typescript", "Markdown"],
    },
    {
      name: "Kopuz",
      href: "https://github.com/Kopuz-org/kopuz/",
      description: [
        "Trình phát nhạc mã nguồn mở xây bằng Rust và Dioxus.",
        "Hiện đang đóng góp tính năng và sửa lỗi.",
      ],
      tags: ["Rust", "Dioxus"],
    },
    {
      name: "1 in 10000 chance of Foxy jumpscare per second",
      href: "https://ankiweb.net/shared/info/1601646218",
      description: [
        "Một add-on vui vẻ cho Anki.",
        "Mỗi giây sẽ có 1/10000 cơ hội Foxy jumpscare ngẫu nhiên.",
      ],
      tags: ["Python", "PyQt", "Anki Add-on"],
    },
    {
      name: "DeskForge",
      href: "https://github.com/ak4duy/DeskForge",
      description: [
        "Một TUI chỉnh launcher đơn giản cho Linux mà chẳng ai xài.",
      ],
      tags: ["Rust", "Ratatui"],
    },
  ],
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
      value: "Dùng cho liên lạc mã hóa",
      external: true,
    },
  ],
  blog: {
    contents: "Nội dung",
    searchPlaceholder: "Tìm bài viết...",
    tagFilterLabel: "Lọc bài viết theo từ khóa",
    allTags: "Tất cả từ khóa",
    clearTagFilter: "Xóa bộ lọc từ khóa",
    noSearchResults: "Không tìm thấy bài viết.",
    minuteRead: "phút đọc",
  },
};
