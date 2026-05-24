import { BlogPostPage } from "@/components/blog-post-page";
import { getBlogPost } from "@/lib/blog-posts";

export default function Page() {
  return (
    <BlogPostPage
      initialLanguage="VN"
      post={getBlogPost("VN", "hello-world")}
    />
  );
}
