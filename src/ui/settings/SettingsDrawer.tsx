import React from "react"; import { useAppStore } from "../../store/useAppStore";
export default function SettingsDrawer(){ const open=useAppStore(s=>s.ui.showSettings), toggle=useAppStore(s=>s.toggleSettings);
  if(!open) return null; return (<div className="fixed inset-0 z-40 pointer-events-none">
    <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={toggle}/>
    <div className="absolute bottom-0 right-0 w-full max-w-md h-[28rem] bg-oriel-surface border-l border-t border-oriel-accent rounded-tl-2xl p-4 overflow-auto pointer-events-auto">
      <h3 className="text-lg font-medium mb-3">Preferences</h3>
      <label className="flex items-center justify-between py-2"><span>Dark mode</span><input type="checkbox" className="accent-oriel-accent" defaultChecked/></label>
      <label className="flex items-center justify-between py-2"><span>Animations</span><input type="checkbox" className="accent-oriel-accent" defaultChecked/></label>
      <label className="flex items-center justify-between py-2"><span>Shader complexity</span><input type="range" min="1" max="3" defaultValue="2" className="w-40"/></label>
    </div></div>);
}
