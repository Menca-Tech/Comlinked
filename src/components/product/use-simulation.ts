"use client";

import { useSyncExternalStore } from "react";

import { getState, getVersion, subscribe } from "@/services/comlinked";

/** Re-renders the caller whenever the simulation changes, and returns its state. */
export function useSimulation() {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return getState();
}

const DESKTOP = "(min-width: 900px)";

function subscribeDesktop(listener: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/** Laptops and phones render different structures for Leads and ComMail. */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}
