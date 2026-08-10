import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { SimulationProvider } from "@/sim/state/store";
import { Simulation } from "@/sim/Simulation";

export const Route = createFileRoute("/$page")({
  head: () => ({
    meta: [
      { title: "MPH8430 — Right Message, Right Channel" },
      {
        name: "description",
        content:
          "An interactive public-health communication simulation: allocate the Kaduna State campaign budget, adapt to field evidence, and defend your strategy.",
      },
      { property: "og:title", content: "MPH8430 — Right Message, Right Channel" },
      {
        property: "og:description",
        content:
          "An interactive public-health communication simulation: allocate the Kaduna State campaign budget, adapt to field evidence, and defend your strategy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  return (
    <ClientOnly fallback={<div className="viewport" />}>
      <SimulationProvider>
        <Simulation page={page} />
      </SimulationProvider>
    </ClientOnly>
  );
}
