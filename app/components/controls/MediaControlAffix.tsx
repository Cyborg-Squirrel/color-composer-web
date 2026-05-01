import { ActionIcon, Group } from "@mantine/core";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, StopIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LightEffectStatus } from "~/api/effects/effects_api";
import { useAppShellRef } from "~/provider/AppShellContext";
import styles from "./MediaControlAffix.module.css";

interface MediaControlPortalProps {
  anchorRef: React.RefObject<HTMLElement>;
  parentRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  isMobile: boolean;
}

function MediaControlPortal({ anchorRef, parentRef, children, isMobile }: MediaControlPortalProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!parentRef.current) return;
    if (!anchorRef.current) return;

    const updateCoords = () => {
      const parent = parentRef.current?.getBoundingClientRect();
      setCoords({
        top: (window.innerHeight * (isMobile ? 0.8 : 0.9)) + window.scrollY,
        left: parent.left + (parent.width / 2),
      });
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords);
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [anchorRef, parentRef]);

  return createPortal(
    <div
      className={styles.portalContainer}
      style={{
        top: coords.top,
        left: coords.left,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

interface SwitchesCardProps {
  statuses: LightEffectStatus[];
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onDelete?: () => void;
}

function SwitchesCard({ statuses, onPlay, onPause, onStop, onDelete }: SwitchesCardProps) {
  const showPause = !statuses.includes(LightEffectStatus.Paused) && !statuses.includes(LightEffectStatus.Stopped);

  return (
    <Group grow justify="center" onClick={(e) => e.stopPropagation()}>
      <ActionIcon id="media-rewind-btn" variant="default" size="xl" aria-label="Rewind">
        <RewindIcon />
      </ActionIcon>
      {showPause ? (
        <ActionIcon id="media-pause-btn" variant="default" size="xl" aria-label="Pause" onClick={onPause}>
          <PauseIcon />
        </ActionIcon>
      ) : (
        <ActionIcon id="media-play-btn" variant="default" size="xl" aria-label="Play" onClick={onPlay}>
          <PlayIcon />
        </ActionIcon>
      )}
      <ActionIcon id="media-fast-forward-btn" variant="default" size="xl" aria-label="Fast forward">
        <FastForwardIcon />
      </ActionIcon>
      <ActionIcon id="media-stop-btn" variant="default" size="xl" aria-label="Stop" onClick={onStop}>
        <StopIcon />
      </ActionIcon>
      <ActionIcon id="media-delete-btn" variant="default" bg="var(--mantine-color-error)" size="xl" aria-label="Delete" onClick={onDelete}>
        <TrashIcon />
      </ActionIcon>
    </Group>
  );
}

interface MediaControlAffixProps {
  show: boolean;
  isMobile: boolean;
  selectedStatuses?: LightEffectStatus[];
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onDelete?: () => void;
}

export default function MediaControlAffix({ show, isMobile, selectedStatuses, onPlay, onPause, onStop, onDelete }: MediaControlAffixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useAppShellRef();

  return (
    <>
      {show && (
        <MediaControlPortal anchorRef={ref as any} parentRef={parentRef as any} isMobile={isMobile}>
          <SwitchesCard statuses={selectedStatuses} onPlay={onPlay} onPause={onPause} onStop={onStop} onDelete={onDelete} />
        </MediaControlPortal>
      )}
      <div ref={ref} style={{ display: 'none' }} />
    </>
  );
}
