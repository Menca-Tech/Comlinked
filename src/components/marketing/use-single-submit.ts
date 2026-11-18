"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps a form's submit button disabled until the script has loaded, because a native
 * submit would put the values in the web address, and runs its action only once.
 */
export function useSingleSubmit(action: () => void) {
  const done = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  function submit() {
    if (done.current) return;
    done.current = true;
    action();
  }

  return { ready, submit };
}
