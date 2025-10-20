import os, textwrap, random, time
root = os.path.expanduser("~/projects/oriel/src")
subdirs = [
    "shards","fibers","stances","fixtures/extra","shaders/flux",
    "profiles","specs","bays","assets/yard"
]
for sd in subdirs:
    path = os.path.join(root, sd)
    os.makedirs(path, exist_ok=True)

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path,"w",encoding="utf-8") as f: f.write(content.strip()+"\n")

# Example generation
for i in range(1,101):
    write(f"{root}/shards/shard_{i:03}.ts", f"export interface Shard_{i:03} "+"{ id:string; name:string; state:any }")
for i in range(1,51):
    write(f"{root}/fibers/fiber_{i:03}.ts", f"export interface Fiber_{i:03} "+"{ link:string; strength:number }")
for i in range(1,30):
    write(f"{root}/stances/stance_{i:03}.ts", f"export interface Stance_{i:03} "+"{ mode:string; context:string }")
for i in range(1,15):
    write(f"{root}/shaders/flux/shader_{i:03}.glsl", textwrap.dedent(f"""
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform float u_time;
    void main() {{
      vec2 uv = gl_FragCoord.xy/vec2(1920.0,1080.0);
      float v = abs(sin(u_time*0.3+{i}.0))*0.8;
      gl_FragColor = vec4(uv.x*v, uv.y*v, v, 1.0);
    }}
    """))

print("[✓] Full payload stubs generated under", root)
