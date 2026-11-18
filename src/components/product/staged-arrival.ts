/** The Demo's one staged moment: the day-one Matches arriving one after another once the claim
 * finishes. The claim notes that it has just finished, and the Matches screen asks whether it was
 * reached that way. It is held here, among the screens, because it is about what moves on arrival
 * and not about anything the simulation holds. */
let claimFinished = false;

/** Notes that the claim has just finished, as the Matches are about to open. */
export function noteClaimFinished() {
  claimFinished = true;
}

/** Whether the Matches screen is being reached from finishing the claim. */
export function arrivingFromClaim() {
  return claimFinished;
}

/** Forgets the note once the Matches screen is up, so opening it any other way stages nothing. */
export function forgetClaimFinished() {
  claimFinished = false;
}
