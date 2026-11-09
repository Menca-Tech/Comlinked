"use client";

import { Mono, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Input } from "@/components/ui/input";
import { act, searchDegree, searchRows, setForm } from "@/services/comlinked";

function Results() {
  const rows = searchRows();
  if (!rows) return <p className="a-empty">Type what your company needs.</p>;
  if (!rows.length) {
    return <p className="a-empty">No companies match that search. Try a product or an industry.</p>;
  }
  return (
    <div className="a-list">
      {rows.map((x, i) => {
        const body = (
          <>
            <Mono c={x.company} cls="sm" />
            <span className="a-li-m">
              <strong>
                {i + 1}. {x.company.name}
              </strong>
              <small>
                {x.company.ind}, {x.company.city}
                {x.source ? searchDegree(x.source) : ""}
              </small>
            </span>
            {x.me ? <span className="a-li-r">Your company</span> : null}
          </>
        );
        return x.me || !x.source ? (
          <div className="a-li me" data-score={x.calc} key="me">
            {body}
          </div>
        ) : (
          <button
            type="button"
            className="a-li"
            data-score={x.calc}
            key={x.source.id}
            onClick={() => act.viewCo(x.source!.id)}
          >
            {body}
          </button>
        );
      })}
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
