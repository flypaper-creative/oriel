import React, { useEffect, useRef } from "react";
export function ShaderScene(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const canvas = ref.current!; const gl = canvas.getContext("webgl2",{antialias:true}); if(!gl) return;
    const vs=`#version 300 es
    layout(location=0) in vec2 a; void main(){gl_Position=vec4(a,0.0,1.0);} `;
    const fs=`#version 300 es
    precision highp float; out vec4 o; uniform vec2 uR; uniform float uT;
    float g(vec2 uv){ vec2 p=uv*vec2(18.); vec2 f=abs(fract(p)-.5); float l=min(f.x,f.y); return smoothstep(.49,.5,l); }
    void main(){ vec2 uv=gl_FragCoord.xy/uR; float t=uT*.06;
      uv+=vec2(sin(t)*.01, cos(t*.8)*.01);
      float k=g(uv);
      vec3 a=mix(vec3(0.09,0.12,0.17), vec3(0.10,0.18,0.26), k);
      o=vec4(a,1.0);
    }`;
    const mk=(t:number,s:string)=>{const sh=gl.createShader(t)!; gl.shaderSource(sh,s); gl.compileShader(sh); return sh;};
    const p=gl.createProgram()!; gl.attachShader(p,mk(gl.VERTEX_SHADER,vs)); gl.attachShader(p,mk(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); gl.useProgram(p);
    const b=gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const uR=gl.getUniformLocation(p,"uR"); const uT=gl.getUniformLocation(p,"uT");
    const ro=new ResizeObserver(()=>{const dpr=Math.min(2,window.devicePixelRatio||1); const w=Math.floor(canvas.clientWidth*dpr); const h=Math.floor(canvas.clientHeight*dpr); canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h);});
    ro.observe(canvas.parentElement||canvas);
    let start=performance.now(); let raf=0;
    const loop=(now:number)=>{gl.useProgram(p); gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT,(now-start)/1000); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); raf=requestAnimationFrame(loop);};
    raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf); ro.disconnect(); gl.deleteProgram(p); gl.deleteBuffer(b);}
  },[]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}
