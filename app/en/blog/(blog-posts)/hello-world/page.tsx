import type { Metadata } from "next";
import { BlogPostPage } from "@/components/blog-post-page";
import { getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("EN", "hello-world");

export const metadata: Metadata = {
  title: `Blog: ${post.title} | ak4duy`,
  description: post.excerpt,
};

export default function Page() {
  return <BlogPostPage initialLanguage="EN" post={post} />;
}
