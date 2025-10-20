import React from "react";
export default function LoaderStripe(){
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-64 h-1 bg-oriel-surface overflow-hidden rounded">
        <div className="h-full bg-oriel-accent animate-[loadstripe_1.8s_ease-in-out_infinite] origin-left"></div>
      </div>
      <style>
        {`@keyframes loadstripe{0%{transform:scaleX(.05)}50%{transform:scaleX(1)}100%{transform:scaleX(.05)}}`}
      </style>
    </div>
  );
}
