import { RoutedHomePage } from "@/components/routed-home-page";
import { getBlogPosts } from "@/lib/blog-posts";

export default function Page() {
  return <RoutedHomePage activeTab="blog" blogPosts={getBlogPosts("EN")} />;
}
