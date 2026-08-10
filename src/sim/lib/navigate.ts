/* Shim for the simulation's react-router-dom useNavigate call sites.
   The standalone app used `useNavigate()` from react-router-dom and called
   `navigate("/opening")`; the TanStack port keeps that calling convention by
   mapping the string path onto the `/$page` dynamic route. */

import { useNavigate as useTanStackNavigate } from "@tanstack/react-router";

export function useNavigate() {
  const navigate = useTanStackNavigate();
  return (to: string) => {
    const page = to.replace(/^\//, "");
    navigate({ to: "/$page", params: { page } });
  };
}
