/* METRIC LOOP — LogoLoop-style marquee for the HUD metric strip.

   Metrics scroll leftwards inside a masked region so no chip ever escapes the
   glass HUD card. If one sequence already fits the container we render it once,
   statically — scrolling a strip that fits would be pointless motion. */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Metric, type MetricSpec } from "./Metric";

const SMOOTH_TAU = 0.25;
const COPY_HEADROOM = 2;

export function MetricLoop({
  metrics,
  speed = 34,
  reducedMotion = false,
}: {
  metrics: MetricSpec[];
  /** Pixels per second. */
  speed?: number;
  reducedMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hovered, setHovered] = useState(false);

  const measure = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect().width ?? 0;
    setContainerWidth(cw);
    setSeqWidth(Math.ceil(sw));
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, metrics]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (seqRef.current) observer.observe(seqRef.current);
    return () => observer.disconnect();
  }, [measure]);

  /* Overflowing means one sequence is wider than the visible strip. */
  const overflowing = seqWidth > 0 && containerWidth > 0 && seqWidth > containerWidth + 1;
  const animated = overflowing && !reducedMotion;

  const copyCount = useMemo(() => {
    if (!animated || seqWidth <= 0) return 1;
    return Math.max(2, Math.ceil(containerWidth / seqWidth) + COPY_HEADROOM);
  }, [animated, containerWidth, seqWidth]);

  /* rAF loop with eased velocity so hover pause/resume glides. */
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (!animated || seqWidth <= 0) {
      track.style.transform = "translate3d(0, 0, 0)";
      offsetRef.current = 0;
      velocityRef.current = 0;
      return;
    }

    let raf = 0;
    let last: number | null = null;

    const tick = (t: number) => {
      if (last === null) last = t;
      const dt = Math.max(0, t - last) / 1000;
      last = t;

      const target = hovered ? 0 : speed;
      velocityRef.current +=
        (target - velocityRef.current) * (1 - Math.exp(-dt / SMOOTH_TAU));

      let next = offsetRef.current + velocityRef.current * dt;
      next = ((next % seqWidth) + seqWidth) % seqWidth;
      offsetRef.current = next;
      track.style.transform = `translate3d(${-next}px, 0, 0)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, hovered, seqWidth, speed]);

  return (
    <div
      ref={containerRef}
      className={`metric-loop${animated ? " is-looping" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={trackRef} className="metric-loop__track">
        {Array.from({ length: copyCount }, (_, copy) => (
          <div
            key={copy}
            className="metric-group metric-loop__seq"
            ref={copy === 0 ? seqRef : undefined}
            aria-hidden={copy > 0}
          >
            {metrics.map((m) => (
              <Metric key={m.label} {...m} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
