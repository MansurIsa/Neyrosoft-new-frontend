import { notFound } from "next/navigation";

import { BlogCard } from "@/components/Cards";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPosts } from "@/lib/api";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const posts = await getPosts(typedLocale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading as="h1" title={dict.blog.title} lead={dict.blog.lead} />
      {posts.length === 0 ? (
        <p className="text-muted mt-12">{dict.blog.empty}</p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              locale={typedLocale}
              viewsLabel={dict.blog.views}
            />
          ))}
        </div>
      )}
    </div>
  );
}
