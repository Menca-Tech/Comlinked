/** The attribute that marks an element as its screen's Focus panel: the one raised panel that
 * holds the thing to act on now. The styles and the browser checks both find the panel by it. */
export function focusPanel(on: boolean) {
  return on ? { "data-focus-panel": "" } : undefined;
}
