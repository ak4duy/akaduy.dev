import type { Metadata } from "next";
import { BlogPostPage } from "@/components/blog-post-page";
import { createBlogPostMetadata, getBlogPost } from "@/lib/blog-posts";

const post = getBlogPost("EN", "giay-xac-nhan-con-song");

export const metadata: Metadata = createBlogPostMetadata(post);

export default function Page() {
  return <BlogPostPage initialLanguage="EN" post={post} />;
}
