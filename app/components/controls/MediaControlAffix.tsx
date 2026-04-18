import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { FastForwardIcon, PlayIcon, RewindIcon, StopIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppShellRef } from "~/provider/AppShellContext";
import styles from "./MediaControlAffix.module.css";

interface MediaControlPortalProps {
  anchorRef: React.RefObject<HTMLElement>;
  parentRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

function MediaControlPortal({ anchorRef, parentRef, children }: MediaControlPortalProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!parentRef.current) return;
    if (!anchorRef.current) return;

    const updateCoords = () => {
      const parent = parentRef.current?.getBoundingClientRect();
      setCoords({
        top: (window.innerHeight * 0.9) + window.scrollY,
        left: parent.left + (parent.width / 2),
      });
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);
    return () => window.removeEventListener("resize", updateCoords);
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
  return <Group justify="center" onClick={(e) => e.stopPropagation()}>
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

export default function MediaControlAffix() {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const parentRef = useAppShellRef();

  return (
    <Button ref={ref} onClick={() => setShow(s => !s)}>
      <div>{show ? "Hide" : "Show"} Media Controls</div>
      {show && (
        <MediaControlPortal anchorRef={ref} parentRef={parentRef}>
          <SwitchesCard />
        </MediaControlPortal>
      )}
    </Button>
  );
}