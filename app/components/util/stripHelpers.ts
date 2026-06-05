import { ClientStatus, type ILedStripClient } from "~/api/clients/clients_api";
import { LightEffectStatus, type ILightEffect } from "~/api/effects/effects_api";
import type { IStripPool } from "~/api/pools/pools_api";
import type { ILedStrip, StripPlayState } from "~/api/strips/strips_api";

/**
 * Derive a strip's playback state from its effects.
 * API.md exposes per-effect status but no per-strip play state.
 */
export function deriveStripPlayState(stripUuid: string, effects: ILightEffect[]): StripPlayState {
  return playStateFromOwn(effects.filter((e) => e.stripUuid === stripUuid));
}

export function derivePoolPlayState(poolUuid: string, effects: ILightEffect[]): StripPlayState {
  return playStateFromOwn(effects.filter((e) => e.poolUuid === poolUuid));
}

/** Same derivation as deriveStripPlayState, but on a pre-grouped list of effects. */
export function playStateFromOwn(own: ILightEffect[]): StripPlayState {
  if (own.some((e) => e.status === LightEffectStatus.Playing)) return "playing";
  if (own.length > 0 && own.every((e) => e.status === LightEffectStatus.Paused)) return "paused";
  return "stopped";
}

export function findActiveEffect(stripUuid: string, effects: ILightEffect[]): ILightEffect | undefined {
  return effects.find(
    (e) => e.stripUuid === stripUuid && (e.status === LightEffectStatus.Playing || e.status === LightEffectStatus.Paused),
  );
}

export function findPoolActiveEffect(poolUuid: string, effects: ILightEffect[]): ILightEffect | undefined {
  return effects.find(
    (e) => e.poolUuid === poolUuid && (e.status === LightEffectStatus.Playing || e.status === LightEffectStatus.Paused),
  );
}

export function isClientOnline(client: ILedStripClient | undefined): boolean {
  if (!client) return false;
  return client.status !== ClientStatus.Offline && client.status !== ClientStatus.Error;
}

export function isClientConnected(client: ILedStripClient | undefined): boolean {
  if (!client) return false;
  return client.status === ClientStatus.Idle || client.status === ClientStatus.Active;
}

export function buildOnlineByStrip(
  strips: ILedStrip[],
  clients: ILedStripClient[],
): Record<string, boolean> {
  const clientOnline: Record<string, boolean> = {};
  for (const c of clients) clientOnline[c.uuid] = isClientOnline(c);
  const out: Record<string, boolean> = {};
  for (const s of strips) out[s.uuid] = clientOnline[s.clientUuid] ?? false;
  return out;
}

export function buildConnectedByStrip(
  strips: ILedStrip[],
  clients: ILedStripClient[],
): Record<string, boolean> {
  const clientConnected: Record<string, boolean> = {};
  for (const c of clients) clientConnected[c.uuid] = isClientConnected(c);
  const out: Record<string, boolean> = {};
  for (const s of strips) out[s.uuid] = clientConnected[s.clientUuid] ?? false;
  return out;
}

/**
 * Sort comparator that places strips with an active play state ahead of
 * stopped ones, then sorts alphabetically (case-insensitive) within each group.
 */
export function compareStripsActiveFirst(
  a: ILedStrip,
  b: ILedStrip,
): number {
  if (a.inUse !== b.inUse) return a.inUse ? -1 : 1;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function comparePoolsActiveFirst(
  a: IStripPool,
  b: IStripPool,
): number {
  if (a.inUse !== b.inUse) return a.inUse ? -1 : 1;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function stripStatusBadge(online: boolean, playState: StripPlayState): {
  label: string;
  color: string;
  badgeColor: "gray" | "teal" | "yellow";
} {
  if (!online) return { label: "Offline", color: "var(--neon-text3)", badgeColor: "gray" };
  if (playState === "playing") return { label: "Playing", color: "var(--neon-accent)", badgeColor: "teal" };
  if (playState === "paused") return { label: "Paused", color: "var(--neon-amber)", badgeColor: "yellow" };
  return { label: "Stopped", color: "var(--neon-text3)", badgeColor: "gray" };
}
