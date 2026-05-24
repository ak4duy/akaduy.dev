import { BlogPostPage } from "@/components/blog-post-page";
import { getBlogPost } from "@/lib/blog-posts";

export default function Page() {
  return (
    <BlogPostPage
      initialLanguage="EN"
      post={getBlogPost("EN", "hello-world")}
    />
  );
}
