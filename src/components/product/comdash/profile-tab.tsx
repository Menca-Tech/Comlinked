"use client";

import { useEffect } from "react";

import { CompanyProfile } from "@/components/product/screens/company";
import { useSimulation } from "@/components/product/use-simulation";
import { clearProfileFocus } from "@/services/comlinked";

/** The profile editor, focused on the field a profile gap or nudge asked for. */
export function ProfileTab() {
  const S = useSimulation();
  const focus = S.profileFocus;
  useEffect(() => {
    if (focus) clearProfileFocus();
  }, [focus]);
  return <CompanyProfile focus={focus ?? undefined} />;
}
