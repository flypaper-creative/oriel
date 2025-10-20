/* shader 11 - simple animated fragment */
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.5 + 11.0;
  float s = 0.5 + 0.5*sin(t + uv.x*10.0);
  gl_FragColor = vec4(vec3(s*uv.x, s*uv.y, 0.5), 1.0);
}

