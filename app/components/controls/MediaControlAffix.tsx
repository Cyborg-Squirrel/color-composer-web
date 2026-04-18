import { ActionIcon, Button, Group } from "@mantine/core";
import { NotePencilIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppShellRef } from "~/provider/AppShellContext";

function TooltipPortal({ anchorRef, parentRef, children }) {
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
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        transform: "translate(-50%)",
        padding: "6px 12px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

function SwitchesCard() {
  return <Group justify="center" onClick={(e) => e.stopPropagation()}>
    <ActionIcon variant="default" size="xl" aria-label="Edit">
      <NotePencilIcon />
    </ActionIcon>
    <ActionIcon variant="default" size="xl" aria-label="Play" disabled={true}>
      <PlayIcon />
    </ActionIcon>
    <ActionIcon variant="default" size="xl" aria-label="Pause">
      <PauseIcon />
    </ActionIcon>
    <ActionIcon variant="default" size="xl" aria-label="Stop">
      <StopIcon />
    </ActionIcon>
    <ActionIcon variant="default" bg="var(--mantine-color-error)" size="xl" aria-label="Delete">
      <TrashIcon/>
    </ActionIcon>
  </Group>;
}

export default function MediaControlAffix() {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const parentRef = useAppShellRef();

  return (
    <button ref={ref} onClick={() => setShow(s => !s)}>
      <Button>{show ? "Hide" : "Show"} Media Controls</Button>
      {show && (
        <TooltipPortal anchorRef={ref} parentRef={parentRef}>
          <SwitchesCard />
        </TooltipPortal>
      )}
    </button>
  );
}