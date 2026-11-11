import { FromConnections } from "@/components/product/comdash/from-connections";
import { InvitationsPanel } from "@/components/product/comdash/invitations-panel";
import { ManageConnections } from "@/components/product/comdash/manage-connections";
import {
  BuyerSuggestions,
  ChamberSuggestions,
} from "@/components/product/comdash/suggestion-panels";

/** The Connections tab, in the prototype's order. */
export function ConnectionsTab() {
  return (
    <div className="cd-net">
      <ManageConnections />
      <div className="cd-net-main">
        <InvitationsPanel />
        <ChamberSuggestions />
        <BuyerSuggestions />
        <FromConnections />
      </div>
    </div>
  );
}
