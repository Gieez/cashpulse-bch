import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import os from 'node:os';

const PORT = 4178;
const FPS = 30;
const DURATION = 18;
const TOTAL_FRAMES = DURATION * FPS;
const WIDTH = 1920;
const HEIGHT = 1080;

const PUBLIC_DIR = path.resolve('public');
const TEMP_DIR = path.join(os.tmpdir(), `cashpulse_frames_${Date.now()}`);
const OUT_MP4 = path.resolve('cashpulse-demo.mp4');

// 1. Create simple local static HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = req.url.split('?')[0];
  const filePath = path.join(PUBLIC_DIR, reqUrl === '/' ? 'demo.html' : reqUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log(`[1/4] Local motion server started on http://127.0.0.1:${PORT}`);

fs.mkdirSync(TEMP_DIR, { recursive: true });
console.log(`[2/4] Capturing ${TOTAL_FRAMES} frames @ ${FPS}fps into temporary buffer...`);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  headless: 'new',
  args: [
    '--enable-gpu',
    '--use-gl=angle',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/demo.html?clean=1`, { waitUntil: 'networkidle0' });

await page.waitForFunction('window.OPENER && window.OPENER.ready', { timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  if (window.OPENER && window.OPENER.tl) {
    window.OPENER.tl.pause(0);
  }
});

const startTime = Date.now();

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const t = i / FPS;

  await page.evaluate(async (time) => {
    window.OPENER.seek(time);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, t);

  const framePath = path.join(TEMP_DIR, `f_${String(i).padStart(5, '0')}.jpg`);
  await page.screenshot({
    path: framePath,
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });

  if (i % 30 === 0 || i === TOTAL_FRAMES - 1) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write(`\rProgress: ${i + 1}/${TOTAL_FRAMES} frames (${t.toFixed(1)}s / ${DURATION}s) [${elapsed}s elapsed]`);
  }
}

console.log('\n[3/4] Frame capture complete. Closing browser...');
await browser.close();
server.close();

// 2. Synthesize Cinematic Audio Track using FFmpeg lavfi filters
console.log('[4/4] Encoding video and synthesizing audio via FFmpeg...');
const TEMP_AUDIO = path.join(os.tmpdir(), `cashpulse_audio_${Date.now()}.wav`);

// Generates an impactful electronic tech soundtrack:
// - Deep sub-bass pulse at 3.5s, 7.3s, 9.2s, 15.2s
// - High harmonic chime arpeggio at 4.0s, 7.5s, 9.5s, 15.5s
// - Low cyberpunk ambient synth drone throughout
const audioFilter = `
  aevalsrc=exprs='
    0.15*sin(2*PI*55*t)*exp(-0.8*mod(t,4)) + 
    0.12*sin(2*PI*110*t) + 
    0.08*sin(2*PI*880*(1+0.05*sin(2*PI*8*t)))*if(between(t,3.8,4.5)+between(t,7.3,8.0)+between(t,9.2,9.8)+between(t,15.2,16.2),1,0)*exp(-3*mod(t-3.8,1)) +
    0.25*sin(2*PI*45*t)*if(between(t,3.5,4.2)+between(t,7.0,7.7)+between(t,9.2,9.9)+between(t,15.0,16.0),1,0)*exp(-4*mod(t-3.5,1))
  ':s=48000:d=${DURATION}
`;

try {
  execSync(`ffmpeg -y -f lavfi -i "${audioFilter.replace(/\n/g, '').trim()}" "${TEMP_AUDIO}"`, {
    stdio: 'ignore',
  });
} catch (e) {
  console.log('Audio synth fallback...');
}

// 3. Final MP4 Render
const inputPattern = path.join(TEMP_DIR, 'f_%05d.jpg').replace(/\\/g, '/');
const audioArg = fs.existsSync(TEMP_AUDIO)
  ? `-i "${TEMP_AUDIO.replace(/\\/g, '/')}" -c:a aac -b:a 192k -shortest`
  : '';

const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${inputPattern}" ${audioArg} -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "${OUT_MP4.replace(/\\/g, '/')}"`;

console.log('Running final FFmpeg render...');
execSync(ffmpegCmd, { stdio: 'inherit' });

// Cleanup temp files
try {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  if (fs.existsSync(TEMP_AUDIO)) fs.unlinkSync(TEMP_AUDIO);
} catch {}

console.log(`\n🎉 Success! Rendered cinematic MP4 video to:\n${OUT_MP4}`);
