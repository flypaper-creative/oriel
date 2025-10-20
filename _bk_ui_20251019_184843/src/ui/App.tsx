import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HeaderBar from "./components/HeaderBar";
import SidebarNav from "./components/SidebarNav";
import StatusFooter from "./components/StatusFooter";
import MobileTabBar from "./components/MobileTabBar";
import UploadGate from "./components/UploadGate";
import CommandPalette from "./dashboard/CommandPalette";
import SettingsDrawer from "./settings/SettingsDrawer";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./providers/SmoothScroll";
import Hero from "./landing/Hero";
import DockGrid from "./dashboard/DockGrid";
import TimelinePane from "./timeline/TimelinePane";
import InspectorPane from "./inspector/InspectorPane";
import DecisionMatrix from "./decision/DecisionMatrix";
import ResonanceCanvas from "./resonance/ResonanceCanvas";
import LinkGraph from "./linkage/LinkGraph";
import StoryboardPane from "./storyboard/StoryboardPane";
import ContinuityAuditor from "./auditor/ContinuityAuditor";
import AIPanel from "./ai/AIPanel";
import ShaderBackdrop from "./components/ShaderBackdrop";
import TransitionFX from "./components/TransitionFX";
import ToastRail from "./components/ToastRail";

function Page({children}:{children:React.ReactNode}){
  return (<motion.main initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          transition={{duration:.35,ease:[0.25,1,0.5,1]}} className="flex-1 min-h-0 overflow-auto p-3 md:p-4">
          {children}
        </motion.main>);
}
export default function App(){
  const location=useLocation();
  return (
    <SmoothScroll>
      <ShaderBackdrop/>
      <TransitionFX/>
      <CustomCursor/>
      <div className="flex flex-col min-h-screen bg-oriel-bg text-oriel-text">
        <HeaderBar/>
        <div className="flex flex-1 min-h-0">
          <SidebarNav/>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Page><div className="max-w-6xl mx-auto"><Hero/></div></Page>} />
              <Route path="/dashboard" element={<Page><DockGrid/></Page>} />
              <Route path="/timeline" element={<Page><div className="bg-oriel-surface rounded-2xl p-4"><TimelinePane/></div></Page>} />
              <Route path="/inspector" element={<Page><div className="bg-oriel-surface rounded-2xl p-4"><InspectorPane/></div></Page>} />
              <Route path="/decision" element={<Page><div className="bg-oriel-surface rounded-2xl p-4"><DecisionMatrix/></div></Page>} />
              <Route path="/resonance" element={<Page><div className="bg-oriel-surface rounded-2xl p-0 overflow-hidden"><ResonanceCanvas/></div></Page>} />
              <Route path="/linkage" element={<Page><div className="bg-oriel-surface rounded-2xl p-0 overflow-hidden"><LinkGraph/></div></Page>} />
              <Route path="/storyboard" element={<Page><div className="bg-oriel-surface rounded-2xl p-0 overflow-hidden"><StoryboardPane/></div></Page>} />
              <Route path="/auditor" element={<Page><div className="bg-oriel-surface rounded-2xl p-4"><ContinuityAuditor/></div></Page>} />
              <Route path="/ai" element={<Page><div className="bg-oriel-surface rounded-2xl p-4"><AIPanel/></div></Page>} />
              <Route path="*" element={<Navigate to="/" replace/>} />
            </Routes>
          </AnimatePresence>
        </div>
        <StatusFooter/>
        <UploadGate/>
        <CommandPalette/>
        <SettingsDrawer/>
        <MobileTabBar/>
        <ToastRail/>
      </div>
    </SmoothScroll>
  );
}
