import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/Cards";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getProjects } from "@/lib/api";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const projects = await getProjects(typedLocale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading as="h1" title={dict.projects.title} lead={dict.projects.lead} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} visit={dict.projects.visit} />
        ))}
      </div>
    </div>
  );
}
