"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboardIcon, LogOutIcon, UserPenIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { cs_clearToken } from "@/lib/cs_api";
import { cs_getDashboardPath } from "@/lib/cs_constants";
import Cs_RoleBadge from "@/app/ui/RoleBadge";

export interface Cs_MenuUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
}

export const cs_getInitials = (cs_name: string) =>
  cs_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((cs_part) => cs_part[0]?.toUpperCase())
    .join("");

// Shared sign out (navbar + mobile menu)
export const useSignOut = () => {
  const cs_router = useRouter();
  return async () => {
    await signOut();
    cs_clearToken();
    toast.success("Signed out successfully");
    cs_router.push("/");
    cs_router.refresh();
  };
};

const Cs_UserMenu = ({ cs_user }: { cs_user: Cs_MenuUser }) => {
  const cs_handleSignOut = useSignOut();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="cs_avatar_btn" aria-label="Open user menu">
        <Avatar className="size-10">
          <AvatarImage src={cs_user.image ?? undefined} alt={cs_user.name} />
          <AvatarFallback className="bg-(--cs_primary_color) font-semibold text-(--cs_primary_text_color)">
            {cs_getInitials(cs_user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-1.5 py-2">
          <span className="truncate text-sm font-semibold text-(--cs_heading_color)">{cs_user.name}</span>
          <span className="truncate text-xs font-normal text-(--cs_body_color)">{cs_user.email}</span>
          <Cs_RoleBadge cs_role={cs_user.role} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={cs_getDashboardPath(cs_user.role)}>
            <LayoutDashboardIcon /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserPenIcon /> Update Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={cs_handleSignOut}>
          <LogOutIcon /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Cs_UserMenu;
