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
  experience: {
    workingOnTitle: "Đang làm",
    projectsTitle: "Dự án",
    contributedToTitle: "Đã đóng góp",
    workingOn: [
      {
        name: "Inkspace",
        href: "https://github.com/ak4duy/inkspace",
        description: [
          "Một nơi ấm cúng dành cho bạn bè.",
        ],
        tags: ["Typescript", "Docker", "Self-hosted"],
      },
    ],
    projects: [
      {
        name: "akaduy.dev",
        href: "https://github.com/ak4duy/akaduy.dev",
        description: [
          "Đây là trang web cá nhân và blog của tôi.",
          "Tôi thường ghi blog ở đây và chia sẻ về dự án cá nhân của mình.",
        ],
        tags: ["Next.js", "React", "Typescript", "Markdown"],
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
    contributedTo: [
      {
        name: "Kopuz",
        href: "https://github.com/Kopuz-org/kopuz/",
        description: [
          "Trình phát nhạc mã nguồn mở xây bằng Rust và Dioxus.",
          "Hiện đã đóng góp tính năng và sửa lỗi.",
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
      href: "mailto:rien@akaduy.dev",
      icon: "/contact-icons/mail.svg",
      label: "Email",
      value: "rien@akaduy.dev",
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
    archive: "LƯU TRỮ",
    thisMonth: "Tháng này",
    lastMonth: "Tháng trước",
    clearTagFilter: "Xóa bộ lọc từ khóa",
    noSearchResults: "Không tìm thấy bài viết.",
    minuteRead: "phút đọc",
    pollVote: "Gửi",
    pollCancel: "Hủy",
    pollVotes: "lượt bình chọn",
    pollVoted: "Đã bình chọn",
    pollUndo: "Hoàn tác bình chọn",
    pollLoading: "Đang tải poll...",
    pollPrivacy:
      "Mọi bình chọn đều hoàn toàn ẩn danh. Tôi không thu thập bất kỳ thông tin cá nhân nào.",
    pollPrivacyLink: "Tìm hiểu thêm",
    pollError: "Không thể tải kết quả poll.",
  },
  privacy: {
    metadataTitle: "Quyền riêng tư | akaduy",
    metadataDescription:
      "Thông tin quyền riêng tư cho website cá nhân của akaduy.",
    title: "Quyền riêng tư",
    updated: "Cập nhật lần cuối: 28 tháng 5, 2026",
    intro:
      "Trang này giải thích dữ liệu nào được, và không được, chủ động thu thập khi bạn truy cập website này.",
    homeLabel: "Trang chủ",
    sections: [
      {
        title: "Không có tài khoản hoặc trình theo dõi quảng cáo",
        paragraphs: [
          "Website này không yêu cầu tài khoản người dùng và không chủ động thu thập thông tin cá nhân thông qua biểu mẫu trên trang.",
          "Website này không sử dụng trình theo dõi quảng cáo và không bán dữ liệu người truy cập.",
        ],
      },
      {
        title: "Bình chọn trong Blog",
        paragraphs: [
          "Nếu bạn bình chọn trong poll của bài viết, lựa chọn bình chọn sẽ được lưu cùng ID của poll để tính kết quả.",
          "Để giảm spam bình chọn, API tạo một hash có salt từ dữ liệu kỹ thuật của request như địa chỉ IP, User-Agent và ID của poll. Địa chỉ IP gốc không được lưu trong database của poll.",
        ],
      },
      {
        title: "Hosting và bảo mật",
        paragraphs: [
          "Các nhà cung cấp Hosting và mạng có thể tạm thời xử lý thông tin kỹ thuật như địa chỉ IP, thông tin trình duyệt, metadata của request và log bảo mật để phân phối và bảo vệ website.",
        ],
      },
      {
        title: "Liên hệ",
        paragraphs: [
          "Nếu bạn có câu hỏi về trang quyền riêng tư này, bạn có thể liên hệ với tôi qua các liên kết liên hệ trên website.",
        ],
      },
    ],
  },
};
