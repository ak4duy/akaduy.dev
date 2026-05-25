import type { Metadata } from "next";
import { BlogPostPage } from "@/components/blog-post-page";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost(
  "VN",
  "why-i-think-rust-is-the-language-of-the-future",
);

export const metadata: Metadata = {
  title: `Blog: ${post.title} | ak4duy`,
  description: post.excerpt,
};

export default function Page() {
  return <BlogPostPage initialLanguage="VN" post={post} />;
}
