"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/movies", label: "Movies" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-20 rounded-lg border border-gray-800 bg-gray-900/60 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Admin
            </h2>
            <nav className="space-y-1">
              {nav.map((n) => {
                const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={
                      "block rounded px-3 py-2 text-sm transition-colors " +
                      (active
                        ? "bg-blue-600 text-white"
                        : "text-gray-200 hover:bg-gray-800 hover:text-white")
                    }
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4 md:p-6">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

