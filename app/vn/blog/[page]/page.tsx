import { notFound } from "next/navigation";
import { RoutedHomePage } from "@/components/routed-home-page";
import { getBlogPageCount, getBlogPosts } from "@/lib/blog-posts";

export const dynamicParams = false;

export function generateStaticParams() {
  const pageCount = getBlogPageCount("VN");

  return Array.from({ length: Math.max(1, pageCount - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);
  const pageCount = getBlogPageCount("VN");

  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    notFound();
  }

  return (
    <RoutedHomePage
      activeTab="blog"
      initialLanguage="VN"
      initialBlogPage={pageNumber}
      blogPosts={getBlogPosts("VN")}
    />
  );
}
