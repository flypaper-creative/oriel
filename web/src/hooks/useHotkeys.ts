import { useEffect } from "react";
export default function useHotkeys(map:{[k:string]:()=>void}){
  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      const k = (e.ctrlKey ? "ctrl+" : "") + e.key.toLowerCase();
      if (map[k]) { e.preventDefault(); map[k](); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[]);
}
