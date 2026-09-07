import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard, ProjectCard, ReviewCard, ServiceCard } from "@/components/Cards";
import Counters from "@/components/Counters";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import {
  getBanners,
  getPosts,
  getProjects,
  getReviews,
  getServices,
  getSettings,
} from "@/lib/api";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const href = (path: string) => `/${typedLocale}${path}`;

  const [banners, services, projects, posts, reviews, settings] = await Promise.all([
    getBanners(typedLocale),
    getServices(typedLocale),
    getProjects(typedLocale),
    getPosts(typedLocale),
    getReviews(typedLocale),
    getSettings(typedLocale),
  ]);

  const stats = settings
    ? [
        { value: settings.about_count_first, label: settings.about_count_first_title },
        { value: settings.about_count_second, label: settings.about_count_second_title },
        { value: settings.about_count_third, label: settings.about_count_third_title },
        { value: settings.about_count_fourth, label: settings.about_count_fourth_title },
      ]
    : [];

  return (
    <>
      <Hero locale={typedLocale} banner={banners[0] ?? null} settings={settings} />

      {stats.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 lg:px-8">
          <Counters stats={stats} />
        </section>
      )}

      {services.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5 lg:px-8">
          <SectionHeading
            title={dict.home.servicesTitle}
            lead={dict.home.servicesLead}
            action={
              <Link href={href("/services")} className="btn btn-outline">
                {dict.home.viewAll}
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                locale={typedLocale}
                readMore={dict.services.readMore}
              />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5 lg:px-8">
          <SectionHeading
            title={dict.home.projectsTitle}
            lead={dict.home.projectsLead}
            action={
              <Link href={href("/projects")} className="btn btn-outline">
                {dict.home.viewAll}
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                visit={dict.projects.visit}
              />
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5 lg:px-8">
          <SectionHeading title={dict.home.reviewsTitle} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5 lg:px-8">
          <SectionHeading
            title={dict.home.blogTitle}
            lead={dict.home.blogLead}
            action={
              <Link href={href("/blog")} className="btn btn-outline">
                {dict.home.viewAll}
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                locale={typedLocale}
                viewsLabel={dict.blog.views}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-6xl px-5 lg:px-8">
        <div className="bg-ink relative overflow-hidden rounded-[28px] p-8 text-white sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-lg">
            <h2 className="text-3xl sm:text-4xl">{dict.home.ctaTitle}</h2>
            <p className="mt-4 leading-relaxed text-white/75">{dict.home.ctaLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={href("/calculator")} className="btn btn-primary">
                {dict.nav.calculator}
              </Link>
              <Link
                href={href("/contact")}
                className="btn border border-white/25 text-white hover:bg-white/10"
              >
                {dict.home.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
