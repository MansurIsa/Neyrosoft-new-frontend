import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { mediaUrl } from "@/lib/api";
import type { BlogPost, CustomerReview, Project, Service } from "@/lib/types";

import {
  IconArrowRight,
  IconCalendar,
  IconExternal,
  IconEye,
  IconStar,
  ServiceGlyph,
} from "./Icons";

/** Strip a CMS body down to a short preview. */
export function excerpt(text: string, length = 120): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
}

export function ServiceCard({
  service,
  locale,
  readMore,
}: {
  service: Service;
  locale: Locale;
  readMore: string;
}) {
  return (
    <Link
      href={`/${locale}/services/${service.id}`}
      className="card card-hover group flex flex-col p-6"
    >
      <span className="icon-plate">
        <ServiceGlyph title={service.title} width={24} height={24} />
      </span>
      <h3 className="text-body mt-5 text-lg leading-snug font-semibold">{service.title}</h3>
      <p className="text-muted mt-2.5 flex-1 text-sm leading-relaxed">
        {excerpt(service.description)}
      </p>
      <span className="text-signal mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
        {readMore}
        <IconArrowRight
          width={16}
          height={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export function ProjectCard({ project, visit }: { project: Project; visit: string }) {
  const image = mediaUrl(project.image);
  const host = project.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover group block overflow-hidden"
    >
      <div className="bg-surface-2 relative aspect-16/10 overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="text-body truncate font-semibold">{project.title}</h3>
          <p className="text-muted mt-0.5 truncate text-xs">{host}</p>
        </div>
        <span className="icon-plate icon-plate-ink group-hover:bg-signal-soft group-hover:text-signal h-10 w-10 rounded-full transition-colors">
          <IconExternal width={17} height={17} />
          <span className="sr-only">{visit}</span>
        </span>
      </div>
    </a>
  );
}

export function BlogCard({
  post,
  locale,
  viewsLabel,
}: {
  post: BlogPost;
  locale: Locale;
  viewsLabel: string;
}) {
  const image = mediaUrl(post.image);
  const date = new Date(post.blog_date).toLocaleDateString(
    locale === "az" ? "az-AZ" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <Link
      href={`/${locale}/blog/${post.id}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="bg-surface-2 relative aspect-16/9 overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {post.blog_type && (
          <span className="bg-surface/90 text-body absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {post.blog_type}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-muted flex items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <IconCalendar />
            {date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconEye />
            {post.view_count} {viewsLabel}
          </span>
        </div>
        <h3 className="text-body mt-3 text-lg leading-snug font-semibold">{post.title}</h3>
        <p className="text-muted mt-2.5 flex-1 text-sm leading-relaxed">
          {excerpt(post.description, 100)}
        </p>
      </div>
    </Link>
  );
}

export function ReviewCard({ review }: { review: CustomerReview }) {
  const image = mediaUrl(review.image);
  const rating = Math.max(0, Math.min(5, review.star_rating));

  return (
    <figure className="card flex flex-col p-6">
      <div className="text-signal flex gap-0.5" aria-label={`${rating}/5`}>
        {[1, 2, 3, 4, 5].map((index) => (
          <IconStar key={index} filled={index <= rating} />
        ))}
      </div>
      <blockquote className="text-body mt-4 flex-1 leading-relaxed">
        {review.review}
      </blockquote>
      <figcaption className="border-line mt-5 flex items-center gap-3 border-t pt-4">
        {image ? (
          <Image
            src={image}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="bg-signal-soft text-signal flex h-10 w-10 items-center justify-center rounded-full font-semibold">
            {review.title.charAt(0)}
          </span>
        )}
        <span className="min-w-0">
          <span className="text-body block truncate text-sm font-semibold">
            {review.title}
          </span>
          {review.company && (
            <span className="text-muted block truncate text-xs">{review.company}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
