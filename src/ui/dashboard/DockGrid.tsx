import React from "react";
import StatsBoard from "./StatsBoard";
import TimelinePane from "../timeline/TimelinePane";
import InspectorPane from "../inspector/InspectorPane";
import DecisionMatrix from "../decision/DecisionMatrix";
import ResonanceCanvas from "../resonance/ResonanceCanvas";
import LinkGraph from "../linkage/LinkGraph";
import StoryboardPane from "../storyboard/StoryboardPane";
import ContinuityAuditor from "../auditor/ContinuityAuditor";
import AIPanel from "../ai/AIPanel";

export default function DockGrid(){
  return (
    <div className="grid grid-cols-12 auto-rows-[minmax(140px,1fr)] gap-3">
      <section className="col-span-12"><StatsBoard/></section>
      <section className="col-span-12 xl:col-span-8 bg-oriel-surface rounded-2xl p-4 min-h-[260px]"><TimelinePane/></section>
      <section className="col-span-12 xl:col-span-4 bg-oriel-surface rounded-2xl p-4 min-h-[260px]"><InspectorPane/></section>
      <section className="col-span-12 md:col-span-6 bg-oriel-surface rounded-2xl p-4 min-h-[240px]"><DecisionMatrix/></section>
      <section className="col-span-12 md:col-span-6 bg-oriel-surface rounded-2xl p-0 overflow-hidden min-h-[240px]"><ResonanceCanvas/></section>
      <section className="col-span-12 md:col-span-3 bg-oriel-surface rounded-2xl p-3 min-h-[200px]"><LinkGraph/></section>
      <section className="col-span-12 md:col-span-3 bg-oriel-surface rounded-2xl p-3 min-h-[200px]"><StoryboardPane/></section>
      <section className="col-span-12 md:col-span-3 bg-oriel-surface rounded-2xl p-3 min-h-[200px]"><ContinuityAuditor/></section>
      <section className="col-span-12 md:col-span-3 bg-oriel-surface rounded-2xl p-3 min-h-[200px]"><AIPanel/></section>
    </div>
  );
}
