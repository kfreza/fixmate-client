"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, LogOutIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CS_ROLES, type Cs_Role } from "@/lib/cs_constants";
import { CS_DASHBOARD_NAV, CS_PROFILE_NAV, CS_SIDEBAR_COOKIE, cs_isNavActive, type Cs_NavItem } from "@/lib/cs_dashboardNav";
import Cs_Logo from "@/app/ui/Logo";
import Cs_ThemeToggle from "@/app/ui/ThemeToggle";
import Cs_RoleBadge from "@/app/ui/RoleBadge";
import Cs_UserMenu, { useSignOut, type Cs_MenuUser } from "@/app/ui/UserMenu";

type Cs_DashboardShellProps = {
  cs_user: Cs_MenuUser;
  cs_initialCollapsed: boolean;
  children: React.ReactNode;
};

type Cs_NavListProps = {
  cs_items: Cs_NavItem[];
  cs_pathname: string;
  cs_isCollapsed?: boolean;
  cs_inSheet?: boolean;
};

// Shared by the desktop sidebar and the mobile sheet
const Cs_NavList = ({ cs_items, cs_pathname, cs_isCollapsed = false, cs_inSheet = false }: Cs_NavListProps) => {
  const cs_links = [...cs_items, CS_PROFILE_NAV];
  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {cs_links.map((cs_item) => {
        const cs_isActive = cs_isNavActive(cs_item, cs_pathname, cs_items);
        const cs_link = (
          <Link
            key={cs_item.href}
            href={cs_item.href}
            title={cs_isCollapsed ? cs_item.label : undefined}
            aria-current={cs_isActive ? "page" : undefined}
            className={`cs_sidebar_link ${cs_isActive ? "cs_active" : ""}`}
          >
            <cs_item.icon className="size-5 shrink-0" />
            <span className="cs_sidebar_label">{cs_item.label}</span>
          </Link>
        );
        return cs_inSheet ? (
          <SheetClose asChild key={cs_item.href}>
            {cs_link}
          </SheetClose>
        ) : (
          cs_link
        );
      })}
    </nav>
  );
};

const Cs_DashboardShell = ({ cs_user, cs_initialCollapsed, children }: Cs_DashboardShellProps) => {
  const cs_pathname = usePathname();
  const cs_handleSignOut = useSignOut();
  const [cs_isCollapsed, cs_setIsCollapsed] = useState(cs_initialCollapsed);

  const cs_role: Cs_Role = CS_ROLES.includes(cs_user.role as Cs_Role) ? (cs_user.role as Cs_Role) : "customer";
  const cs_items = CS_DASHBOARD_NAV[cs_role];
  const cs_title =
    [...cs_items, CS_PROFILE_NAV].find((cs_item) => cs_isNavActive(cs_item, cs_pathname, cs_items))?.label ?? "Dashboard";

  // Cookie so the server renders the same width on the next load
  const cs_toggleCollapsed = () => {
    const cs_next = !cs_isCollapsed;
    cs_setIsCollapsed(cs_next);
    document.cookie = `${CS_SIDEBAR_COOKIE}=${cs_next ? 1 : 0}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className={`cs_sidebar ${cs_isCollapsed ? "cs_collapsed" : ""}`}>
        <div className="flex h-18 items-center border-b border-(--cs_border_color) px-5">
          <Cs_Logo />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6 overflow-y-auto p-3">
          <Cs_NavList cs_items={cs_items} cs_pathname={cs_pathname} cs_isCollapsed={cs_isCollapsed} />
          <div className="flex flex-col gap-1 border-t border-(--cs_border_color) pt-3">
            <Link href="/" title={cs_isCollapsed ? "Back to Home" : undefined} className="cs_sidebar_link">
              <HomeIcon className="size-5 shrink-0" />
              <span className="cs_sidebar_label">Back to Home</span>
            </Link>
            <button
              type="button"
              onClick={cs_handleSignOut}
              title={cs_isCollapsed ? "Sign Out" : undefined}
              className="cs_sidebar_link text-destructive hover:text-destructive"
            >
              <LogOutIcon className="size-5 shrink-0" />
              <span className="cs_sidebar_label">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="cs_dashboard_topbar">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger className="cs_menu_toggle lg:hidden" aria-label="Open dashboard menu">
                <MenuIcon className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[82%] max-w-xs gap-0 p-0">
                <SheetHeader className="border-b border-(--cs_border_color) p-5">
                  <SheetTitle asChild>
                    <div>
                      <Cs_Logo />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-1 flex-col justify-between gap-6 overflow-y-auto p-3">
                  <Cs_NavList cs_items={cs_items} cs_pathname={cs_pathname} cs_inSheet />
                  <div className="flex flex-col gap-1 border-t border-(--cs_border_color) pt-3">
                    <SheetClose asChild>
                      <Link href="/" className="cs_sidebar_link">
                        <HomeIcon className="size-5" /> Back to Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button type="button" onClick={cs_handleSignOut} className="cs_sidebar_link text-destructive">
                        <LogOutIcon className="size-5" /> Sign Out
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <button
              type="button"
              onClick={cs_toggleCollapsed}
              aria-label={cs_isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={cs_isCollapsed}
              className="cs_menu_toggle hidden lg:inline-flex"
            >
              {cs_isCollapsed ? <PanelLeftOpenIcon className="size-5" /> : <PanelLeftCloseIcon className="size-5" />}
            </button>

            <h1 className="truncate font-heading text-lg font-bold text-(--cs_heading_color) md:text-xl">{cs_title}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="cs_btn cs_btn_style_3 hidden h-10 px-3.5 py-0 sm:inline-flex" aria-label="Back to Home">
              <HomeIcon className="size-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Cs_ThemeToggle />
            <div className="hidden min-w-0 flex-col items-end gap-1 text-right md:flex">
              <span className="max-w-40 truncate text-sm font-semibold text-(--cs_heading_color)">{cs_user.name}</span>
              <Cs_RoleBadge cs_role={cs_role} />
            </div>
            <Cs_UserMenu cs_user={cs_user} />
          </div>
        </header>

        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Cs_DashboardShell;
