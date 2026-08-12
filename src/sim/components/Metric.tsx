/* A single HUD metric: label, value, optional 0–1 track.
   Lives on its own so both the marquee and the page chrome can use it without
   importing a page shell. */

export type MetricSpec = {
  label: string;
  /** Rendered text, e.g. "62%" or "₦180M". */
  display: string;
  /** 0–1 track fill. Omit to hide the track. */
  fill?: number;
  warning?: boolean;
};

export function Metric({ label, display, fill, warning }: MetricSpec) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className={`metric-value${warning ? " metric-warning" : ""}`}>
        {display}
      </span>
      {fill !== undefined && (
        <span className="metric-track">
          <span
            className={`metric-fill${warning ? " metric-fill-warning" : ""}`}
            style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
          />
        </span>
      )}
    </div>
  );
}
