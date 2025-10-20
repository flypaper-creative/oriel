import React, { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
export default function ToastRail(){
  const msg = useAppStore(s=>s.ui.toast);
  const toast = useAppStore(s=>s.toast);
  useEffect(()=>{ if(!msg) return; const t = setTimeout(()=>toast(null), 2400); return ()=>clearTimeout(t); }, [msg, toast]);
  if(!msg) return null;
  return <div className="fixed top-3 right-3 z-[60] px-3 py-2 rounded-xl bg-oriel-accent text-black shadow-glow text-sm">{msg}</div>;
}
