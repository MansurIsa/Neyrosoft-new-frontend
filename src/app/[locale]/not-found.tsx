import Link from "next/link";

import { getDictionary } from "@/i18n/config";

export default function NotFound() {
  // A not-found page can't read route params, so it falls back to Azerbaijani.
  const dict = getDictionary("az");
  return (
    <div className="mx-auto max-w-6xl px-5 py-28 lg:px-8">
      <div className="card max-w-lg p-8 sm:p-12">
        <p className="text-signal font-display text-6xl font-semibold">404</p>
        <h1 className="text-body mt-4 text-3xl">{dict.common.notFoundTitle}</h1>
        <p className="text-muted mt-3 leading-relaxed">{dict.common.notFoundLead}</p>
        <Link href="/az" className="btn btn-primary mt-7">
          {dict.common.goHome}
        </Link>
      </div>
    </div>
  );
}
