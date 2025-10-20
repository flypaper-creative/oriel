import React, { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function ShaderBackdrop(){
  const ref = useRef<HTMLCanvasElement>(null);
  const reso = useAppStore(s=>s.reso);

  useEffect(()=>{ const canvas=ref.current!; const gl = canvas.getContext("webgl2");
    if(!gl) return;
    const vs = `#version 300 es
    precision highp float; layout(location=0) in vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;
    const fs = `#version 300 es
    precision highp float; out vec4 o; uniform vec2 R; uniform float T;
    float h(vec2 p){ return fract(sin(dot(p,vec2(27.1,91.7)))*43758.5453); }
    void main(){
      vec2 uv = gl_FragCoord.xy/R;
      float t = T*.05;
      vec3 base = vec3(0.07,0.07,0.09);
      float wave = sin((uv.x+uv.y)*12.0 + t)*.08;
      vec3 tint = mix(vec3(1.0,.84,.38)*.25, vec3(.15,.9,.72)*.14, smoothstep(0.,1.,uv.y));
      vec3 col = base + wave + tint;
      o = vec4(col, .6);
    }`;
    const S=(t:number,s:string)=>{const sh=gl.createShader(t)!; gl.shaderSource(sh,s); gl.compileShader(sh); return sh;}
    const p=gl.createProgram()!; gl.attachShader(p,S(gl.VERTEX_SHADER,vs)); gl.attachShader(p,S(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); gl.useProgram(p);
    const b=gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const uR=gl.getUniformLocation(p,"R"), uT=gl.getUniformLocation(p,"T");
    const fit=()=>{ const dpr=Math.min(2,window.devicePixelRatio||1); const w=canvas.clientWidth*dpr, h=canvas.clientHeight*dpr;
      if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); } };
    const ro=new ResizeObserver(fit); ro.observe(canvas);
    let raf=0; const loop=()=>{ fit(); gl.useProgram(p); gl.uniform2f(uR,canvas.width,canvas.height); gl.uniform1f(uT,reso*0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4); raf=requestAnimationFrame(loop); };
    loop(); return ()=>{ cancelAnimationFrame(raf); ro.disconnect(); };
  },[reso]);
  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />;
}
