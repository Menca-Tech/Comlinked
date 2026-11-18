"use client";

import { useState, type ReactElement } from "react";

import { Mono } from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { act, roleLabel, signedIn } from "@/services/comlinked";

const MENU_NAME = "Account menu";
const MANAGE_LABEL = "Manage";

/** One way out of the menu: what it says and where it goes. */
interface Entry {
  label: string;
  go: () => void;
}

const PROFILE: Entry = { label: "View company profile", go: () => act.nav("company") };
const MANAGE: Entry[] = [{ label: "Admins and authorized users", go: () => act.nav("people") }];
const SIGN_OUT: Entry = { label: "Sign out", go: () => act.siteHome() };

/** Who is signed in: the company mark, their name, their role and the Company. */
function AccountHeader() {
  const S = useSimulation();
  const me = signedIn();
  return (
    <div className="acct-head">
      <Mono c={S.me} own cls="lg" />
      <span className="a-li-m">
        <strong>{me.name}</strong>
        <small>
          {roleLabel(me.role)} · {S.me.name}
        </small>
      </span>
    </div>
  );
}

/** The menu as a dropdown under the mark, on a laptop. Its items are reached with the arrow keys. */
function AccountDropdown({
  mark,
  open,
  onOpenChange,
}: {
  mark: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{mark}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="cl-guide acct-menu" aria-label={MENU_NAME}>
        <AccountHeader />
        <DropdownMenuItem className="a-btn o acct-profile" onSelect={PROFILE.go}>
          {PROFILE.label}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="acct-sep" />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="acct-group">{MANAGE_LABEL}</DropdownMenuLabel>
          {MANAGE.map((entry) => (
            <DropdownMenuItem key={entry.label} className="acct-item" onSelect={entry.go}>
              {entry.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="acct-sep" />
        <DropdownMenuItem className="acct-item" onSelect={SIGN_OUT.go}>
          {SIGN_OUT.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The menu as a sheet from the bottom, on a phone. Its items are buttons, reached with Tab. */
function AccountSheet({
  mark,
  open,
  onOpenChange,
}: {
  mark: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const choose = (entry: Entry) => {
    onOpenChange(false);
    entry.go();
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{mark}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="cl-guide guide-sheet gap-0"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">{MENU_NAME}</SheetTitle>
        <nav className="cl-sheet-body acct-body" aria-label={MENU_NAME}>
          <AccountHeader />
          <button type="button" className="a-btn o acct-profile" onClick={() => choose(PROFILE)}>
            {PROFILE.label}
          </button>
          <hr className="acct-sep" />
          <div role="group" aria-labelledby="acct-manage">
            <p className="acct-group" id="acct-manage">
              {MANAGE_LABEL}
            </p>
            {MANAGE.map((entry) => (
              <button
                key={entry.label}
                type="button"
                className="acct-item"
                onClick={() => choose(entry)}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <hr className="acct-sep" />
          <button type="button" className="acct-item" onClick={() => choose(SIGN_OUT)}>
            {SIGN_OUT.label}
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/** The company mark at the top right, which opens the account menu: a dropdown on a laptop and a
 * sheet on a phone. Escape closes it and puts focus back on the mark. */
export function AccountMenu() {
  const S = useSimulation();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const mark = (
    <button type="button" className="a-own" aria-label="Open the account menu">
      <Mono c={S.me} own cls="sm" />
    </button>
  );
  const Menu = isDesktop ? AccountDropdown : AccountSheet;
  return <Menu mark={mark} open={open} onOpenChange={setOpen} />;
}
