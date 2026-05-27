import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";

export const metadata: Metadata = {
  title: "Quyền riêng tư | ak4duy",
  description: "Thông tin quyền riêng tư cho website cá nhân của ak4duy.",
};

export default function Page() {
  return (
    <PrivacyPage
      initialLanguage="VN"
      content={{
        title: "Quyền riêng tư",
        updated: "Cập nhật lần cuối: 27 tháng 5, 2026",
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
      }}
    />
  );
}
