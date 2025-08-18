"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, MouseEvent, useEffect, useState } from "react";

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
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // When the route updates to the target, clear pending state
  useEffect(() => {
    if (!pendingHref) return;
    const reached = pathname === pendingHref || (pendingHref !== "/admin" && pathname.startsWith(pendingHref));
    if (reached) setPendingHref(null);
  }, [pathname, pendingHref]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Prevent spamming while a navigation is in-flight
    if (pendingHref) {
      e.preventDefault();
      return;
    }
    // Avoid redundant navigation to the same active route
    const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
    if (isActive) return;
    e.preventDefault();
    setPendingHref(href);
    router.push(href);
  };

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
                const isPending = pendingHref === n.href;
                const isDisabled = !!pendingHref && !isPending;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    prefetch={false}
                    onClick={(e) => handleNavClick(e, n.href)}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    className={
                      "relative block rounded px-3 py-2 text-sm transition-colors " +
                      (isDisabled
                        ? "cursor-not-allowed opacity-50 "
                        : "") +
                      (active
                        ? "bg-blue-600 text-white"
                        : "text-gray-200 hover:bg-gray-800 hover:text-white")
                    }
                  >
                    {n.label}
                    {isPending && (
                      <span
                        aria-hidden
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-transparent"
                      />
                    )}
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

