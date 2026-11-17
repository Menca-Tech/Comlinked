// The Chamber this demo is shown to. Every screen that names the chamber reads it from here, so
// renaming the chamber changes this file only. The chamber appears as text, never as a logo.
const SHORT_NAME = "ECCP";

export const CHAMBER = {
  shortName: SHORT_NAME,
  fullName: "European Chamber of Commerce of the Philippines",
  /** Who the claim message comes from. */
  senderName: SHORT_NAME + " Membership",
  /** The person presenting the Pilot Preview. */
  presenterFirstName: "Richard",
} as const;
