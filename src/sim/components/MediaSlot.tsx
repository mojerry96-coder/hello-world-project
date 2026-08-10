/* Media slots for the 23 stills and 6 videos.

   Media has not been generated yet (Phase 1-3). Until a file exists at
   public/media/<src>, these render a labelled placeholder carrying the asset ID
   and the reserved-composition note, so layout and interaction can be built and
   QA'd now. Dropping the real file in makes the placeholder disappear with no
   code change. */

import { useState, type CSSProperties } from "react";
import { box, type Box } from "../design/layout";
import { typeStyle } from "../design/type";

type Props = {
  id: string;
  src: string;
  alt: string;
  frame: Box;
  /** focal point, e.g. "62% 48%" */
  objectPosition?: string;
  style?: CSSProperties;
};

function Placeholder({ id, alt }: { id: string; alt: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 8,
        padding: 24,
        background:
          "repeating-linear-gradient(135deg, #1b1c18 0 18px, #1f201b 18px 36px)",
      }}
      aria-hidden="true"
    >
      <span style={typeStyle("label", { color: "rgba(201,104,52,.72)" })}>{id}</span>
      <span
        style={typeStyle("bodySmall", {
          color: "rgba(238,228,213,.34)",
          maxWidth: 520,
        })}
      >
        {alt}
      </span>
    </div>
  );
}

export function MediaSlot({ id, src, alt, frame, objectPosition, style }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div style={box(frame, { overflow: "hidden", ...style })}>
      {failed ? (
        <Placeholder id={id} alt={alt} />
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}media/${src}`}
          alt={alt}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: objectPosition ?? "center",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

type VideoProps = Props & {
  onEnded?: () => void;
  muted?: boolean;
  autoPlay?: boolean;
  poster?: string;
  /** Gives the caller the element, so a page can drive timing off playback. */
  videoRef?: React.Ref<HTMLVideoElement>;
  /** Rewind to 0 once metadata is ready — browsers otherwise resume a cached
      media resource wherever it last stopped, which breaks a replay. */
  restart?: boolean;
  /** Fired when playback is blocked (e.g. unmuted autoplay policy). */
  onBlocked?: () => void;
};

export function VideoSlot({
  id,
  src,
  alt,
  frame,
  onEnded,
  muted = false,
  autoPlay = true,
  poster,
  style,
  videoRef,
  restart = false,
  onBlocked,
}: VideoProps) {
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);

  // With no media present, fire onEnded so the page timeline still advances
  // and the build stays testable end-to-end.
  if (failed) {
    return (
      <div style={box(frame, { overflow: "hidden", ...style })}>
        <Placeholder id={id} alt={alt} />
      </div>
    );
  }

  return (
    <div style={box(frame, { overflow: "hidden", ...style })}>
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}media/${src}`}
        poster={poster ? `${import.meta.env.BASE_URL}media/${poster}` : undefined}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (restart && el.currentTime > 0) el.currentTime = 0;
          if (autoPlay) {
            // An unmuted autoplay can be refused; tell the page so it can offer
            // a play control rather than sitting on a frozen poster.
            void el.play().catch(() => onBlocked?.());
          }
        }}
        onEnded={() => {
          setEnded(true);
          onEnded?.();
        }}
        onError={() => {
          setFailed(true);
          onEnded?.();
        }}
        aria-label={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {/* Hold the extracted final frame over the paused video so the cut to the
          static page has no visible jump (spec: Page 01 hold, Page 10 freeze). */}
      {ended && poster && (
        <img
          src={`${import.meta.env.BASE_URL}media/${poster}`}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
