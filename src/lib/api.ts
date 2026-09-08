import type { Locale } from "@/i18n/config";
import type {
  Banner,
  BlogPost,
  CustomerReview,
  Project,
  Service,
  SiteSettings,
  SocialLink,
} from "./types";

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://127.0.0.1:8000";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? `${API_ORIGIN}/api`;

/**
 * Turn a MEDIA path from the API into something <Image> can load.
 *
 * DRF builds absolute URLs from the incoming request, and behind a proxy that
 * does not forward X-Forwarded-Proto it hands back `http://` even on an HTTPS
 * site — which browsers then block as mixed content. So we keep only the part
 * after /media/ and rebuild the URL against API_ORIGIN, which is always right.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const relative = path
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/?media\/?/, "");
  if (!relative) return null;
  return `${API_ORIGIN}/media/${relative}`;
}

interface FetchOptions {
  locale: Locale;
  /** Seconds. 0 disables the cache for always-fresh reads. */
  revalidate?: number;
}

/**
 * Server-side read. The locale goes out as Accept-Language, which is what makes
 * the Django side answer in the right language — that is the "dynamic" half of
 * the translation setup, with the JSON dictionaries covering the static half.
 */
export async function apiGet<T>(
  path: string,
  { locale, revalidate = 60 }: FetchOptions,
): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Accept-Language": locale, Accept: "application/json" },
      next: revalidate > 0 ? { revalidate } : undefined,
      cache: revalidate > 0 ? undefined : "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // The site should still render if the API is briefly unreachable.
    return null;
  }
}

/** Client-side write. Returns the parsed body plus the HTTP status. */
export async function apiPost<T>(
  path: string,
  body: unknown,
  locale: Locale,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
      },
      body: JSON.stringify(body),
    });
    let data: T | null = null;
    try {
      data = (await response.json()) as T;
    } catch {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

/* -------- typed readers used by the pages -------- */

const list = <T>(value: T[] | null): T[] => (Array.isArray(value) ? value : []);

export const getSettings = async (locale: Locale) => {
  const rows = await apiGet<SiteSettings[]>("/site-settings/", { locale });
  return rows?.[0] ?? null;
};

export const getBanners = async (locale: Locale) =>
  list(await apiGet<Banner[]>("/banners/", { locale }));

export const getServices = async (locale: Locale) =>
  list(await apiGet<Service[]>("/services/", { locale }));

export const getService = (locale: Locale, id: string) =>
  apiGet<Service>(`/services/${id}/`, { locale });

export const getProjects = async (locale: Locale) =>
  list(await apiGet<Project[]>("/projects/", { locale }));

export const getPosts = async (locale: Locale) =>
  list(await apiGet<BlogPost[]>("/blogs/", { locale }));

export const getPost = (locale: Locale, id: string) =>
  apiGet<BlogPost>(`/blogs/${id}/`, { locale, revalidate: 0 });

export const getReviews = async (locale: Locale) =>
  list(await apiGet<CustomerReview[]>("/customer-reviews/", { locale }));

export const getSocials = async (locale: Locale) =>
  list(await apiGet<SocialLink[]>("/social-media/", { locale }));
