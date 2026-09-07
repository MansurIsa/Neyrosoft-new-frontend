/** Shapes returned by the Django API. Translated fields arrive already
 *  resolved into `title` / `description` based on the Accept-Language header,
 *  with the per-language variants alongside them. */

export interface SiteSettings {
  id: number;
  logo: string;
  favicon: string;
  tel_number: string;
  email: string;
  location: string;
  whatsapp: string;
  map_embed_url: string;
  working_hours: string;
  last_news_image: string | null;
  last_news_description: string;
  about_small_title: string;
  about_big_title: string;
  about_description: string;
  about_image: string | null;
  about_count_first: number;
  about_count_second: number;
  about_count_third: number;
  about_count_fourth: number;
  about_count_first_title: string;
  about_count_second_title: string;
  about_count_third_title: string;
  about_count_fourth_title: string;
  our_mission_title: string;
  our_mission_description: string;
  our_view_title: string;
  our_view_description: string;
  our_values_title: string;
  our_values_description: string;
  contact_description: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string | null;
  order: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  slug: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  link: string;
  category: string;
  order: number;
}

export interface CustomerReview {
  id: number;
  title: string;
  review: string;
  image: string | null;
  star_rating: number;
  company: string;
}

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string | null;
  blog_type: string;
  view_count: number;
  blog_date: string;
}

export interface SocialLink {
  id: number;
  title: string;
  icon: string;
  url: string;
  order: number;
}

/* ---- calculator ---- */

export interface ProjectType {
  id: number;
  title: string;
  description: string;
  icon: string;
  base_price: string;
  base_duration_days: number;
  price_per_page: string;
  price_per_language: string;
  order: number;
}

export interface ProjectFeature {
  id: number;
  title: string;
  description: string;
  price: string;
  duration_days: number;
  project_types: number[];
  is_default: boolean;
  order: number;
}

export interface MultiplierOption {
  id: number;
  title: string;
  description: string;
  price_multiplier: string;
  duration_multiplier: string;
  order: number;
}

export interface CalculatorConfig {
  currency: string;
  range_percent: number;
  project_types: ProjectType[];
  features: ProjectFeature[];
  design_levels: MultiplierOption[];
  timelines: MultiplierOption[];
}

export interface EstimateLine {
  label: string;
  amount: string;
}

export interface Estimate {
  currency: string;
  price_min: string;
  price_max: string;
  price_mid: string;
  duration_days: number;
  breakdown: EstimateLine[];
}

export interface EstimatePayload {
  project_type: number;
  features: number[];
  design_level: number | null;
  timeline: number | null;
  page_count: number;
  language_count: number;
}

export interface PriceRequestPayload extends EstimatePayload {
  name: string;
  email: string;
  telephone: string;
  company?: string;
  note?: string;
}

/* ---- contact & chat ---- */

export interface ContactPayload {
  name: string;
  surname: string;
  telephone: string;
  email: string;
  subject: string;
  message: string;
}

export interface ChatReply {
  session_id: string;
  answer: string;
  quick_replies: string[];
  matched: string | null;
}
