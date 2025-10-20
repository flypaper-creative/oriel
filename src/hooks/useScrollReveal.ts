import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(selector:string, stagger=0.06){
  useEffect(()=>{
    const nodes = gsap.utils.toArray<HTMLElement>(selector);
    if(!nodes.length) return;
    gsap.fromTo(nodes,{y:14,opacity:0},{y:0,opacity:1,duration:.55,ease:"power3.out",stagger,
      scrollTrigger:{ trigger:nodes[0].closest("main") ?? document.body, start:"top 85%" }
    });
  },[selector,stagger]);
}
