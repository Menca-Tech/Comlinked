import { z } from "zod";

const detail = z.string().trim().min(1);
const firstChamberSchema = z.object({
  name: detail,
  quote: detail,
  person: detail,
  role: detail,
});

/** Stays null until Richard confirms the first real chamber's details. */
const FIRST_CHAMBER: unknown = null;

export function FirstChamber({ value = FIRST_CHAMBER }: { value?: unknown }) {
  const parsed = firstChamberSchema.safeParse(value);
  if (!parsed.success) return null;
  const { name, quote, person, role } = parsed.data;
  return (
    <figure className="mx-0 mt-10 mb-0 max-w-[700px] border-t border-t-cl-rule pt-6">
      <blockquote className="m-0 text-[20px] leading-[30px] text-cl-ink">{quote}</blockquote>
      <figcaption className="mt-3 text-[15px] leading-[23px] text-cl-muted">
        {person}, {role}, {name}
      </figcaption>
    </figure>
  );
}
