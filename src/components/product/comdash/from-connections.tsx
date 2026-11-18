"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { AiChip, Btn, useReplaced } from "@/components/product/shared";
import { Tag } from "@/components/product/tag";
import { useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import {
  act,
  connectionItems,
  dayName,
  emptyReplyNote,
  setReplyDraft,
  type ConnectionItem,
  type Draft,
} from "@/services/comlinked";

function ReplyBox({ item, draft }: { item: ConnectionItem; draft: Draft }) {
  const id = `reply-${item.id}`;
  return (
    <div className="cd-reply">
      <div className="a-between">
        <label className="a-label a-flat" htmlFor={id}>
          Your reply to {item.company.name}
        </label>
        <AiChip field="reply" on={draft.ai} />
      </div>
      {draft.ai || draft.text.trim() ? null : <p className="cd-note">{emptyReplyNote()}</p>}
      <Textarea
        className="a-input"
        id={id}
        rows={5}
        value={draft.text}
        onChange={(event) => setReplyDraft(item.id, event.target.value)}
      />
      <div className="a-acts">
        <Btn cls="g sm" onClick={() => act.cancelReply(item.id)}>
          Cancel
        </Btn>
        <Btn cls="o sm" onClick={() => act.sendReply(item.id)}>
          Send
        </Btn>
      </div>
      <p className="cd-note">Nothing is sent until you tap Send. It goes to ComMail.</p>
    </div>
  );
}

function ItemCard({ item, draft }: { item: ConnectionItem; draft?: Draft }) {
  const replaced = useReplaced(item.answered);
  return (
    <li className="cd-moment" data-item={item.kind}>
      <QueueRow
        name={item.company.name}
        meta={item.day === null ? item.title : `${item.title} · ${dayName(item.day)}`}
      >
        <Tag>{item.label}</Tag>
      </QueueRow>
      <p className="cd-quote">{item.text}</p>
      {item.answered ? (
        <p className="cd-done" {...replaced}>
          Answered. Your reply is in ComMail.
        </p>
      ) : draft ? (
        <ReplyBox item={item} draft={draft} />
      ) : (
        <div className="a-acts">
          <Btn
            cls="o sm"
            aria-label={`Reply to ${item.company.name}`}
            onClick={() => act.startReply(item.id)}
          >
            Reply
          </Btn>
        </div>
      )}
    </li>
  );
}

/** Asks, Success Wall wins and profile updates from Connections, each with a reply. Reply and Send
 * are outlined: the tab's one solid button is Accept, on an invitation. */
export function FromConnections() {
  const S = useSimulation();
  const items = connectionItems();
  return (
    <DashPanel title="From your connections" note="asks, wins and profile updates">
      {items.length ? (
        <ul className="cd-moments">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} draft={S.replyDrafts[item.id]} />
          ))}
        </ul>
      ) : (
        <EmptyNote>
          Nothing from your connections yet. When a Connection posts an ask, shares a win or updates
          its profile, it appears here.
        </EmptyNote>
      )}
    </DashPanel>
  );
}
