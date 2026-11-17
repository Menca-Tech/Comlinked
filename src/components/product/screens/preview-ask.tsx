import Link from "next/link";

import { MEMBER_BENEFITS } from "@/lib/member-benefits";
import { paths } from "@/paths";
import { CHAMBER, PRESENTER, PREVIEW_CLOSING } from "@/services/comlinked";

/** How to say yes: a link that opens a new message to the presenter in the visitor's own mail
 * app, with their address beside it. With no address set, the visitor replies to whoever sent the
 * link. The Demo sends and stores nothing. */
function ContactPresenter() {
  if (!PRESENTER) {
    return <p className="a-why pv-reply">Reply to the person who sent you this link.</p>;
  }
  return (
    <>
      <a className="a-btn" href={PRESENTER.mailto}>
        Email {PRESENTER.firstName}
      </a>
      <p className="pv-address">{PRESENTER.address}</p>
    </>
  );
}

/** The Pilot Preview's last screen: what a pilot asks of the chamber, what ComLinked does, what
 * its members get, and how to say yes. */
export function PreviewAsk() {
  const chamber = CHAMBER.shortName;
  return (
    <div className="w-read pv-read">
      <header className="a-page">
        <h1 className="a-h1">{PREVIEW_CLOSING.title}</h1>
      </header>
      <section className="a-sec" aria-labelledby="pv-gives">
        <h2 id="pv-gives" className="a-h2">
          {chamber} gives two things
        </h2>
        <ol className="pv-list">
          <li>
            <b>Your Member List.</b> Company names and websites only.
          </li>
          <li>
            <b>One contact.</b> They send each member its claim link from {chamber}’s own address.
          </li>
        </ol>
      </section>
      <section className="a-sec" aria-labelledby="pv-does">
        <h2 id="pv-does" className="a-h2">
          ComLinked does the rest
        </h2>
        <ul className="pv-list">
          <li>Builds each company’s profile.</li>
          <li>Supplies the community manager.</li>
          <li>Makes introductions, so no member goes without a lead.</li>
        </ul>
      </section>
      <section className="a-sec" aria-labelledby="pv-gets">
        <h2 id="pv-gets" className="a-h2">
          What your members get
        </h2>
        <ul className="pv-list">
          {MEMBER_BENEFITS.map((benefit) => (
            <li key={benefit.title}>{benefit.title}</li>
          ))}
        </ul>
      </section>
      <p className="pv-free">The pilot is free for {chamber} and its members.</p>
      <div className="pv-acts">
        <ContactPresenter />
        <Link href={paths.product.dash} className="a-btn o">
          Explore on your own
        </Link>
      </div>
    </div>
  );
}
