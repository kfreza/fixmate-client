"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboardIcon, LogOutIcon, MenuIcon, UserPenIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { cs_getDashboardPath } from "@/lib/cs_constants";
import Cs_Logo from "@/app/ui/Logo";
import Cs_ThemeToggle from "@/app/ui/ThemeToggle";
import Cs_RoleBadge from "@/app/ui/RoleBadge";
import Cs_UserMenu, { useSignOut } from "@/app/ui/UserMenu";

const cs_data = {
  menuItems: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/about" },
  ],
};

const Cs_Header = () => {
  const cs_pathname = usePathname();
  const { data: cs_session, isPending: cs_isPending } = useSession();
  const cs_handleSignOut = useSignOut();
  const [cs_isSticky, cs_setIsSticky] = useState(false);

  useEffect(() => {
    const cs_handleScroll = () => cs_setIsSticky(window.scrollY > 10);
    cs_handleScroll();
    window.addEventListener("scroll", cs_handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", cs_handleScroll);
  }, []);

  const cs_isActive = (cs_href: string) =>
    cs_href === "/" ? cs_pathname === "/" : cs_pathname.startsWith(cs_href);

  const cs_user = cs_session?.user;

  return (
    <header className={`cs_site_header ${cs_isSticky ? "cs_sticky_active" : ""}`}>
      <div className="cs_container flex h-18 items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Cs_Logo cs_className="justify-self-start" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {cs_data.menuItems.map((cs_item) => (
            <Link
              key={cs_item.href}
              href={cs_item.href}
              className={`cs_nav_link ${cs_isActive(cs_item.href) ? "cs_active" : ""}`}
            >
              {cs_item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Cs_ThemeToggle />

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 lg:flex">
            {cs_isPending ? (
              <Skeleton className="size-10 rounded-full" />
            ) : cs_user ? (
              <Cs_UserMenu cs_user={cs_user} />
            ) : (
              <>
                <Link href="/sign-in" className="cs_btn cs_btn_style_3 py-2.5">
                  Sign In
                </Link>
                <Link href="/sign-up" className="cs_btn cs_btn_style_1 py-2.5">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="cs_menu_toggle lg:hidden" aria-label="Open menu">
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-0">
              <SheetHeader className="border-b border-(--cs_border_color) p-5">
                <SheetTitle asChild>
                  <div>
                    <Cs_Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {cs_data.menuItems.map((cs_item) => (
                  <SheetClose asChild key={cs_item.href}>
                    <Link
                      href={cs_item.href}
                      className={`cs_mobile_nav_link ${cs_isActive(cs_item.href) ? "cs_active" : ""}`}
                    >
                      {cs_item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto border-t border-(--cs_border_color) p-4">
                {cs_user ? (
                  <div className="flex flex-col gap-1">
                    <div className="mb-3 flex flex-col gap-1.5 px-2">
                      <span className="truncate font-semibold text-(--cs_heading_color)">{cs_user.name}</span>
                      <span className="truncate text-xs text-(--cs_body_color)">{cs_user.email}</span>
                      <Cs_RoleBadge cs_role={cs_user.role} />
                    </div>
                    <SheetClose asChild>
                      <Link href={cs_getDashboardPath(cs_user.role)} className="cs_mobile_nav_link">
                        <LayoutDashboardIcon className="size-4" /> Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dashboard/profile" className="cs_mobile_nav_link">
                        <UserPenIcon className="size-4" /> Update Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button type="button" onClick={cs_handleSignOut} className="cs_mobile_nav_link text-destructive">
                        <LogOutIcon className="size-4" /> Sign Out
                      </button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <SheetClose asChild>
                      <Link href="/sign-in" className="cs_btn cs_btn_style_3">
                        Sign In
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/sign-up" className="cs_btn cs_btn_style_1">
                        Sign Up
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Cs_Header;
