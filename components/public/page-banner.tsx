"use client";

import Link from "next/link";

export type PageBannerProps = {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
};

export function PageBanner({ title, breadcrumb }: PageBannerProps) {
  return (
    <div className="w-full bg-[#003B8E] py-24">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="text-white font-urbanist">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-6 flex items-center justify-center gap-2 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              {breadcrumb.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span>-</span>
                  {item.href ? (
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
          <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        </div>
      </div>
    </div>
  );
}
