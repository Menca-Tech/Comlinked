// The Chamber this demo is shown to. Every screen that names the chamber reads it from here, so
// renaming the chamber changes this file only. The chamber appears as text, never as a logo.
import { env } from "@/env";
import type { PresenterContact } from "@/services/comlinked/types";

const SHORT_NAME = "ECCP";

export const CHAMBER = {
  shortName: SHORT_NAME,
  fullName: "European Chamber of Commerce of the Philippines",
  /** Who the claim message comes from. */
  senderName: SHORT_NAME + " Membership",
  /** The person presenting the Pilot Preview. */
  presenterFirstName: "Richard",
} as const;

/** How to reach the presenter from the Pilot Preview's last screen: their first name, their
 * address, and a link that opens a new message to them in the visitor's own mail app, with the
 * subject filled in. Nothing when no address is set. */
export function presenterContact(address: string | undefined): PresenterContact | null {
  if (!address) return null;
  const to = encodeURIComponent(address).replace(/%40/g, "@");
  const subject = encodeURIComponent(SHORT_NAME + " pilot on ComLinked");
  return {
    firstName: CHAMBER.presenterFirstName,
    address: address,
    mailto: "mailto:" + to + "?subject=" + subject,
  };
}

/** The presenter's contact on this deployment. Their address is a deployment setting, read from
 * the environment and never written into the repository. */
export const PRESENTER = presenterContact(env.NEXT_PUBLIC_PREVIEW_PRESENTER_EMAIL);
