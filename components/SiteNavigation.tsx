"use client";

import { useState, useEffect } from "react";
import StaggeredMenu, {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from "@/components/StaggeredMenu";

const MENU_ITEMS: StaggeredMenuItem[] = [
  {
    label: "Experience",
    ariaLabel: "The Sanctuary Experience",
    link: "#experience",
  },
  {
    label: "The Gathering",
    ariaLabel: "The Gathering Schedule & Journey",
    link: "#details",
  },
  {
    label: "Tickets",
    ariaLabel: "Reserve Sanctuary Passes",
    link: "#ticket",
  },
];

const SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Spotify", link: "https://spotify.com" },
  { label: "Journal", link: "#" },
];

export default function SiteNavigation() {
  const [navTheme, setNavTheme] = useState<"dark" | "white">("white");

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: "dark" | "white" }>;
      if (customEvent.detail?.theme) {
        setNavTheme(customEvent.detail.theme);
      }
    };

    window.addEventListener("nav-theme-change", handleThemeChange);
    return () =>
      window.removeEventListener("nav-theme-change", handleThemeChange);
  }, []);

  const isWhite = navTheme === "white";

  return (
    <StaggeredMenu
      position="right"
      isFixed={true}
      items={MENU_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials={true}
      displayItemNumbering={true}
      logoUrl={isWhite ? "/Logo white.png" : "/Logo black.png"}
      menuButtonColor={isWhite ? "#FFFFFF" : "#2C2C2C"}
      openMenuButtonColor="#2C2C2C"
      changeMenuColorOnOpen={true}
      colors={["#D4C5A9", "#8DA388", "#2A3723"]}
      accentColor="#8DA388"
    />
  );
}
