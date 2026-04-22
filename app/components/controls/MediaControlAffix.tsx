import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { FastForwardIcon, PlayIcon, RewindIcon, StopIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function SwitchesCard() {
  return <Group grow justify="center" onClick={(e) => e.stopPropagation()}>
    <ActionIcon variant="default" size="xl" aria-label="Rewind">
      <RewindIcon />
    </ActionIcon>
    <ActionIcon id="play-button" variant="default" size="xl" aria-label="Play" disabled={true}>
      <Tooltip target="#play-button" label="All selected effects are playing" />
      <PlayIcon />
    </ActionIcon>
    <ActionIcon variant="default" size="xl" aria-label="Fast forward">
      <FastForwardIcon />
    </ActionIcon>
    <ActionIcon variant="default" size="xl" aria-label="Stop">
      <StopIcon />
    </ActionIcon>
    <ActionIcon variant="default" bg="var(--mantine-color-error)" size="xl" aria-label="Delete">
      <TrashIcon />
    </ActionIcon>
  </Group>;
}

interface MediaControlAffixProps {
  show: boolean;
  isMobile: boolean;
}

export default function MediaControlAffix({ show, isMobile }: MediaControlAffixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useAppShellRef();

  return (
    <>
      {show && (
        <MediaControlPortal anchorRef={ref} parentRef={parentRef} isMobile={isMobile}>
          <SwitchesCard />
        </MediaControlPortal>
      )}
      <div ref={ref} style={{ display: 'none' }} />
    </>
  );
}
