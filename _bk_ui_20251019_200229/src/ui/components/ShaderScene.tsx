import React, { useEffect, useRef } from "react";
import { useOrielStore } from "../../state/store";

export function ShaderScene(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const { reso } = useOrielStore();

  useEffect(()=> {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { antialias:true });
    if(!gl) return;

    const vs = `#version 300 es
    layout(location=0) in vec2 a; void main(){gl_Position=vec4(a,0.0,1.0);} `;
    const fs = `#version 300 es
    precision highp float; out vec4 o;
    uniform vec2 uR; uniform float uT; uniform float uReso;
    float grid(vec2 uv){
      vec2 p = uv*vec2(22.0); vec2 f = abs(fract(p)-0.5);
      float l = min(f.x,f.y); return smoothstep(0.49,0.5,l);
    }
    void main(){
      vec2 uv = gl_FragCoord.xy/uR;
      float g = grid(uv + vec2(sin(uT*.05)*.02, cos(uT*.06)*.02));
      vec3 base = mix(vec3(0.06,0.09,0.10), vec3(0.06,0.20,0.22), g);
      float glow = .12 + .35*abs(sin(uT*.6)) + uReso*.25;
      o = vec4(base + glow*vec3(0.0,0.90,0.75)*.15, 1.0);
    }`;

    const mk = (t:number,s:string)=>{ const sh=gl.createShader(t)!; gl.shaderSource(sh,s); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);

    const uR = gl.getUniformLocation(prog,"uR");
    const uT = gl.getUniformLocation(prog,"uT");
    const uReso = gl.getUniformLocation(prog,"uReso");

    const parent = canvas.parentElement||canvas;
    const ro = new ResizeObserver(()=> size());
    ro.observe(parent);
    function size(){
      const dpr = Math.min(2, window.devicePixelRatio||1);
      const w = Math.floor(parent.clientWidth*dpr);
      const h = Math.floor(parent.clientHeight*dpr);
      canvas.width = w; canvas.height = h;
      gl.viewport(0,0,w,h);
    }
    size();

    let start = performance.now(), raf = 0;
    function loop(now:number){
      gl.useProgram(prog);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now-start)/1000);
      gl.uniform1f(uReso, Math.min(1, Math.max(0, Math.abs(Math.sin(reso/1000))*0.8)));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return ()=> { cancelAnimationFrame(raf); ro.disconnect(); gl.deleteProgram(prog); gl.deleteBuffer(buf); };
  }, [reso]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
