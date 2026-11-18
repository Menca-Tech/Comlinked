import Link from "next/link";

import { TwoPanel } from "@/components/product/two-panel";
import { MEMBER_BENEFITS } from "@/lib/member-benefits";
import { paths } from "@/paths";
import { CHAMBER, PRESENTER, PREVIEW_CLOSING } from "@/services/comlinked";

/** How to say yes: a link that opens a new message to the presenter in the visitor's own mail
 * app, the way on into the Demo, and the presenter's address as text. With no address set, the
 * visitor replies to whoever sent the link. The Demo sends and stores nothing. */
function AskActions() {
  const explore = (
    <Link href={paths.product.dash} className="a-btn o">
      Explore on your own
    </Link>
  );
  if (!PRESENTER) {
    return (
      <>
        <p className="a-why">Reply to the person who sent you this link.</p>
        <div className="pv-acts">{explore}</div>
      </>
    );
  }
  return (
    <>
      <div className="pv-acts">
        <a className="a-btn" href={PRESENTER.mailto}>
          Email {PRESENTER.firstName}
        </a>
        {explore}
      </div>
      <p className="pv-address">{PRESENTER.address}</p>
    </>
  );
}

/** The Pilot Preview's last screen, in the same two panels as the Opening. Navy: what a pilot
 * asks of the chamber, as a numbered pair, and that it is free. White: what ComLinked does, what
 * its members get, and how to say yes. */
export function PreviewAsk() {
  const chamber = CHAMBER.shortName;
  return (
    <TwoPanel
      focus="side"
      side={
        <>
          <h1 className="a-h1">{PREVIEW_CLOSING.title}</h1>
          <section className="a-sec" aria-labelledby="pv-gives">
            <h2 id="pv-gives" className="a-h2">
              {chamber} gives two things
            </h2>
            <ol className="pv-gives">
              <li>
                <b>Your Member List.</b> Company names and websites only.
              </li>
              <li>
                <b>One contact.</b> They send each member its claim link from {chamber}’s own
                address.
              </li>
            </ol>
          </section>
          <p className="a-two-foot pv-free">The pilot is free for {chamber} and its members.</p>
        </>
      }
    >
      <section className="a-sec" aria-labelledby="pv-does">
        <h2 id="pv-does" className="a-h2">
          ComLinked does the rest
        </h2>
        <ul className="pv-plain">
          <li>Builds each company’s profile.</li>
          <li>Supplies the community manager.</li>
          <li>Makes introductions, so no member goes without a lead.</li>
        </ul>
      </section>
      <section className="a-sec" aria-labelledby="pv-gets">
        <h2 id="pv-gets" className="a-h2">
          What your members get
        </h2>
        <ul className="pv-plain">
          {MEMBER_BENEFITS.map((benefit) => (
            <li key={benefit.title}>{benefit.title}</li>
          ))}
        </ul>
      </section>
      <AskActions />
    </TwoPanel>
  );
}
