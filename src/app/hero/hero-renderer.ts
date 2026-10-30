/**
 * Fixed-camera hero renderer. The source plate is drawn 1:1 every frame; only masked
 * chain reflections, star twinkle and a few dust motes change. Everything is periodic in
 * LOOP seconds so frame(LOOP) === frame(0).
 *
 * Masks (public/hero/masks.png): R = chain specular, G = chain body, B = skull (protected).
 * Stars (public/hero/stars.png): R = star amplitude, G = phase, B = frequency index.
 * Both generated from the source image by the relik/build_assets.py script.
 */
export const LOOP = 8;
const TAU = Math.PI * 2;

const VS = `
attribute vec2 p; varying vec2 uv;
void main(){ uv = p * 0.5 + 0.5; uv.y = 1.0 - uv.y; gl_Position = vec4(p, 0.0, 1.0); }`;

const FS = (aspect: number) => `
precision highp float;
varying vec2 uv;
uniform sampler2D base, masks, stars;
uniform float t;
const float LOOP = ${LOOP.toFixed(1)};
const float TAU = 6.2831853;
const float ASPECT = ${aspect.toFixed(5)};
void main(){
  vec3 col = texture2D(base, uv).rgb;
  vec3 m = texture2D(masks, uv).rgb;
  vec4 s = texture2D(stars, uv);
  float phase = t / LOOP;
  vec2 q = vec2(uv.x * ASPECT, uv.y);
  float u = dot(q, normalize(vec2(1.0, 0.42)));
  float span = ASPECT + 0.9;
  float band = exp(-pow((u - (-0.45 + fract(phase) * span)) / 0.075, 2.0));
  float band2 = exp(-pow((u - ((span - 0.45) - fract(phase + 0.5) * span)) / 0.12, 2.0)) * 0.35;
  float shimmer = 0.5 + 0.5 * sin(TAU * phase * 2.0 + u * 14.0);
  float keep = 1.0 - m.b;
  float hl = (m.r * (band * 0.6 + band2 * 0.5 + shimmer * 0.07) + m.g * (band + band2) * 0.07) * keep;
  col = 1.0 - (1.0 - col) * (1.0 - clamp(hl, 0.0, 1.0) * vec3(1.0, 0.975, 0.94));
  float k = floor(s.b * 255.0 / 80.0 + 0.5);
  float tw = sin(TAU * (k * phase + s.g)) * sin(TAU * ((k + 2.0) * phase + s.g * 1.7));
  col *= mix(1.0, 1.0 + 0.75 * tw, s.r * keep);
  gl_FragColor = vec4(col, 1.0);
}`;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });

export interface HeroRenderer {
  render(t: number): void;
  dispose(): void;
}

export async function createHeroRenderer(out: HTMLCanvasElement): Promise<HeroRenderer> {
  const [base, masks, stars] = await Promise.all([
    loadImage('hero/base.webp'),
    loadImage('hero/masks.png'),
    loadImage('hero/stars.png'),
  ]);
  const W = base.naturalWidth, H = base.naturalHeight;
  out.width = W;
  out.height = H;

  const glc = document.createElement('canvas');
  glc.width = W;
  glc.height = H;
  const gl = glc.getContext('webgl', { premultipliedAlpha: false, antialias: false });
  if (!gl) throw new Error('WebGL unavailable');

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS(W / H)));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uT = gl.getUniformLocation(prog, 't');

  const textures = [base, masks, stars].map((img, unit) => {
    const tx = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    for (const [k, v] of [
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
      [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.uniform1i(gl.getUniformLocation(prog, ['base', 'masks', 'stars'][unit]), unit);
    return tx;
  });

  // Few faint motes on closed, loop-periodic paths (seeded → identical every load)
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const dust = Array.from({ length: 26 }, () => ({
    x: rnd() * W, y: rnd() * H,
    ax: 20 + rnd() * 60, ay: 14 + rnd() * 40,
    fy: rnd() < 0.5 ? 1 : 2,
    p1: rnd(), p2: rnd(), p3: rnd(),
    r: (0.6 + rnd() * 1.6) * (rnd() < 0.3 ? 3 : 1.6),
    a: 0.08 + rnd() * 0.22,
  }));

  const ctx = out.getContext('2d')!;

  return {
    render(t: number) {
      gl.viewport(0, 0, W, H);
      gl.uniform1f(uT, t % LOOP);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(glc, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      const ph = (t % LOOP) / LOOP;
      for (const d of dust) {
        const x = d.x + d.ax * Math.sin(TAU * (ph + d.p1));
        const y = d.y + d.ay * Math.sin(TAU * (d.fy * ph + d.p2));
        const a = d.a * (0.55 + 0.45 * Math.sin(TAU * (ph + d.p3)));
        const g = ctx.createRadialGradient(x, y, 0, x, y, d.r);
        g.addColorStop(0, `rgba(255,244,228,${a})`);
        g.addColorStop(1, 'rgba(255,244,228,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, TAU);
        ctx.fill();
      }
    },
    dispose() {
      textures.forEach((tx) => gl.deleteTexture(tx));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
