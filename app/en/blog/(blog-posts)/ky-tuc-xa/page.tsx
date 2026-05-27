import type { Metadata } from "next";
import { BlogPostPage } from "@/components/blog-post-page";
import { createBlogPostMetadata, getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost(
  "EN",
  "ky-tuc-xa",
);

export const metadata: Metadata = createBlogPostMetadata(post);

export default function Page() {
  return <BlogPostPage initialLanguage="EN" post={post} />;
}
