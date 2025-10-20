import React from "react";
import confetti from "canvas-confetti";
export default function ToastConfetti({ when }:{ when:boolean }){
  React.useEffect(()=>{ if(when){ confetti({ particleCount: 90, spread: 60, origin:{ y:.7 } }); } },[when]);
  return null;
}
