#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy/vec2(1920.0,1080.0);
  float v = abs(sin(u_time*0.3+2.0))*0.8;
  gl_FragColor = vec4(uv.x*v, uv.y*v, v, 1.0);
}
