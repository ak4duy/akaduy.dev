import { notFound } from "next/navigation";
import { RoutedHomePage } from "@/components/routed-home-page";
import { getBlogPageCount, getBlogPosts } from "@/lib/blog-posts";

export function generateStaticParams() {
  return Array.from({ length: getBlogPageCount("VN") - 1 }, (_, index) => ({
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

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > pageCount) {
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
