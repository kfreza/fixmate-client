"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const cs_subscribe = () => () => {};

const Cs_ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  // false on server, true after hydration (avoids icon mismatch)
  const cs_isMounted = useSyncExternalStore(cs_subscribe, () => true, () => false);
  const cs_isDark = cs_isMounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(cs_isDark ? "light" : "dark")}
      aria-label={cs_isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="cs_theme_toggle inline-flex size-10 items-center justify-center rounded-xl border border-(--cs_border_color) bg-(--cs_card_color) text-(--cs_heading_color) transition-colors hover:text-(--cs_primary_color)"
    >
      {cs_isDark ? <SunIcon className="size-[18px]" /> : <MoonIcon className="size-[18px]" />}
    </button>
  );
};

export default Cs_ThemeToggle;
