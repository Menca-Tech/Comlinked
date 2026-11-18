/** The Demo's one staged moment: the day-one Matches arriving one after another once the claim
 * finishes. The claim says it has just finished, and the Matches screen asks whether it was
 * reached that way. It is held here, among the screens, because it is about what moves on arrival
 * and not about anything the simulation holds. */
let fromClaim = false;

/** Called as the claim finishes, just before the Matches open. */
export function claimJustFinished() {
  fromClaim = true;
}

/** Whether the Matches screen is being reached from finishing the claim. */
export function arrivingFromClaim() {
  return fromClaim;
}

/** Called once the Matches screen is up, so opening it any other way stages nothing. */
export function arrivalStaged() {
  fromClaim = false;
}
