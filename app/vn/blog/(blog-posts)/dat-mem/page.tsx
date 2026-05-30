import type { Metadata } from "next";
import { BlogPostPage } from "@/components/blog-post-page";
import { createBlogPostMetadata, getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("VN", "dat-mem");

export const metadata: Metadata = createBlogPostMetadata(post);

export default function Page() {
  return <BlogPostPage initialLanguage="VN" post={post} />;
}
