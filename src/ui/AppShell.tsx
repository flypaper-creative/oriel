import React from "react";
import { TimelinePanel } from "@/ui/components/Timeline";
import { Inspector } from "@/ui/components/Inspector";
import { ModuleDock } from "@/ui/components/ModuleDock";
import { useStore } from "@/state/store";
import { Settings } from "@/ui/components/Settings";
import { Logs } from "@/ui/components/Logs";

export function AppShell(){
  const { selected } = useStore();
  return (
    <div className="min-h-full grid grid-rows-[auto_1fr]">
      <header className="toolbar">
        <div className="text-sm font-semibold tracking-wide">oriel</div>
        <div className="ml-2 chip">v4.6 UI</div>
        <div className="ml-auto flex items-center gap-2">
          <Settings/>
        </div>
      </header>

      <main className="grid md:grid-cols-[1fr_320px] gap-3 p-3">
        <section className="space-y-3">
          <ModuleDock/>
          <TimelinePanel/>
          <Logs/>
        </section>

        <aside className="hidden md:block">
          <div className="card p-3 h-full">
            <Inspector/>
          </div>
        </aside>
      </main>
    </div>
  );
}
