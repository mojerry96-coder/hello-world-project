import { createFileRoute, redirect } from "@tanstack/react-router";
import { INTRO_SEEN_KEY } from "@/sim/pages/PageIntro";

/* The app's entry is the simulation. First-time visitors get the 30-second
   orientation brief; anyone who has already seen it goes straight to Page 1.
   The check is client-only — during SSR there is no localStorage, so we send
   everyone to the brief and let it redirect instantly if already seen. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    let seen = false;
    if (typeof window !== "undefined") {
      try {
        seen = window.localStorage.getItem(INTRO_SEEN_KEY) === "1";
      } catch {
        seen = false;
      }
    }
    throw redirect({
      to: "/$page",
      params: { page: seen ? "opening" : "intro" },
      replace: true,
    });
  },
});
