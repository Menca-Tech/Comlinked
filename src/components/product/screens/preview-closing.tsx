import { CHAMBER, PREVIEW_CLOSING } from "@/services/comlinked";

/** The Pilot Preview's last screen: what a pilot asks of the chamber. */
export function PreviewClosing() {
  return (
    <div className="w-read pv-read">
      <header className="a-page">
        <h1 className="a-h1">{PREVIEW_CLOSING.title}</h1>
      </header>
      <p className="a-why">
        A pilot asks {CHAMBER.shortName} for two things: its member list of company names and
        websites, and one contact who sends each member its claim link.
      </p>
    </div>
  );
}
