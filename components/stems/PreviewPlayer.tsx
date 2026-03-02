"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicStemOffer } from "@/lib/stems";

type PreviewPlayerProps = {
  title?: string;
  artistName?: string;
  stems: PublicStemOffer[];
};

type WaveformPeaks = {
  mins: number[];
  maxs: number[];
};

type StemWaveformProps = {
  peaks: WaveformPeaks | null;
  color: string;
  currentTime: number;
  duration: number;
  sectionModeEnabled: boolean;
  sectionCount: number;
  onSeek: (time: number) => void;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const stemPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FF8C42",
  "#98D8C8",
];

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const buildWaveformPeaks = (samples: Float32Array, bucketCount = 420): WaveformPeaks => {
  if (!samples.length || bucketCount <= 0) {
    return { mins: [], maxs: [] };
  }

  const safeBuckets = Math.min(bucketCount, samples.length);
  const bucketSize = Math.max(1, Math.floor(samples.length / safeBuckets));
  const mins: number[] = [];
  const maxs: number[] = [];

  for (let bucketIndex = 0; bucketIndex < safeBuckets; bucketIndex += 1) {
    const start = bucketIndex * bucketSize;
    const end = Math.min(start + bucketSize, samples.length);
    let min = 1;
    let max = -1;

    for (let i = start; i < end; i += 1) {
      const value = samples[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    mins.push(min);
    maxs.push(max);
  }

  return { mins, maxs };
};

function StemWaveform({
  peaks,
  color,
  currentTime,
  duration,
  sectionModeEnabled,
  sectionCount,
  onSeek,
}: StemWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const waveformProgress = duration > 0 ? clamp01(currentTime / duration) : 0;

  const snapProgress = useCallback(
    (progress: number) => {
      if (!sectionModeEnabled || sectionCount <= 0) return progress;
      const step = 1 / sectionCount;
      const index = Math.min(sectionCount - 1, Math.floor(clamp01(progress) * sectionCount));
      return clamp01(index * step);
    },
    [sectionCount, sectionModeEnabled],
  );

  const getRawProgressFromClientX = useCallback((clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0) return null;
    return clamp01((clientX - rect.left) / rect.width);
  }, []);

  const seekFromClientX = useCallback(
    (clientX: number, element: HTMLDivElement) => {
      if (!Number.isFinite(duration) || duration <= 0) return;
      const raw = getRawProgressFromClientX(clientX, element);
      if (raw === null) return;
      const nextProgress = snapProgress(raw);
      setDragProgress(nextProgress);
      onSeek(nextProgress * duration);
    },
    [duration, getRawProgressFromClientX, onSeek, snapProgress],
  );

  const currentSectionIndex =
    sectionModeEnabled && sectionCount > 0
      ? Math.min(sectionCount - 1, Math.floor(waveformProgress * sectionCount))
      : -1;

  const hoverSectionIndex =
    sectionModeEnabled && sectionCount > 0 && hoverProgress !== null
      ? Math.min(sectionCount - 1, Math.floor(clamp01(hoverProgress) * sectionCount))
      : -1;

  const pressedSectionIndex =
    sectionModeEnabled && sectionCount > 0 && dragProgress !== null
      ? Math.min(sectionCount - 1, Math.floor(clamp01(dragProgress) * sectionCount))
      : -1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      context.fillStyle = "rgba(2, 6, 23, 0.4)";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.16)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      if (!peaks || peaks.mins.length === 0 || peaks.maxs.length === 0) return;

      const pointCount = Math.min(peaks.mins.length, peaks.maxs.length);
      const amp = height / 2;
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.beginPath();

      for (let x = 0; x < width; x += 1) {
        const index = Math.min(pointCount - 1, Math.floor((x / width) * pointCount));
        const min = peaks.mins[index];
        const max = peaks.maxs[index];
        const y1 = (1 + min) * amp;
        const y2 = (1 + max) * amp;
        context.moveTo(x + 0.5, y1);
        context.lineTo(x + 0.5, y2);
      }

      context.stroke();
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [color, peaks]);

  return (
    <div className="relative h-12 overflow-hidden rounded-lg border border-white/15 bg-black/35">
      <canvas ref={canvasRef} className="h-full w-full opacity-95" />

      {sectionModeEnabled && sectionCount > 0 ? (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: sectionCount }).map((_, sectionIndex) => {
            const widthPercent = 100 / sectionCount;
            const isCurrent = sectionIndex === currentSectionIndex;
            const isHoverOrPressed = sectionIndex === hoverSectionIndex || sectionIndex === pressedSectionIndex;

            return (
              <div
                key={sectionIndex}
                className="absolute inset-y-0"
                style={{
                  left: `${sectionIndex * widthPercent}%`,
                  width: `${widthPercent}%`,
                  background: isHoverOrPressed
                    ? `${color}33`
                    : isCurrent
                      ? `${color}1f`
                      : "transparent",
                  borderRight:
                    sectionIndex < sectionCount - 1
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "none",
                }}
              />
            );
          })}
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: `${waveformProgress * 100}%`,
          background: `${color}1f`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/85"
        style={{ left: `${waveformProgress * 100}%` }}
      />
      {hoverProgress !== null ? (
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-cyan-300/85"
          style={{ left: `${hoverProgress * 100}%` }}
        />
      ) : null}

      <div
        className="absolute inset-0 z-20 cursor-pointer touch-none"
        style={{ touchAction: "none" }}
        onPointerDown={(event) => {
          event.preventDefault();
          activePointerIdRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          const raw = getRawProgressFromClientX(event.clientX, event.currentTarget);
          if (raw !== null) setHoverProgress(raw);
          seekFromClientX(event.clientX, event.currentTarget);
        }}
        onPointerMove={(event) => {
          const raw = getRawProgressFromClientX(event.clientX, event.currentTarget);
          if (raw !== null) setHoverProgress(raw);
          if (activePointerIdRef.current === event.pointerId) {
            event.preventDefault();
            seekFromClientX(event.clientX, event.currentTarget);
          }
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          if (activePointerIdRef.current === event.pointerId) {
            activePointerIdRef.current = null;
          }
          setDragProgress(null);
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          if (activePointerIdRef.current === event.pointerId) {
            activePointerIdRef.current = null;
          }
          setDragProgress(null);
        }}
        onPointerLeave={() => setHoverProgress(null)}
        onLostPointerCapture={() => {
          activePointerIdRef.current = null;
          setDragProgress(null);
        }}
      />
    </div>
  );
}

export default function PreviewPlayer({ title, artistName, stems }: PreviewPlayerProps) {
  const playableStems = useMemo(() => stems.filter((stem) => stem.previewUrl), [stems]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [loadedStemIds, setLoadedStemIds] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [soloed, setSoloed] = useState<Record<string, boolean>>({});
  const [waveforms, setWaveforms] = useState<Record<string, WaveformPeaks | null>>({});
  const [isSectionModeEnabled, setIsSectionModeEnabled] = useState(false);

  const audiosRef = useRef<HTMLAudioElement[]>([]);
  const tickRef = useRef<number | null>(null);
  const sectionCount = 8;
  const loadingProgress = playableStems.length
    ? Math.round((Object.keys(loadedStemIds).length / playableStems.length) * 100)
    : 100;
  const playheadPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  useEffect(() => {
    if (!playableStems.length) return;
    const nextVolumes: Record<string, number> = {};
    playableStems.forEach((stem) => {
      nextVolumes[stem.id] = 1;
    });
    setVolumes(nextVolumes);
  }, [playableStems]);

  useEffect(() => {
    let disposed = false;

    if (playableStems.length === 0) {
      audiosRef.current = [];
      return;
    }

    const audioContextClass =
      window.AudioContext ||
      (window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;
    const decodeContext = audioContextClass ? new audioContextClass() : null;

    const audios = playableStems.map((stem) => {
      const audio = new Audio(stem.previewUrl);
      audio.preload = "metadata";
      audio.loop = true;
      return audio;
    });
    audiosRef.current = audios;

    let remaining = audios.length;
    const durations: number[] = [];

    const completeOne = (stemId: string) => {
      setLoadedStemIds((previous) => ({ ...previous, [stemId]: true }));
      remaining -= 1;
      if (!disposed && remaining <= 0) {
        const maxDuration = Math.max(...durations, 0);
        setDuration(maxDuration);
        setIsLoaded(true);
      }
    };

    playableStems.forEach((stem) => {
      if (!decodeContext) {
        setWaveforms((previous) => ({ ...previous, [stem.id]: null }));
        return;
      }

      void (async () => {
        try {
          const response = await fetch(stem.previewUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = await decodeContext.decodeAudioData(arrayBuffer);
          const samples = buffer.getChannelData(0);
          const peaks = buildWaveformPeaks(samples);
          if (!disposed) {
            setWaveforms((previous) => ({ ...previous, [stem.id]: peaks }));
          }
        } catch {
          if (!disposed) {
            setWaveforms((previous) => ({ ...previous, [stem.id]: null }));
          }
        }
      })();
    });

    audios.forEach((audio, index) => {
      const stem = playableStems[index];
      const onMeta = () => {
        durations[index] = Number.isFinite(audio.duration) ? audio.duration : 0;
        completeOne(stem.id);
      };
      const onError = () => {
        durations[index] = 0;
        setError("One or more previews failed to load.");
        completeOne(stem.id);
      };
      audio.addEventListener("loadedmetadata", onMeta, { once: true });
      audio.addEventListener("error", onError, { once: true });
    });

    return () => {
      disposed = true;
      if (tickRef.current !== null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      audios.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audiosRef.current = [];
      if (decodeContext) {
        void decodeContext.close();
      }
    };
  }, [playableStems]);

  useEffect(() => {
    if (!isPlaying) {
      if (tickRef.current !== null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    tickRef.current = window.setInterval(() => {
      const first = audiosRef.current[0];
      if (!first) return;
      setCurrentTime(first.currentTime);
    }, 100);

    return () => {
      if (tickRef.current !== null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const hasSolo = Object.values(soloed).some(Boolean);

    audiosRef.current.forEach((audio, index) => {
      const stem = playableStems[index];
      if (!stem) return;

      let volume = volumes[stem.id] ?? 1;
      if (hasSolo) {
        volume = soloed[stem.id] ? volume : 0;
      } else if (muted[stem.id]) {
        volume = 0;
      }
      audio.volume = Math.min(Math.max(volume, 0), 1);
    });
  }, [muted, playableStems, soloed, volumes]);

  const handlePlayPause = async () => {
    if (!isLoaded || audiosRef.current.length === 0) return;

    if (isPlaying) {
      audiosRef.current.forEach((audio) => audio.pause());
      setIsPlaying(false);
      return;
    }

    try {
      await Promise.all(
        audiosRef.current.map((audio) => {
          audio.currentTime = currentTime;
          return audio.play();
        }),
      );
      setIsPlaying(true);
    } catch {
      setError("Playback was blocked by the browser. Click play again.");
    }
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration || time));
    audiosRef.current.forEach((audio) => {
      audio.currentTime = clamped;
    });
    setCurrentTime(clamped);
  };

  const handleSectionSeek = (sectionIndex: number) => {
    if (!Number.isFinite(duration) || duration <= 0) return;
    const safeSection = Math.min(Math.max(sectionIndex, 0), sectionCount - 1);
    const sectionTime = (safeSection / sectionCount) * duration;
    handleSeek(sectionTime);
  };

  const currentSectionIndex =
    isSectionModeEnabled && duration > 0
      ? Math.min(sectionCount - 1, Math.floor((currentTime / duration) * sectionCount))
      : -1;

  if (playableStems.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
        No stem previews available for this pack yet.
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(155deg,rgba(12,16,29,0.96),rgba(6,9,17,0.95))] p-4 shadow-[0_26px_70px_rgba(0,0,0,0.45)] sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_7%,rgba(246,162,26,0.16),transparent_36%),radial-gradient(circle_at_90%_8%,rgba(95,138,255,0.14),transparent_40%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-white/20 bg-black/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70">
                Stem Player
              </span>
              <span className="rounded-md border border-white/20 bg-black/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70">
                Deck A
              </span>
            </div>
            {title ? <h3 className="text-base font-bold uppercase tracking-[0.06em] text-white/95">{title}</h3> : null}
            {artistName ? <p className="text-xs text-white/60">{artistName}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSectionModeEnabled((previous) => !previous)}
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                isSectionModeEnabled
                  ? "border-[#f6a21a]/55 bg-[#f6a21a]/20 text-[#ffd89a]"
                  : "border-white/25 bg-white/10 text-white/75"
              }`}
            >
              Sections {isSectionModeEnabled ? "On" : "Off"}
            </button>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                isPlaying
                  ? "border-emerald-300/45 bg-emerald-300/18 text-emerald-100"
                  : isLoaded
                    ? "border-white/25 bg-white/10 text-white/80"
                    : "border-white/20 bg-white/5 text-white/65"
              }`}
            >
              {isPlaying ? "Playing" : isLoaded ? "Ready" : "Loading"}
            </span>
          </div>
        </header>

        <div className="rounded-xl border border-white/15 bg-black/25 p-3 sm:p-4">
          {!isLoaded ? (
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f6a21a] via-[#ffcc7a] to-[#f6a21a] transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          ) : null}

          <div className="relative mb-3 h-9 overflow-hidden rounded-lg border border-white/15 bg-black/35">
            {isSectionModeEnabled ? (
              <div className="absolute inset-0 flex">
                {Array.from({ length: sectionCount }).map((_, sectionIndex) => (
                  <button
                    key={`section-${sectionIndex}`}
                    type="button"
                    onClick={() => handleSectionSeek(sectionIndex)}
                    className="h-full flex-1 border-r border-white/10 last:border-r-0"
                    style={{
                      background:
                        sectionIndex === currentSectionIndex
                          ? "rgba(246, 162, 26, 0.22)"
                          : "transparent",
                    }}
                    aria-label={`Jump to section ${sectionIndex + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-1">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={`tick-${index}`}
                    className={`${index % 6 === 0 ? "h-4 opacity-70" : "h-2 opacity-40"} w-px bg-white`}
                  />
                ))}
              </div>
            )}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#f6a21a] shadow-[0_0_14px_rgba(246,162,26,0.9)]"
              style={{ left: `${playheadPercent}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(duration, 0)}
            step={0.01}
            value={Math.min(currentTime, Math.max(duration, 0))}
            onChange={(event) => handleSeek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#f6a21a]"
            disabled={!isLoaded}
          />

          <div className="mt-2 flex items-center justify-between text-xs text-white/65">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleSeek(0)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!isLoaded}
            >
              Restart
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className="min-w-28 rounded-xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.07em] text-[#2f2108] shadow-[0_8px_26px_rgba(246,162,26,0.35)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!isLoaded}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            {!isLoaded ? <span className="text-xs text-white/60">Loading previews...</span> : null}
          </div>
        </div>

        <div className="space-y-2.5">
          {playableStems.map((stem, trackIndex) => {
            const volume = Math.round((volumes[stem.id] ?? 1) * 100);
            const stemColor = stemPalette[trackIndex % stemPalette.length];

            return (
              <article
                key={stem.id}
                className="rounded-2xl border p-3 sm:p-4"
                style={{
                  borderColor: `${stemColor}44`,
                  background: `linear-gradient(145deg, ${stemColor}14, rgba(8, 11, 20, 0.72))`,
                  boxShadow: isPlaying && !muted[stem.id] ? `0 0 28px ${stemColor}1f` : "none",
                }}
              >
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: stemColor, boxShadow: `0 0 14px ${stemColor}` }}
                    />
                    <p className={`text-sm font-semibold ${muted[stem.id] ? "text-white/40" : "text-white/95"}`}>
                      {stem.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMuted((previous) => ({ ...previous, [stem.id]: !previous[stem.id] }))}
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] ${
                        muted[stem.id]
                          ? "border-rose-300/45 bg-rose-300/20 text-rose-100"
                          : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15"
                      }`}
                    >
                      M
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoloed((previous) => ({ ...previous, [stem.id]: !previous[stem.id] }))}
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] ${
                        soloed[stem.id]
                          ? "border-[#f6a21a]/55 bg-[#f6a21a]/22 text-[#ffd89a]"
                          : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15"
                      }`}
                    >
                      S
                    </button>
                  </div>
                </div>

                <StemWaveform
                  peaks={waveforms[stem.id] ?? null}
                  color={stemColor}
                  currentTime={currentTime}
                  duration={duration}
                  sectionModeEnabled={isSectionModeEnabled}
                  sectionCount={sectionCount}
                  onSeek={handleSeek}
                />

                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={volume}
                    onChange={(event) =>
                      setVolumes((previous) => ({ ...previous, [stem.id]: Number(event.target.value) / 100 }))
                    }
                    className="h-2 w-full cursor-pointer accent-[#f6a21a]"
                  />
                  <span className="w-12 rounded-md border border-white/15 bg-black/30 px-2 py-1 text-center text-[11px] font-semibold text-white/75">
                    {volume}%
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        <p className="text-[11px] uppercase tracking-[0.06em] text-white/45">
          Preview audio only. Full stems are delivered after purchase through Stripe or PayPal.
        </p>
      </div>
    </section>
  );
}
