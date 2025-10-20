import React, { useEffect, useRef } from "react";

export function ShaderScene(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl2",{antialias:true, preserveDrawingBuffer:false});
    if(!gl) return;
    const vs = `#version 300 es
    layout(location=0) in vec2 a; void main(){ gl_Position=vec4(a,0.,1.); }`;
    const fs = `#version 300 es
    precision highp float; out vec4 o; uniform vec2 uR; uniform float uT; uniform float uS;
    float g(vec2 uv){ vec2 p=uv*vec2(18.); vec2 f=abs(fract(p)-.5); float l=min(f.x,f.y); return smoothstep(.492,.5,l); }
    void main(){
      vec2 uv=gl_FragCoord.xy/uR; float t=uT*.06;
      uv += vec2(sin(t)*.008, cos(t*.7)*.008);
      float k=g(uv);
      vec3 base=mix(vec3(0.07,0.10,0.15), vec3(0.10,0.16,0.22), k);
      float glow=(.10 + .18*abs(sin(uT*.6))) * uS;
      vec3 col=base + glow*vec3(0.03,0.55,0.42);
      o=vec4(col,1.);
    }`;
    const sh=(t:number,s:string)=>{ const r=gl.createShader(t)!; gl.shaderSource(r,s); gl.compileShader(r); return r; };
    const prog=gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER,vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf=gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const uR=gl.getUniformLocation(prog,"uR");
    const uT=gl.getUniformLocation(prog,"uT");
    const uS=gl.getUniformLocation(prog,"uS");
    let raf=0, start=performance.now();
    const resize=()=>{
      const dpr=Math.min(1.75,window.devicePixelRatio||1);
      const P=canvas.parentElement||canvas;
      const w=Math.max(1,Math.floor((P.clientWidth||1)*dpr));
      const h=Math.max(1,Math.floor((P.clientHeight||1)*dpr));
      canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h);
    };
    const ro=new ResizeObserver(resize); ro.observe(canvas.parentElement||canvas); resize();
    let active=true; const io=new IntersectionObserver(([e])=>active=!!e.isIntersecting,{threshold:.01}); io.observe(canvas);
    const loop=(now:number)=>{ if(active){ gl.uniform2f(uR,canvas.width,canvas.height); gl.uniform1f(uT,(now-start)/1000); const s=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shader-strength'))||.55; gl.uniform1f(uS,Math.max(.2,Math.min(1.,s))); gl.drawArrays(gl.TRIANGLE_STRIP,0,4);} raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
    return ()=>{ cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.deleteBuffer(buf); gl.deleteProgram(prog); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}
