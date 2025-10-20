import React from "react";
import { useOrielStore } from "../../state/store";
export function Toaster(){
  const { ui } = useOrielStore();
  if(!ui.toast) return null;
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="px-3 py-2 rounded-xl bg-ink-800 border border-ink-700 shadow">{ui.toast.text}</div>
    </div>
  );
}
