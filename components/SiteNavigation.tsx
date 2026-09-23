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
    label: "FAQ",
    ariaLabel: "Frequently Asked Questions",
    link: "#faq",
  },
  {
    label: "Tickets",
    ariaLabel: "Reserve Sanctuary Passes",
    link: "#ticket",
  },
];

// Exact fill color of body_x_poetry_logo.png
const LOGO_GOLD = "#887E4F";

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

  // The ticket section is revealed underneath the section above it, so check
  // which element is actually painted behind the logo rather than scroll offsets.
  const [overTicket, setOverTicket] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const stack = document.elementsFromPoint(40, 45);
      const behind = stack.find((el) => !el.closest(".sm-scope"));
      setOverTicket(!!behind?.closest("#ticket"));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const logoWhite = navTheme === "white" || overTicket;

  return (
    <StaggeredMenu
      position="right"
      isFixed={true}
      items={MENU_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials={true}
      displayItemNumbering={true}
      logoUrl="/body_x_poetry_logo.png"
      logoWhite={logoWhite}
      menuButtonColor={logoWhite ? "#FFFFFF" : LOGO_GOLD}
      openMenuButtonColor="#2C2C2C"
      changeMenuColorOnOpen={true}
      colors={["#D4C5A9", "#8DA388", "#2A3723"]}
      accentColor="#8DA388"
    />
  );
}
