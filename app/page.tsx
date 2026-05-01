"use client";

import { useEffect, useRef, useState } from "react";

const defaultVideoSrc = "/videos/video.mp4";
const fpsOptions = [1, 2, 3, 5, 8, 12] as const;

const videoTools = [
  { label: "Frame Rate", href: "#tool-frame-rate" },
  { label: "Trim Video", href: "#tool-trim-video" },
  { label: "Crop Video", href: "#tool-crop-video" },
  { label: "Resize", href: "#tool-resize-video" },
  { label: "Reverse", href: "#tool-reverse-video" },
  { label: "Freeze Frame", href: "#tool-freeze-frame" },
  { label: "Speed Ramp", href: "#tool-speed-ramp" },
  { label: "Export MP4", href: "#tool-export-mp4" },
] as const;

const imageTools = [
  { label: "Frame Rate", href: "#tool-frame-rate" },
  { label: "Crop Image", href: "#tool-crop-image" },
  { label: "Resize", href: "#tool-resize-image" },
  { label: "Grayscale", href: "#tool-grayscale" },
  { label: "Sketch", href: "#tool-sketch" },
  { label: "Posterize", href: "#tool-posterize" },
  { label: "Border Frame", href: "#tool-border-frame" },
  { label: "Export PNG", href: "#tool-export-png" },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

const toolRoadmap = [
  {
    id: "tool-trim-video",
    title: "Trim Video",
    category: "Video",
    description: "Cut the clip to a start and end range before previewing.",
  },
  {
    id: "tool-crop-video",
    title: "Crop Video",
    category: "Video",
    description: "Set a crop box so the preview focuses on the subject.",
  },
  {
    id: "tool-resize-video",
    title: "Resize Video",
    category: "Video",
    description: "Scale the output to a target resolution or aspect ratio.",
  },
  {
    id: "tool-reverse-video",
    title: "Reverse",
    category: "Video",
    description: "Play the clip backward for a mirrored effect.",
  },
  {
    id: "tool-freeze-frame",
    title: "Freeze Frame",
    category: "Video",
    description: "Hold on a single frame and turn it into a still card.",
  },
  {
    id: "tool-speed-ramp",
    title: "Speed Ramp",
    category: "Video",
    description: "Blend slow and fast sections into one motion curve.",
  },
  {
    id: "tool-export-mp4",
    title: "Export MP4",
    category: "Video",
    description: "Render the final video for download or sharing.",
  },
  {
    id: "tool-crop-image",
    title: "Crop Image",
    category: "Image",
    description: "Trim a still image to the frame you want.",
  },
  {
    id: "tool-resize-image",
    title: "Resize Image",
    category: "Image",
    description: "Change the image dimensions for layout or export.",
  },
  {
    id: "tool-grayscale",
    title: "Grayscale",
    category: "Image",
    description: "Remove color and keep the composition neutral.",
  },
  {
    id: "tool-sketch",
    title: "Sketch",
    category: "Image",
    description: "Turn the image into a line-heavy sketch style.",
  },
  {
    id: "tool-posterize",
    title: "Posterize",
    category: "Image",
    description: "Reduce tones into simpler graphic bands.",
  },
  {
    id: "tool-border-frame",
    title: "Border Frame",
    category: "Image",
    description: "Wrap the image in a clean presentation frame.",
  },
  {
    id: "tool-export-png",
    title: "Export PNG",
    category: "Image",
    description: "Save the processed still image as a PNG file.",
  },
] as const;

export default function Home() {
  const [videoSrc, setVideoSrc] = useState(defaultVideoSrc);
  const [videoName, setVideoName] = useState("public/videos/video.mp4");
  const [fps, setFps] = useState<(typeof fpsOptions)[number]>(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = fps;
    }
  }, [fps]);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      void videoRef.current.play();
      return;
    }

    videoRef.current.pause();
  }, [isPlaying, videoSrc]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPreloader(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  const loadDefaultVideo = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setHasError(false);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoSrc(defaultVideoSrc);
    setVideoName("public/videos/video.mp4");
  };

  const handlePickVideo = (file: File | null) => {
    if (!file) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setHasError(false);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoSrc(nextUrl);
    setVideoName(file.name);
  };

  return (
    <main className="min-h-screen bg-[#ece7df] text-[#111111]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_35%),linear-gradient(180deg,#f6f2eb_0%,#ece7df_40%,#e3ddd4_100%)]" />

      {showPreloader ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ece7df]/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-24 w-24 preload-mark" aria-hidden="true">
              <span className="preload-square preload-square-left" />
              <span className="preload-square preload-square-right" />
            </div>
            <p className="text-[13px] uppercase tracking-[0.22em] text-black/48">
              Loading Flipr
            </p>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav className="relative z-40 overflow-visible rounded-[1.5rem] border border-black/8 bg-white/72 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] backdrop-blur-sm sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <a href="#top" className="flex items-center gap-3">
              <span className="relative h-10 w-10" aria-hidden="true">
                <span className="absolute left-0 top-1 h-6 w-6 rounded-[0.35rem] border border-black/10 bg-black" />
                <span className="absolute right-0 bottom-1 h-6 w-6 rounded-[0.35rem] border border-black/10 bg-black" />
              </span>
              <span className="text-[15px] font-medium uppercase tracking-[0.2em] text-black/80">
                Flipr
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-2 text-[14px] text-black/60">
              <a
                href="#top"
                className="rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-black"
              >
                Home
              </a>

              <details className="group relative z-50">
                <summary className="list-none cursor-pointer rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-black [&::-webkit-details-marker]:hidden">
                  Video
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[1rem] border border-black/8 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                  {videoTools.map((tool) => (
                    <a
                      key={tool.label}
                      href={tool.href}
                      className="block rounded-[0.8rem] px-3 py-2 text-[14px] text-black/68 transition-colors hover:bg-black/5 hover:text-black"
                    >
                      {tool.label}
                    </a>
                  ))}
                </div>
              </details>

              <details className="group relative z-50">
                <summary className="list-none cursor-pointer rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-black [&::-webkit-details-marker]:hidden">
                  Image
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[1rem] border border-black/8 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                  {imageTools.map((tool) => (
                    <a
                      key={tool.label}
                      href={tool.href}
                      className="block rounded-[0.8rem] px-3 py-2 text-[14px] text-black/68 transition-colors hover:bg-black/5 hover:text-black"
                    >
                      {tool.label}
                    </a>
                  ))}
                </div>
              </details>

              <a
                href="#preview"
                className="rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-black"
              >
                Preview
              </a>

              <a
                href="#export"
                className="rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-black"
              >
                Export
              </a>
            </div>
          </div>
        </nav>

        <header
          id="top"
          className="relative z-10 rounded-[1.75rem] border border-black/8 bg-white/70 px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:px-8"
        >
          <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-black/48">
            Flipr Studio
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.8rem)] font-light leading-[0.96] tracking-[-0.06em]">
            Upload a video and preview it here.
          </h1>
          <p className="mt-4 max-w-3xl text-[1rem] leading-7 text-black/58">
            The default clip loads from{" "}
            <span className="font-medium">/videos/video.mp4</span>. You can
            replace it with your own file and see the preview update
            immediately.
          </p>
        </header>

        <section className="relative z-0 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[1.5rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
              Video source
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-[1rem] border border-black/8 bg-[#f7f4ef] px-4 py-3 text-[14px] leading-6 text-black/64">
                Default clip:{" "}
                <span className="font-medium text-black">{defaultVideoSrc}</span>
              </div>

              <div
                id="tool-frame-rate"
                className="space-y-2 rounded-[1rem] border border-black/8 bg-white px-4 py-4"
              >
                <label
                  htmlFor="frame-rate"
                  className="text-[13px] uppercase tracking-[0.16em] text-black/40"
                >
                  Frame rate editor
                </label>
                <select
                  id="frame-rate"
                  value={fps}
                  onChange={(event) =>
                    setFps(
                      Number(event.target.value) as (typeof fpsOptions)[number],
                    )
                  }
                  className="w-full rounded-[0.85rem] border border-black/10 bg-[#f7f4ef] px-3 py-2 text-[14px] text-black outline-none"
                >
                  {fpsOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} fps
                    </option>
                  ))}
                </select>
                <p className="text-[13px] leading-5 text-black/52">
                  This controls the preview playback speed.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(event) =>
                  handlePickVideo(event.target.files?.[0] ?? null)
                }
                className="block w-full rounded-[0.9rem] border border-black/10 bg-white px-4 py-3 text-[14px] text-black/72 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-white"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-black px-4 py-3 text-[15px] font-medium text-white transition-colors hover:bg-black/85"
              >
                Upload a video
              </button>

              <button
                type="button"
                onClick={loadDefaultVideo}
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-[15px] font-medium text-black transition-colors hover:bg-black/4"
              >
                Use default preview
              </button>

              <div className="rounded-[1rem] border border-black/8 bg-[#f7f4ef] px-4 py-3">
                <p className="text-[13px] uppercase tracking-[0.16em] text-black/40">
                  Current file
                </p>
                <p className="mt-2 break-words text-[14px] leading-6 text-black/68">
                  {videoName}
                </p>
              </div>
            </div>
          </aside>

          <section
            id="preview"
            className="rounded-[1.5rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
              <div>
                <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
                  Preview
                </p>
                <p className="mt-1 text-[15px] text-black/58">
                  The selected clip plays below.
                </p>
              </div>
              <p className="text-[14px] text-black/48">
                {hasError ? "Preview unavailable" : "Ready"}
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-black/8 bg-black">
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                playsInline
                preload="metadata"
                className="aspect-video w-full object-cover"
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedData={() => {
                  setIsLoading(false);
                  setHasError(false);
                  setDuration(videoRef.current?.duration ?? 0);
                  setCurrentTime(videoRef.current?.currentTime ?? 0);
                  if (videoRef.current) {
                    videoRef.current.playbackRate = fps;
                  }
                }}
                onLoadedMetadata={() => {
                  setDuration(videoRef.current?.duration ?? 0);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[14px] text-black/52">
                <p>
                  Preview source: <span className="text-black">{videoName}</span>
                </p>
                <p>{isLoading ? "Loading preview..." : "Preview ready"}</p>
              </div>

              <div className="rounded-[1.1rem] border border-black/8 bg-[#f7f4ef] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-black/85"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>

                  <div className="text-[14px] text-black/58">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  <div className="ml-auto text-[14px] text-black/58">
                    {fps} fps
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.01}
                  value={currentTime}
                  onChange={(event) => {
                    const nextTime = Number(event.target.value);
                    setCurrentTime(nextTime);
                    if (videoRef.current) {
                      videoRef.current.currentTime = nextTime;
                    }
                  }}
                  className="mt-4 w-full accent-black"
                />
              </div>
            </div>
          </section>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
              Video tools
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {videoTools.map((tool) => (
                <a
                  key={tool.label}
                  href={tool.href}
                  className="rounded-[1rem] border border-black/8 bg-[#f7f4ef] px-4 py-3 text-[15px] text-black/70 transition-colors hover:bg-black/4 hover:text-black"
                >
                  {tool.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
              Image tools
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {imageTools.map((tool) => (
                <a
                  key={tool.label}
                  href={tool.href}
                  className="rounded-[1rem] border border-black/8 bg-[#f7f4ef] px-4 py-3 text-[15px] text-black/70 transition-colors hover:bg-black/4 hover:text-black"
                >
                  {tool.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
                Tool roadmap
              </p>
              <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-light tracking-[-0.05em] text-black">
                Build each tool one at a time.
              </h2>
            </div>
            <p className="max-w-sm text-right text-[14px] leading-6 text-black/52">
              These sections give the nav and footer links a target now, and we
              can turn each card into a real editor as we go.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toolRoadmap.map((tool) => (
              <article
                key={tool.id}
                id={tool.id}
                className="rounded-[1.35rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]"
              >
                <p className="text-[12px] uppercase tracking-[0.18em] text-black/38">
                  {tool.category}
                </p>
                <h3 className="mt-3 text-[22px] font-medium tracking-[-0.04em] text-black">
                  {tool.title}
                </h3>
                <p className="mt-2 text-[15px] leading-6 text-black/58">
                  {tool.description}
                </p>
                <a
                  href="#top"
                  className="mt-4 inline-flex rounded-full border border-black/10 bg-[#f7f4ef] px-4 py-2 text-[14px] text-black/70 transition-colors hover:bg-black/4 hover:text-black"
                >
                  Back to top
                </a>
              </article>
            ))}
          </div>
        </section>

        <footer
          id="export"
          className="rounded-[1.5rem] border border-black/8 bg-white/72 px-6 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
                Video
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {videoTools.map((tool) => (
                  <a
                    key={tool.label}
                    href={tool.href}
                    className="rounded-[0.9rem] px-3 py-2 text-[14px] text-black/65 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    {tool.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] text-black/40">
                Images
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {imageTools.map((tool) => (
                  <a
                    key={tool.label}
                    href={tool.href}
                    className="rounded-[0.9rem] px-3 py-2 text-[14px] text-black/65 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    {tool.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
