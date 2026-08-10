import { createFileRoute, redirect } from "@tanstack/react-router";

/* The app's entry is the simulation. Land visitors on the first scene. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$page", params: { page: "opening" }, replace: true });
  },
});
