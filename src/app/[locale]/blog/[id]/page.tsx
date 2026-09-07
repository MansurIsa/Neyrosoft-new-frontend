import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { excerpt } from "@/components/Cards";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPost, mediaUrl } from "@/lib/api";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(locale as Locale, id);
  if (!post) return {};
  return {
    title: post.title,
    description: excerpt(post.description, 155),
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const post = await getPost(typedLocale, id);
  if (!post) notFound();

  const image = mediaUrl(post.image);
  const date = new Date(post.blog_date).toLocaleDateString(
    typedLocale === "az" ? "az-AZ" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const paragraphs = post.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
      <Link
        href={`/${typedLocale}/blog`}
        className="chip hover:text-body transition-colors"
      >
        {dict.blog.backToList}
      </Link>

      <div className="mt-6">
        <p className="text-muted flex items-center gap-3 text-sm">
          <span>{date}</span>
          
          <span>
            {post.view_count} {dict.blog.views}
          </span>
        </p>
        <h1 className="text-body mt-4 text-3xl sm:text-4xl">{post.title}</h1>
      </div>

      {image && (
        <div className="card relative mt-9 aspect-16/9 overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-body mt-9">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
