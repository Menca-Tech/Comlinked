"use client";

import { ClaimMark } from "@/components/product/claim-mark";
import { BasicsLine, Mono, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Input } from "@/components/ui/input";
import type { SearchRow } from "@/services/comlinked";
import { act, searchRows, setForm } from "@/services/comlinked";

/** One result. A Company that has not claimed shows its basics and the mark, and nothing else. */
function ResultRow({ rank, row }: { rank: number; row: SearchRow }) {
  const source = row.source;
  const body = (
    <>
      {source ? <Mono c={source} cls="sm" /> : <Mono c={row.company} own cls="sm" />}
      <span className="a-li-m">
        <strong>
          {rank}. {row.company.name}
        </strong>
        <small>
          {source ? (
            <BasicsLine c={source} mutuals />
          ) : (
            <>
              {row.company.ind}, {row.company.city}
            </>
          )}
        </small>
        {source ? <ClaimMark c={source} /> : null}
      </span>
      {row.me ? <span className="a-li-r">Your company</span> : null}
    </>
  );
  if (row.me || !source) {
    return (
      <div className="a-li me" data-score={row.calc}>
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      className="a-li"
      data-score={row.calc}
      onClick={() => act.viewCo(source.id)}
    >
      {body}
    </button>
  );
}

function Results() {
  const rows = searchRows();
  if (!rows) return <p className="a-empty">Type what your company needs.</p>;
  if (!rows.length) {
    return <p className="a-empty">No companies match that search. Try a product or an industry.</p>;
  }
  return (
    <div className="a-list">
      {rows.map((row, i) => (
        <ResultRow key={row.source?.id ?? "me"} rank={i + 1} row={row} />
      ))}
    </div>
  );
}

// L2: Search Rank.
export function Search() {
  const S = useSimulation();
  return (
    <div className="w-read">
      <PageHead title="Search" />
      <Panel>
        <div>
          <label className="a-label" htmlFor="f-query">
            Industry, product or need
          </label>
          <Input
            className="a-input"
            id="f-query"
            value={S.forms.query}
            onChange={(event) => setForm("query", event.target.value)}
          />
        </div>
        <div id="search-results" className="a-stack">
          <Results />
        </div>
      </Panel>
    </div>
  );
}
