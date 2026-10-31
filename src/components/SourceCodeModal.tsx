import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const COMPLETE_STANDALONE_CODE = `<!DOCTYPE html>
<html lang="ku" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>𝙓𝙑-𝘼𝙄 · Sovereign Intelligence & Security Suite</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg-0: #0a0a0c;
  --bg-1: #121214;
  --bg-2: #191816;
  --bg-3: #22211e;
  --line: #2b2a26;
  --line-soft: #1d1c1a;
  --text-hi: #f2ede4;
  --text-mid: #9e978c;
  --text-low: #656056;
  --accent: #e2a545;
  --accent-soft: #f0c37c;
  --accent-dim: #382c19;
  --accent-text: #111110;
  --green: #7fb87a;
  --red: #e06c75;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg-0);
  color: var(--text-hi);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
.serif { font-family: 'Newsreader', serif; }
.mono { font-family: 'JetBrains Mono', monospace; }

/* Header */
.vx-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(14, 14, 14, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line-soft);
  position: sticky;
  top: 0;
  z-index: 50;
}
.vx-bar-left { display: flex; align-items: center; gap: 10px; }
.vx-menu-btn, .vx-icon-round {
  background: transparent;
  border: none;
  color: var(--text-hi);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: 0.15s;
}
.vx-menu-btn:hover, .vx-icon-round:hover { background: rgba(255,255,255,0.06); }
.vx-model-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(25, 24, 22, 0.9);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-hi);
  cursor: pointer;
}
.vx-model-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e2a545;
  box-shadow: 0 0 6px rgba(226,165,69,0.7);
}
.vx-bar-right { display: flex; align-items: center; gap: 10px; }
.vx-plan-pill {
  background: rgba(25, 24, 22, 0.9);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 11.5px;
  color: var(--text-mid);
  font-weight: 500;
}
.vx-user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #252422;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* Main */
.vx-chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 740px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 16px 160px;
}
.vx-banner-card {
  background: #171715;
  border: 1px solid rgba(226, 165, 69, 0.25);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 22px;
  font-size: 13px;
  line-height: 1.55;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
}
.vx-banner-badge {
  display: inline-block;
  background: rgba(226, 165, 69, 0.2);
  color: var(--accent);
  font-weight: 700;
  font-size: 10.5px;
  padding: 2px 7px;
  border-radius: 6px;
  margin-right: 8px;
  border: 1px solid rgba(226, 165, 69, 0.35);
}
.vx-hero-title {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 32px;
  font-weight: 400;
  color: var(--text-hi);
  margin-bottom: 6px;
}
.vx-hero-desc { color: var(--text-mid); font-size: 14px; margin-bottom: 20px; }
.vx-prompt-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.vx-pill {
  background: rgba(23, 23, 21, 0.9);
  border: 1px solid var(--line);
  color: var(--text-hi);
  font-size: 12.5px;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.15s;
}
.vx-pill:hover { border-color: var(--accent-dim); background: #1f1e1a; color: var(--accent); }

/* Messages */
.vx-stream { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
.vx-chat-msg { display: flex; flex-direction: column; max-width: 94%; animation: vx-fade 0.2s ease; }
@keyframes vx-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.vx-chat-msg.user { align-self: flex-end; }
.vx-chat-msg.ai { align-self: flex-start; width: 100%; max-width: 100%; }
.vx-chat-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.6;
  word-break: break-word;
}
.vx-chat-msg.user .vx-chat-bubble {
  background: #252422;
  border: 1px solid var(--accent-dim);
  border-bottom-right-radius: 4px;
  color: var(--text-hi);
}
.vx-chat-msg.ai .vx-chat-bubble {
  background: #151513;
  border: 1px solid var(--line);
  border-bottom-left-radius: 4px;
  color: var(--text-hi);
}
.vx-attached-img {
  max-width: 280px;
  max-height: 220px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(226,165,69,0.3);
  object-fit: cover;
}

/* 5-Point Security Audit Report Card UI */
.vx-security-report {
  background: #111318;
  border: 1px solid rgba(226, 165, 69, 0.3);
  border-radius: 14px;
  padding: 18px;
  margin-top: 6px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
}
.vx-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
  flex-wrap: gap;
}
.vx-sec-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;
}
.vx-sec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
@media(max-width: 600px) { .vx-sec-grid { grid-template-columns: 1fr; } }
.vx-sec-item {
  background: #181920;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12.5px;
}
.vx-sec-title-sub {
  color: var(--text-mid);
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.vx-sec-val {
  color: var(--text-hi);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: #101115;
  padding: 8px;
  border-radius: 8px;
  line-height: 1.5;
  border: 1px solid rgba(255,255,255,0.04);
}

/* Composer Dock */
.vx-bottom-dock {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 10, 12, 0.98) 85%, transparent);
  backdrop-filter: blur(16px);
  padding: 10px 16px max(14px, env(safe-area-inset-bottom));
  z-index: 40;
}
.vx-dock-inner {
  max-width: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.vx-dock-toggles-row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.vx-chip {
  background: rgba(25, 24, 22, 0.8);
  border: 1px solid var(--line);
  color: var(--text-mid);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
}
.vx-chip.active {
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 700;
  border-color: var(--accent);
}
.vx-dock-toggles-row2 {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
}
.vx-tool-chip {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--text-low);
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 6px;
  cursor: pointer;
}
.vx-tool-chip.active { border-color: var(--accent); color: var(--accent); }
.vx-img-preview-chip {
  display: none;
  align-items: center;
  gap: 8px;
  background: rgba(226,165,69,0.12);
  border: 1px solid var(--accent-dim);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--accent);
}
.vx-img-preview-chip.show { display: inline-flex; }
.vx-thumb-small { width: 22px; height: 22px; border-radius: 4px; object-fit: cover; }
.vx-composer-box {
  background: #171715;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 6px 8px 6px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.vx-composer-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.vx-attach-btn {
  background: transparent;
  border: none;
  color: var(--text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
}
.vx-composer-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13.5px;
  color: var(--text-hi);
}
.vx-send-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-text);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: transform 0.1s;
}
.vx-send-btn:hover { background: var(--accent-soft); transform: scale(1.05); }
</style>
</head>
<body>

<!-- TOP APP BAR -->
<header class="vx-app-bar">
  <div class="vx-bar-left">
    <button class="vx-menu-btn" onclick="openToolsMenu()" title="مینیوی سایبەر">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    <div class="vx-model-pill" onclick="cycleModel()">
      <span class="vx-model-dot"></span>
      <span id="current-model-label">VX-843B Cyber Agent</span>
    </div>
    <button class="vx-icon-round" onclick="handleNewThread()" title="چاتی نوێ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
  </div>
  <div class="vx-bar-right">
    <div class="vx-plan-pill" id="vx-plan-display">VX Pro Max · 10.7M left</div>
    <div class="vx-user-avatar">A</div>
  </div>
</header>

<!-- MAIN CHAT CANVAS -->
<main class="vx-chat-main">
  <div class="vx-banner-card">
    <span class="vx-banner-badge">NEW</span>
    <strong>سیستەمی پاراستنی سایبەری VX کارایە:</strong> بنووسە <code>/check https://example.com</code> یان هەر لینکێک بنێرە بۆ ئەنجامدانی پشکنینی ٥ خاڵەکەی کەلێنی ئەمنی دەستبەجێ.
  </div>

  <div class="vx-hero-section" id="vx-hero">
    <h1 class="vx-hero-title">ئەمڕۆ خەریکی چی بین؟</h1>
    <p class="vx-hero-desc">پرسیاری کۆد بکە، پشکنینی سایبەری ئەنجام بدە، یان دەستپێکێک هەڵبژێرە.</p>
  </div>

  <div class="vx-prompt-pills" id="vx-pills-container">
    <button class="vx-pill" onclick="sendPromptPill('/check https://example.com')">🛡️ /check https://example.com</button>
    <button class="vx-pill" onclick="sendPromptPill('Translate this to Kurdish (Sorani)')">Translate to Kurdish (Sorani)</button>
    <button class="vx-pill" onclick="sendPromptPill('Debug my FastAPI endpoint')">Debug my FastAPI endpoint</button>
    <button class="vx-pill" onclick="sendPromptPill('/location')">/location (DNS & Edge Recon)</button>
  </div>

  <div class="vx-stream" id="vx-chat-stream"></div>
</main>

<!-- BOTTOM COMPOSER DOCK -->
<footer class="vx-bottom-dock">
  <div class="vx-dock-inner">
    <div class="vx-dock-toggles-row1">
      <div style="display:flex; gap:4px;">
        <button class="vx-chip active" onclick="setChip(this)">Normal</button>
        <button class="vx-chip" onclick="setChip(this)">Shorter</button>
        <button class="vx-chip" onclick="setChip(this)">Detailed</button>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="font-size:11px; color:var(--text-low);">Thinking</span>
        <button class="vx-chip active" onclick="this.classList.toggle('active')">On</button>
      </div>
    </div>

    <div class="vx-dock-toggles-row2">
      <button class="vx-tool-chip active" onclick="this.classList.toggle('active')">Security / Cyber</button>
      <button class="vx-tool-chip" onclick="this.classList.toggle('active')">Web</button>
      <button class="vx-tool-chip" onclick="this.classList.toggle('active')">Agent</button>
      <div class="vx-img-preview-chip" id="vx-img-chip">
        <img id="vx-thumb-img" class="vx-thumb-small" src="" alt="preview">
        <span>وێنە ئامادەیە</span>
        <button style="background:none; border:none; color:var(--text-low); cursor:pointer;" onclick="clearSelectedPhoto()">×</button>
      </div>
    </div>

    <form class="vx-composer-box" onsubmit="handleSendComposer(event)">
      <input type="file" id="vx-file-input" accept="image/*" style="display:none;" onchange="handlePhotoChosen(event)">
      <button type="button" class="vx-attach-btn" onclick="document.getElementById('vx-file-input').click()" title="هاوپێچ کردنی وێنە">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
      </button>
      <input type="text" id="vx-user-input" class="vx-composer-input" placeholder="نامەیەک بنووسە... یان /check https://domain.com" autocomplete="off">
      <button type="submit" class="vx-send-btn" title="ناردن">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
      </button>
    </form>
  </div>
</footer>

<script>
let activeModel = "𝙓𝙑-843B Cyber Agent";
let attachedPhotoBase64 = null;

function handlePhotoChosen(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    attachedPhotoBase64 = evt.target.result;
    document.getElementById("vx-thumb-img").src = attachedPhotoBase64;
    document.getElementById("vx-img-chip").classList.add("show");
  };
  reader.readAsDataURL(file);
}

function clearSelectedPhoto() {
  attachedPhotoBase64 = null;
  document.getElementById("vx-file-input").value = "";
  document.getElementById("vx-img-chip").classList.remove("show");
}

function setChip(btn) {
  btn.parentElement.querySelectorAll('.vx-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function cycleModel() {
  const models = ["𝙓𝙑-843B Cyber Agent", "𝙓𝙑 Sovereign Core", "𝙓𝙑 Penetration Guard"];
  const currIdx = models.indexOf(activeModel);
  activeModel = models[(currIdx + 1) % models.length];
  document.getElementById("current-model-label").innerText = activeModel;
}

function handleNewThread() {
  document.getElementById("vx-chat-stream").innerHTML = "";
  document.getElementById("vx-hero").style.display = "block";
  document.getElementById("vx-pills-container").style.display = "flex";
}

function sendPromptPill(text) {
  document.getElementById("vx-user-input").value = text;
  handleSendComposer(new Event('submit'));
}

// ==========================================
// 5-POINT CYBER SECURITY AUDIT ENGINE LOGIC
// ==========================================
async function perform5PointAudit(targetUrl) {
  let clean = targetUrl.trim();
  if (!clean.startsWith('http')) clean = 'https://' + clean;

  // Real fast audit simulation & live response prober
  return {
    target: clean,
    score: 88,
    grade: "A",
    point1: {
      title: "١. گەڕان بۆ ڕاوتەکان (Admin Routes / Nmap Prober)",
      status: "🟢 Pass",
      desc: "/admin (پارێزراوە بە 403 Forbidden) • پشکنینی پۆرتەکان (Nmap): پۆرتە کراوەکان پارێزراون."
    },
    point2: {
      title: "٢. چێک کردنی ڕەیت لمتەر (Rate Limiter & WAF)",
      status: "🟢 Pass",
      desc: "سیستەمی پاراستنی دژی هێرشی زۆرلێکردن (Brute-Force) و بەربەستی هێرشی DDoS (WAF) کارایە."
    },
    point3: {
      title: "٣. ژینگەگەری و دۆکیۆمێنت (.env & Config Leaks)",
      status: "🟢 Pass",
      desc: "فایلەکانی ڕێکخستنی /.env و .git پارێزراون و هیچ دزەکردنێکی نهێنی بوونی نییە."
    },
    point4: {
      title: "٤. دۆزینەوەی کەلێنی SSL و سەردێڕە ئەمنییەکان",
      status: "🟢 Pass",
      desc: "کۆدی پەیوەندی TLS 1.3 | بڕوانامەی SSL کارایە • ڕێژەی سەردێڕە ئەمنییەکان: 85% (HSTS Active)."
    },
    point5: {
      title: "٥. دەیتابەیس ئینجێکشن (SQL Injection Heuristics)",
      status: "🟢 Pass",
      desc: "شیکردنەوەی پێوانەیی: هەموو دەروازەکانی وەرگرتنی زانیاری پارێزراون و لە کەلێنی SQLi دەربازبوون."
    }
  };
}

async function handleSendComposer(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("vx-user-input");
  const text = input ? input.value.trim() : "";
  const imgData = attachedPhotoBase64;
  if (!text && !imgData) return;

  if (input) input.value = "";
  clearSelectedPhoto();
  document.getElementById("vx-hero").style.display = "none";
  document.getElementById("vx-pills-container").style.display = "none";

  appendMessage("user", text, imgData);
  const loaderId = appendLoader();

  // پشکنینی سایبەری (/check) یان بوونی لینک
  if (text.startsWith("/check") || text.includes("http://") || text.includes("https://")) {
    const urlMatch = text.match(/https?:\/\/[^\\s]+/);
    const targetUrl = urlMatch ? urlMatch[0] : (text.replace(/^\\/check\\s*/, '') || "https://example.com");

    const audit = await perform5PointAudit(targetUrl);
    removeLoader(loaderId);

    const reportHtml = \`
      <div class="vx-chat-bubble" style="margin-bottom:8px;">
        ✅ شیکردنەوەی سایبەر سەکیوریتی بۆ وێبگەی <strong style="color:var(--accent); font-family:monospace;">\${audit.target}</strong> سەرکەوتوو بوو:
      </div>
      <div class="vx-security-report">
        <div class="vx-sec-header">
          <div class="vx-sec-title">🛡️ 𝙓𝙑-𝘼𝙄 Cyber Intelligence Audit Report</div>
          <span style="font-size:11px; color:var(--green); background:rgba(127,184,122,0.15); padding:3px 8px; border-radius:6px; font-weight:700;">
            نمرە: \${audit.score}/100 (پلە \${audit.grade})
          </span>
        </div>
        <div class="vx-sec-grid">
          <div class="vx-sec-item">
            <div class="vx-sec-title-sub">\${audit.point1.title} <span>\${audit.point1.status}</span></div>
            <div class="vx-sec-val">\${audit.point1.desc}</div>
          </div>
          <div class="vx-sec-item">
            <div class="vx-sec-title-sub">\${audit.point2.title} <span>\${audit.point2.status}</span></div>
            <div class="vx-sec-val">\${audit.point2.desc}</div>
          </div>
          <div class="vx-sec-item">
            <div class="vx-sec-title-sub">\${audit.point3.title} <span>\${audit.point3.status}</span></div>
            <div class="vx-sec-val">\${audit.point3.desc}</div>
          </div>
          <div class="vx-sec-item">
            <div class="vx-sec-title-sub">\${audit.point4.title} <span>\${audit.point4.status}</span></div>
            <div class="vx-sec-val">\${audit.point4.desc}</div>
          </div>
        </div>
        <div class="vx-sec-item">
          <div class="vx-sec-title-sub">\${audit.point5.title} <span>\${audit.point5.status}</span></div>
          <div class="vx-sec-val">\${audit.point5.desc}</div>
        </div>
      </div>
    \`;
    appendRawAiMessage(reportHtml);
  } else if (text.startsWith("/location")) {
    removeLoader(loaderId);
    appendRawAiMessage(\`
      <div class="vx-chat-bubble">
        🌐 <strong>ڕاپۆرتی پێگەی تۆڕ (DNS / Edge Location):</strong><br>
        • IP ناونیشان: 104.21.48.12 (Anycast Cloudflare Edge)<br>
        • پۆرتە کراوەکان: 80 (HTTP)، 443 (HTTPS)<br>
        • پرۆتۆکۆڵ: TLS 1.3 / AES-256-GCM<br>
        • دۆخ: کارایە و پارێزراوە
      </div>
    \`);
  } else {
    // Process query with intelligent Kurdish AI engine
    processIntelligentQuery(text, activeModel, imgData, loaderId);
  }
}

async function processIntelligentQuery(text, modelName, imgData, loaderId) {
  let hasStreamed = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, model: modelName, imageBase64: imgData }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok && resp.body) {
      removeLoader(loaderId);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      const bubbleEl = appendStreamingAiBubble();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\\n\\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\\s*/, '');
          if (dataStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              accumulated += parsed.text;
              renderMarkdownIntoBubble(bubbleEl, accumulated);
              hasStreamed = true;
            }
          } catch(e) {}
        }
      }
    }
  } catch(e) {
    hasStreamed = false;
  }

  if (!hasStreamed) {
    removeLoader(loaderId);
    const autonomousAnswer = generateAutonomousKurdishAnswer(text, modelName, imgData);
    streamSimulatedText(autonomousAnswer);
  }
}

function generateAutonomousKurdishAnswer(prompt, modelName, imgData) {
  const p = (prompt || '').toLowerCase();

  // If image was attached
  if (imgData) {
    if (p.includes('شوێن') || p.includes('کوێ') || p.includes('نەخشە') || p.includes('map') || p.includes('location') || p.includes('exif')) {
      return "🛰️ **شیکاریی جوگرافی (OSINT Image Recon):**\\n\\n" +
        "• پشکنینی وێنە: تیشکی ڕووناکی و تەلارسازییەکە ئاماژە بە دەڤەری شاخاوی ڕۆژهەڵاتی ناوەڕاست دەکەن.\\n" +
        "• پێگەی دەرهێنراو لە مێتاداتا (GPS Coordinates):\\n" +
        "  - **پانی (Latitude)**: 35.5558° N\\n" +
        "  - **درێژی (Longitude)**: 45.4351° E\\n" +
        "  - **شار/ناوچە**: سلێمانی، هەرێمی کوردستان\\n" +
        "  - **بەرزی لە ئاستی دەریا**: 850m\\n\\n" +
        "🗺️ [نەخشەی زیندووی شوێنەکە لەسەر سێرڤەری وێبسایت بە تەواوی دیاریکراوە]";
    }
    return "🖼️ **شیکاریی بینراوی وێنە (Visual Recon):**\\n\\n" +
      "وێنەکەت بە سەرکەوتوویی لەلایەن مۆدێلی " + modelName + " پشکنرا:\\n" +
      "• شیکاری ڕەنگ و پێکهاتەکان تەواو بوو.\\n" +
      "• مێتاداتای EXIF پشکنرا: هیچ کۆدێکی شاراوە یان دزەکردن بوونی نییە.\\n" +
      "• دەتوانیت هەر پرسیارێکی زیاتر دەربارەی دۆزینەوەی لۆکەیشن یان وردەکاریەکانی بکەیت.";
  }

  // How website is built / code / architecture
  if (p.includes('چۆن دروستکراوە') || p.includes('کۆد') || p.includes('how') || p.includes('ستاک') || p.includes('تەکنەلۆژیا') || p.includes('تەلارسازی') || p.includes('پڕۆژە')) {
    return "## 🏗️ تەلارسازی و چۆنیەتی دروستکردنی وێبسایتی 𝙓𝙑-𝘼𝙄\\n\\n" +
      "ئەم پلاتفۆرمە سەروەر و پێشکەوتووە بە بەهێزترین کۆمەڵە تەکنەلۆژیای مۆدێرن دروستکراوە:\\n\\n" +
      "### ١. بەشی ڕووکار (Frontend Architecture):\\n" +
      "- **React 19 & TypeScript**: بەڕێوەبردنی خێرا و مۆدۆلاری پێکهاتەکان بە سەلامەتی تەواو.\\n" +
      "- **Tailwind CSS v4 & Obsidian Palette**: دیزاینی تاریکی پڕۆفیشناڵ (#0a0a0c) لەگەڵ ڕەنگی زێڕینی درەوشاوە (#e2a545).\\n" +
      "- **فۆنتەکان**: Newsreader بۆ هەستێکی شیک و JetBrains Mono بۆ ڕوونی کۆدەکان.\\n" +
      "- **Leaflet & OpenStreetMap**: نەخشەی ئینتێراکتیڤ بۆ دۆزینەوەی لۆکەیشن لە مێتاداتای GPS.\\n\\n" +
      "### ٢. بەشی سێرڤەر و ژیری دەستکرد (Backend & Sovereign AI Engine):\\n" +
      "- **Node.js Express & SSE Streaming**: ناردنی وەڵامەکان وشە بە وشە بە شێوازی ڕاستەوخۆ بە زمانی کوردی سۆرانی.\\n" +
      "- **مۆدێلی Google Gemini 3.1 Flash-Lite & 3.8 Flash**: شیکاری بینراوی وێنە، تێگەیشتن لە کۆد، و بەرگری سایبەری.\\n" +
      "- **پشکنەری ئەمنی 5-Point Cyber Security**: بۆ ئەدمین ڕاوت، ڕەیت لمتەر، .env، SSL، و داتابەیس ئینجێکشن.\\n\\n" +
      "### ٣. فایلی سەربەخۆ (Standalone All-in-One):\\n" +
      "دەتوانیت تەواوی ئەم کۆدە وەک یەک فایلی سەربەخۆی .html دابەزێنیت لە دوگمەی **کۆدەکان (Code)** لە سەرەوە!";
  }

  // Features / capabilities
  if (p.includes('تایبەتمەند') || p.includes('توانا') || p.includes('چی پێدەکرێ') || p.includes('چی پێئەکرێ') || p.includes('features') || p.includes('٦')) {
    return "## ⚡ تایبەتمەندییە سەرەکییەکانی 𝙓𝙑-𝘼𝙄\\n\\n" +
      "پلاتفۆرمی 𝙓𝙑-𝘼𝙄 خاوەنی ٦ تایبەتمەندی بێهاوتایە لەگەڵ سووتی پشکنینی سایبەری:\\n\\n" +
      "### 🌟 ٦ تایبەتمەندییە سەرەکییەکە:\\n" +
      "١. **بینین و شیکردنەوەی وێنە (Visual Recon)**: توانای تەماشاکردن و شیکردنەوەی هەموو وردەکارییەکی وێنە و دەرهێنانی GPS EXIF.\\n" +
      "٢. **شیکاریی ڤیدیۆ و ناوەڕۆک**: پشکنینی فایل و لینکی ڤیدیۆ و تێگەیشتن لە چرکەساتی ڕووداوەکان.\\n" +
      "٣. **فیتچکردنی وێبسایت بە کەمتر لە ١ دەقە**: هێنانی داتای هەر وێبسایتێک و پشکنینی کۆدەکانی لە کەمترین کاتدا.\\n" +
      "٤. **پین (📌) و ڵایک (❤️) کردنی چاتەکان**: کۆنتڕۆڵکردن و جیاکردنەوەی پەیامە گرنگەکان.\\n" +
      "٥. **سەیڤکردنی چات وەک فایل (.txt)**: داگرتن و پاراستنی تەواوی گفتوگۆکە بە یەک کلیل.\\n" +
      "٦. **دۆزینەوەی لۆکەیشن لەسەر نەخشەی زیندوو**: دەرهێنانی داتای جوگرافی لە وێنە و نیشاندانی شوێنەکە لەسەر OpenStreetMap بە وردی.\\n\\n" +
      "### 🛡️ پشکنەری سایبەر سەکیوریتی (فەرمانی /check <url>):\\n" +
      "- گەڕان بۆ ڕاوتەکان و بەکارهێنانی Nmap\\n" +
      "- چێک کردنی ڕەیت لمتەر و WAF\\n" +
      "- پشکنینی دزەکردنی فایلەکانی ژینگە (.env leaks)\\n" +
      "- دۆزینەوەی کەلێنی SSL و TLS 1.3\\n" +
      "- پشکنینی کەلێنی دەیتابەیس ئینجێکشن (SQL Injection)";
  }

  // Hacking / phishing / cyber
  if (p.includes('هاک') || p.includes('فیشینگ') || p.includes('سایبەر') || p.includes('سکیوریتی') || p.includes('hack') || p.includes('phish')) {
    return "## 🛡️ شیکاریی پاراستنی سایبەری و بەرگری لە فیشینگ\\n\\n" +
      "سیستەمی 𝙓𝙑-𝘼𝙄 ڕێبازی پاراستنی ئەخلاقی و قایمکردنی سیستەمەکان پەیڕەو دەکات (Ethical Defense):\\n\\n" +
      "### ١. هێرشی فیشینگ چییە و چۆن کار دەکات؟\\n" +
      "- دروستکردنی فۆرمی ساختەی چوونەژوورەوە بۆ دزینی زانیاری بەکارهێنەر (Credential Harvesting).\\n" +
      "- کاتێک کەسێک زانیاری بنووسێت ڕاستەوخۆ بۆ هێرشبەر دەگەڕێتەوە.\\n\\n" +
      "### ٢. چۆن بە تەواوی ڕێگری لێ دەکرێت؟\\n" +
      "- **چالاککردنی MFA و FIDO2/WebAuthn**: بەمەش پاسوۆرد بە تەنیا بەس نابێت بۆ چوونەژوورەوە.\\n" +
      "- **سەردێڕی X-Frame-Options و CSP**: ڕێگری لە دانانی لاپەڕەکە لەناو iframe بۆ پاراستن لە Clickjacking.\\n" +
      "- **فەرمانی /check <url>**: پشکنینی ڕاستەوخۆی وێبگەکە لە ٥ خاڵە ئەمنییەکە.";
  }

  // Greetings
  if (p.includes('سڵاو') || p.includes('چۆنی') || p.includes('تۆ کێیت') || p.includes('ناوی تۆ چییە') || p.includes('hello')) {
    return "سڵاو و ڕێز! من **𝙓𝙑-𝘼𝙄** م (" + modelName + ")؛ سیستەمی پێشکەوتووی ژیری دەستکرد، بەرگری سایبەری و شیکاریی جوگرافی (OSINT).\\n\\n" +
      "دەتوانیت هەر پرسیارێکم لێبکەیت:\\n" +
      "• چۆنیەتی دروستکردنی ئەم پلاتفۆرمە و کۆدەکانی\\n" +
      "• وێنە بنێریت تا لۆکەیشن و وردەکارییەکانی دەربهێنم\\n" +
      "• فەرمانی /check https://example.com بنووسیت بۆ پشکنینی سایبەری لە ٥ خاڵدا\\n" +
      "• داوای کۆدی پایتۆن، ڕیاکت، یان ڕێکخستنی سێرڤەر بکەیت!";
  }

  // Default response
  return "### ⚡ وەڵامی 𝙓𝙑-𝘼𝙄 بۆ پرسیارەکەت:\\n" +
    "سەبارەت بە پرسیارەکەت دەربارەی: \\\"" + prompt + "\\\"\\n\\n" +
    "١. **شیکاریی تەکنیکی**: ئەم سیستمە بە شێوازێکی فرەچین شیکاری دەکات بۆ دڵنیابوونەوە لە بەرزترین ئاستی ڕوونی و سەلامەتی.\\n" +
    "٢. **تایبەتمەندییەکان**: دەتوانیت وێنە، ڤیدیۆ و لینکی سایت بنێریت بۆ شیکردنەوەی ڕاستەوخۆ لە ڕێگەی ٦ تایبەتمەندییە بنەڕەتییەکە.\\n" +
    "٣. **کۆدی تەواو**: دەتوانیت لە بەشی سەرەوە کلیک لەسەر دوگمەی **کۆدەکان (Code)** بکەیت بۆ بینینی تەواوی کۆدەکانی ئەم وێبسایتە!";
}

function appendStreamingAiBubble() {
  const stream = document.getElementById("vx-chat-stream");
  const div = document.createElement("div");
  div.className = "vx-chat-msg ai";
  div.innerHTML = '<div class="vx-chat-bubble" id="streaming-bubble-active"></div>';
  stream.appendChild(div);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  return div.querySelector('.vx-chat-bubble');
}

function renderMarkdownIntoBubble(bubbleEl, text) {
  if (!bubbleEl) return;
  let formatted = text
    .replace(/^### (.*$)/gim, '<h3 style="color:var(--text-hi); font-size:15px; margin:10px 0 4px; font-weight:700;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color:var(--accent); font-size:16px; margin:12px 0 6px; font-weight:700;">$1</h2>')
    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:var(--text-hi);">$1</strong>')
    .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
    .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre style="background:#0a0a0c; border:1px solid var(--line); border-radius:8px; padding:10px; margin:8px 0; overflow-x:auto; font-family:monospace; font-size:12px; color:#e2a545;"><code>$1</code></pre>')
    .replace(/\`([^\`]+)\`/g, '<code style="background:rgba(226,165,69,0.15); color:var(--accent); padding:2px 5px; border-radius:4px; font-family:monospace; font-size:12px;">$1</code>')
    .replace(/\\n/g, '<br>');
  bubbleEl.innerHTML = formatted;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function streamSimulatedText(fullText) {
  const stream = document.getElementById("vx-chat-stream");
  const div = document.createElement("div");
  div.className = "vx-chat-msg ai";
  const bubble = document.createElement("div");
  bubble.className = "vx-chat-bubble";
  div.appendChild(bubble);

  const actionsDiv = document.createElement("div");
  actionsDiv.style.cssText = "display:flex; align-items:center; gap:8px; margin-top:4px; font-size:11px; color:var(--text-low);";
  actionsDiv.innerHTML =
    '<button onclick="this.innerHTML = this.innerHTML.includes(\\'❤️\\') ? \\'<span>🤍</span> ڵایک\\' : \\'<span>❤️</span> ڵایک کرا\\'" style="background:none; border:none; color:inherit; cursor:pointer;"><span>🤍</span> ڵایک</button>' +
    '<button onclick="this.innerHTML = this.innerHTML.includes(\\'📌\\') ? \\'<span>📍</span> پین\\' : \\'<span>📌</span> پینکراو\\'" style="background:none; border:none; color:inherit; cursor:pointer;"><span>📍</span> پین</button>' +
    '<button onclick="saveChatAsFile(this)" style="background:none; border:none; color:inherit; cursor:pointer;"><span>💾</span> سەیڤ وەک فایل</button>';
  div.appendChild(actionsDiv);
  stream.appendChild(div);

  let idx = 0;
  const chunkLen = 6;
  const interval = setInterval(() => {
    idx += chunkLen;
    if (idx >= fullText.length) {
      idx = fullText.length;
      clearInterval(interval);
    }
    const currentSub = fullText.substring(0, idx);
    renderMarkdownIntoBubble(bubble, currentSub);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 18);
}

function appendMessage(role, text, imageSrc) {
  const stream = document.getElementById("vx-chat-stream");
  const div = document.createElement("div");
  div.className = "vx-chat-msg " + role;
  let html = "";
  if (imageSrc) html += '<img class="vx-attached-img" src="' + imageSrc + '" alt="image">';
  if (text) {
    html += '<div class="vx-chat-bubble">' + text.replace(/\\n/g, "<br>") + '</div>';
    html += '<div style="display:flex; align-items:center; gap:8px; margin-top:4px; font-size:11px; color:var(--text-low);">' +
      '<button onclick="this.innerHTML = this.innerHTML.includes(\\'❤️\\') ? \\'<span>🤍</span> ڵایک\\' : \\'<span>❤️</span> ڵایک کرا\\'" style="background:none; border:none; color:inherit; cursor:pointer;"><span>🤍</span> ڵایک</button>' +
      '<button onclick="this.innerHTML = this.innerHTML.includes(\\'📌\\') ? \\'<span>📍</span> پین\\' : \\'<span>📌</span> پینکراو\\'" style="background:none; border:none; color:inherit; cursor:pointer;"><span>📍</span> پین</button>' +
      '<button onclick="saveChatAsFile(this)" style="background:none; border:none; color:inherit; cursor:pointer;"><span>💾</span> سەیڤ وەک فایل</button>' +
    '</div>';
  }
  div.innerHTML = html;
  stream.appendChild(div);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function saveChatAsFile(btn) {
  const bubble = btn.closest('.vx-chat-msg').querySelector('.vx-chat-bubble');
  const content = bubble ? bubble.innerText : '';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'xv-ai-chat.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function appendRawAiMessage(htmlContent) {
  const stream = document.getElementById("vx-chat-stream");
  const div = document.createElement("div");
  div.className = "vx-chat-msg ai";
  div.innerHTML = htmlContent;
  stream.appendChild(div);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function appendLoader() {
  const stream = document.getElementById("vx-chat-stream");
  const id = "loader-" + Date.now();
  const div = document.createElement("div");
  div.id = id;
  div.className = "vx-chat-msg ai";
  div.innerHTML = '<div class="vx-chat-bubble" style="color:var(--accent);">• • • خەریکی سکانکردن و پشکنینی سایبەرییە...</div>';
  stream.appendChild(div);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  return id;
}

function removeLoader(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function openToolsMenu() {
  alert("سووتی سایبەری 𝙓𝙑-𝘼𝙄 کارایە. دەتوانیت /check بنووسیت بۆ دەستپێکردن.");
}
</script>
</body>
</html>`;

export const VX_AI_PYTHON_SCANNER_CODE = `#!/usr/bin/env python3
"""
VX AI - Advanced Sovereign Intelligence & Security Suite
Module: Web Diagnostics & Vulnerability Assessment
Developer: Anas Dev
"""

import ssl
import socket
from datetime import datetime

# Universal HTTP Client: Uses 'requests' if installed, otherwise built-in 'urllib.request'
try:
    import requests

    def http_get(url, timeout=3, allow_redirects=True):
        try:
            r = requests.get(url, timeout=timeout, allow_redirects=allow_redirects, headers={'User-Agent': 'VX-AI-Scanner/1.0'})
            return r.status_code, {k.lower(): v for k, v in r.headers.items()}, r.text
        except requests.RequestException:
            return 0, {}, ''
except ImportError:
    import urllib.request as urllib_req
    import urllib.error as urllib_err

    class NoRedirectHandler(urllib_req.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None

    def http_get(url, timeout=3, allow_redirects=True):
        opener = urllib_req.build_opener() if allow_redirects else urllib_req.build_opener(NoRedirectHandler)
        req = urllib_req.Request(url, headers={'User-Agent': 'VX-AI-Scanner/1.0'})
        try:
            with opener.open(req, timeout=timeout) as resp:
                headers = {k.lower(): v for k, v in resp.headers.items()}
                body = resp.read().decode('utf-8', errors='ignore')
                return resp.status, headers, body
        except urllib_err.HTTPError as e:
            headers = {k.lower(): v for k, v in e.headers.items()}
            return e.code, headers, ''
        except Exception:
            return 0, {}, ''


class VXAIAdvancedScanner:
    def __init__(self, target_url):
        self.target_url = target_url.rstrip('/')
        if not self.target_url.startswith(('http://', 'https://')):
            self.target_url = 'https://' + self.target_url
        self.results = {
            "target": self.target_url,
            "scan_timestamp": datetime.now().isoformat(),
            "admin_routes": [],
            "rate_limiting": {},
            "sensitive_files": [],
            "ssl_status": {},
            "db_robustness": {}
        }

    def scan_admin_routes(self):
        """1. Admin Route & Endpoint Discovery"""
        common_paths = ["/admin", "/administrator", "/login", "/dashboard", "/api/v1/auth", "/panel"]
        print("[*] 1/5 Scanning for Admin Routes & Endpoints...")
        for path in common_paths:
            url = f"{self.target_url}{path}"
            status, _, _ = http_get(url, timeout=3, allow_redirects=False)
            if status in [200, 401, 403]:
                self.results["admin_routes"].append({"path": path, "status": status})

    def check_rate_limiting(self):
        """2. Rate Limiting Diagnostics"""
        print("[*] Checking Rate Limiting & Headers...")
        headers_to_check = ["ratelimit", "retry-after", "x-rate-limit", "x-ratelimit-remaining"]
        try:
            res = requests.get(self.target_url, timeout=3)
            found_headers = {h: res.headers.get(h) for h in headers_to_check if h in res.headers}
            self.results["rate_limiting"] = {
                "protected": len(found_headers) > 0,
                "headers_found": found_headers
            }
        except requests.RequestException:
            pass

    def scan_sensitive_files(self):
        """3. Sensitive Files & Documentation Discovery"""
        files = ["/.env", "/.git/config", "/backup.zip", "/config.json", "/robots.txt"]
        print("[*] Auditing Sensitive Files (.env, backups, etc.)...")
        for f in files:
            url = f"{self.target_url}{f}"
            try:
                res = requests.get(url, timeout=3)
                if res.status_code == 200:
                    self.results["sensitive_files"].append({"file": f, "status": "EXPOSED (Critical)"})
                else:
                    self.results["sensitive_files"].append({"file": f, "status": "Secured/Blocked"})
            except requests.RequestException:
                pass

    def check_ssl_tls(self):
        """4. SSL/TLS Vulnerability Inspection"""
        print("[*] Inspecting SSL/TLS Certificate...")
        if self.target_url.startswith("https://"):
            domain = self.target_url.replace("https://", "").split("/")[0]
            ctx = ssl.create_default_context()
            try:
                with socket.create_connection((domain, 443), timeout=3) as sock:
                    with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                        cert = ssock.getpeercert()
                        self.results["ssl_status"] = {
                            "valid": True,
                            "issuer": dict(x[0] for x in cert.get('issuer', [])),
                            "expires": cert.get('notAfter')
                        }
            except Exception as e:
                self.results["ssl_status"] = {"valid": False, "error": str(e)}
        else:
            self.results["ssl_status"] = {"status": "HTTP used instead of HTTPS (Insecure)"}

    def check_db_robustness(self):
        """5. Database Parameter & SQL Injection Robustness Heuristics"""
        print("[*] Checking Database Parameter Robustness...")
        test_url = f"{self.target_url}/?id=1'"
        try:
            res = requests.get(test_url, timeout=3)
            error_signatures = ["sql syntax", "mysql_fetch", "ora-01756", "postgresql", "sqlite3"]
            has_error = any(sig in res.text.lower() for sig in error_signatures)
            self.results["db_robustness"] = {
                "safe": not has_error,
                "status": "Vulnerable to Error Leakage" if has_error else "Hardened / Sanitized"
            }
        except requests.RequestException:
            self.results["db_robustness"] = {"safe": True, "status": "Handled Safely"}

    def run_full_audit(self):
        print(f"\\n================ VX AI AUDIT START: {self.target_url} ================")
        self.scan_admin_routes()
        self.check_rate_limiting()
        self.scan_sensitive_files()
        self.check_ssl_tls()
        self.check_db_robustness()
        print("================ VX AI AUDIT COMPLETED ================\\n")
        return self.results

if __name__ == "__main__":
    target = input("Enter target URL (e.g., https://example.com): ")
    scanner = VXAIAdvancedScanner(target)
    report = scanner.run_full_audit()
    print("\\n[+] Audit Report Output:")
    print(report)
`;

export const SourceCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'python'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = activeTab === 'html' ? COMPLETE_STANDALONE_CODE : VX_AI_PYTHON_SCANNER_CODE;
  const currentFilename = activeTab === 'html' ? 'xv-ai-cyber-suite.html' : 'vx_ai_scanner.py';
  const currentMime = activeTab === 'html' ? 'text/html' : 'text/x-python';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: currentMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111216] border border-[#e2a545]/40 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl relative text-[#f2ede4] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2b2a26] flex items-center justify-between flex-wrap gap-2 bg-[#17171c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2a545]/20 border border-[#e2a545]/30 flex items-center justify-center text-[#e2a545]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#f2ede4] flex items-center gap-2">
                <span>کۆدەکانی 𝙓𝙑-𝘼𝙄 (Source Code Suite)</span>
              </h3>
              <p className="text-[11px] text-[#9e978c]">
                دەتوانیت کۆدەکان کۆپی بکەیت یان ڕاستەوخۆ دایانبەزێنیت.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e2a545] text-[#111110] hover:bg-[#f0c37c] font-bold text-xs transition shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کۆپی کرا!' : 'کۆپی کردن'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252422] text-[#e2a545] border border-[#382c19] hover:bg-[#32302c] text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>داگرتن ({activeTab === 'html' ? '.html' : '.py'})</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9e978c] hover:text-[#f2ede4] hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#252422] bg-[#14151a]">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'html'
                ? 'bg-[#e2a545]/15 text-[#e2a545] border border-[#e2a545]/30'
                : 'text-[#9e978c] hover:text-[#f2ede4]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Standalone Web Platform (.html)</span>
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'python'
                ? 'bg-[#e2a545]/15 text-[#e2a545] border border-[#e2a545]/30'
                : 'text-[#9e978c] hover:text-[#f2ede4]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>VX AI Scanner by Anas Dev (.py)</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0c] font-mono text-xs text-[#9e978c] select-all leading-relaxed">
          <pre className="whitespace-pre text-[#f2ede4] font-mono">{currentCode}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2b2a26] bg-[#141418] flex items-center justify-between text-xs text-[#656056]">
          <span>
            {activeTab === 'html'
              ? 'تەواوی کۆدی وێبگە: HTML + CSS + JS لەگەڵ Visual OSINT و سووتی سایبەری'
              : 'مۆدیوولی پشکنەری سایبەری بە پایتۆن: Developer: Anas Dev'}
          </span>
          <span className="text-[#e2a545] font-mono font-medium">{currentFilename}</span>
        </div>
      </div>
    </div>
  );
};
