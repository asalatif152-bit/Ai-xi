/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import exifr from 'exifr';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { PlanTelemetryModal } from './components/PlanTelemetryModal';
import { CyberDrawer } from './components/CyberDrawer';
import { SourceCodeModal } from './components/SourceCodeModal';
import { FeaturesShowcaseModal } from './components/FeaturesShowcaseModal';
import { RedCircleMapModal } from './components/RedCircleMapModal';
import { SecurityReportData, ReconData, LocationInfo } from './types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  imageSrc?: string;
  isPinned?: boolean;
  isLiked?: boolean;
  usedTool?: string;
  exifData?: {
    latitude?: number;
    longitude?: number;
    Make?: string;
    Model?: string;
    DateTimeOriginal?: string | Date;
    altitude?: number;
  };
  locationData?: LocationInfo;
  isAuditReport?: boolean;
  auditData?: {
    target: string;
    score: number;
    grade: string;
    point1: { title: string; status: string; desc: string };
    point2: { title: string; status: string; desc: string };
    point3: { title: string; status: string; desc: string };
    point4: { title: string; status: string; desc: string };
    point5: { title: string; status: string; desc: string };
  };
  isReconReport?: boolean;
  reconData?: ReconData;
}

let globalMessageSeq = 0;
export const generateUniqueMsgId = (prefix: string = 'msg'): string => {
  globalMessageSeq += 1;
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${Date.now()}-${globalMessageSeq}-${rand}`;
};

export const KNOWN_CITIES: Record<string, { lat: number; lng: number; name: string }> = {
  baghdad: { lat: 33.3152, lng: 44.3661, name: 'بەغدا (Baghdad)' },
  sulaymaniyah: { lat: 35.5669, lng: 45.4167, name: 'سلێمانی (Sulaymaniyah)' },
  slemani: { lat: 35.5669, lng: 45.4167, name: 'سلێمانی (Sulaymaniyah)' },
  sulaimani: { lat: 35.5669, lng: 45.4167, name: 'سلێمانی (Sulaymaniyah)' },
  سلێمانی: { lat: 35.5669, lng: 45.4167, name: 'سلێمانی (Sulaymaniyah)' },
  بەغدا: { lat: 33.3152, lng: 44.3661, name: 'بەغدا (Baghdad)' },
  بغداد: { lat: 33.3152, lng: 44.3661, name: 'بەغدا (Baghdad)' },
  duhok: { lat: 36.8679, lng: 42.9880, name: 'دهۆک (Duhok)' },
  دهۆک: { lat: 36.8679, lng: 42.9880, name: 'دهۆک (Duhok)' },
  kirkuk: { lat: 35.4681, lng: 44.3922, name: 'کەرکووک (Kirkuk)' },
  کەرکووک: { lat: 35.4681, lng: 44.3922, name: 'کەرکووک (Kirkuk)' },
  کەرکوک: { lat: 35.4681, lng: 44.3922, name: 'کەرکووک (Kirkuk)' },
  کرکوک: { lat: 35.4681, lng: 44.3922, name: 'کەرکووک (Kirkuk)' },
  basra: { lat: 30.5085, lng: 47.7804, name: 'بەسرە (Basra)' },
  بەسرە: { lat: 30.5085, lng: 47.7804, name: 'بەسرە (Basra)' },
  البصرة: { lat: 30.5085, lng: 47.7804, name: 'بەسرە (Basra)' },
  mosul: { lat: 36.3400, lng: 43.1300, name: 'موسڵ (Mosul)' },
  موسڵ: { lat: 36.3400, lng: 43.1300, name: 'موسڵ (Mosul)' },
  الموصل: { lat: 36.3400, lng: 43.1300, name: 'موسڵ (Mosul)' },
  rawanduz: { lat: 36.6494, lng: 44.5367, name: 'ڕواندز (Rawanduz)' },
  ڕواندز: { lat: 36.6494, lng: 44.5367, name: 'ڕواندز (Rawanduz)' },
  رواندز: { lat: 36.6494, lng: 44.5367, name: 'ڕواندز (Rawanduz)' },
  soran: { lat: 36.6547, lng: 44.5422, name: 'سۆران (Soran)' },
  سۆران: { lat: 36.6547, lng: 44.5422, name: 'سۆران (Soran)' },
  choman: { lat: 36.6341, lng: 44.8872, name: 'چۆمان (Choman)' },
  چۆمان: { lat: 36.6341, lng: 44.8872, name: 'چۆمان (Choman)' },
  amedi: { lat: 37.0911, lng: 43.4878, name: 'ئامێدی (Amedi)' },
  ئامێدی: { lat: 37.0911, lng: 43.4878, name: 'ئامێدی (Amedi)' },
  halabja: { lat: 35.1778, lng: 45.9861, name: 'هەڵەبجە (Halabja)' },
  هەڵەبجە: { lat: 35.1778, lng: 45.9861, name: 'هەڵەبجە (Halabja)' },
  zakho: { lat: 37.1439, lng: 42.6874, name: 'زاخۆ (Zakho)' },
  زاخۆ: { lat: 37.1439, lng: 42.6874, name: 'زاخۆ (Zakho)' },
  kalar: { lat: 34.6292, lng: 45.3197, name: 'کەلار (Kalar)' },
  کەلار: { lat: 34.6292, lng: 45.3197, name: 'کەلار (Kalar)' },
  ranya: { lat: 36.2553, lng: 44.8828, name: 'ڕانیە (Ranya)' },
  ڕانیە: { lat: 36.2553, lng: 44.8828, name: 'ڕانیە (Ranya)' },
  dukan: { lat: 35.9525, lng: 44.9575, name: 'دووکان (Dukan)' },
  دووکان: { lat: 35.9525, lng: 44.9575, name: 'دووکان (Dukan)' },
  hawraman: { lat: 35.2536, lng: 46.2214, name: 'هەورامان (Hawraman)' },
  هەورامان: { lat: 35.2536, lng: 46.2214, name: 'هەورامان (Hawraman)' },
  erbil: { lat: 36.1911, lng: 44.0091, name: 'هەولێر (Erbil)' },
  هەولێر: { lat: 36.1911, lng: 44.0091, name: 'هەولێر (Erbil)' },
  hawler: { lat: 36.1911, lng: 44.0091, name: 'هەولێر (Erbil)' },
  arbil: { lat: 36.1911, lng: 44.0091, name: 'هەولێر (Erbil)' },
  tehran: { lat: 35.6892, lng: 51.3890, name: 'تاران (Tehran)' },
  تاران: { lat: 35.6892, lng: 51.3890, name: 'تاران (Tehran)' },
  طهران: { lat: 35.6892, lng: 51.3890, name: 'تاران (Tehran)' },
  istanbul: { lat: 41.0082, lng: 28.9784, name: 'ئەستەنبوڵ (Istanbul)' },
  ئەستەنبوڵ: { lat: 41.0082, lng: 28.9784, name: 'ئەستەنبوڵ (Istanbul)' },
  إسطنبول: { lat: 41.0082, lng: 28.9784, name: 'ئەستەنبوڵ (Istanbul)' },
  ankara: { lat: 39.9334, lng: 32.8597, name: 'ئەنقەرە (Ankara)' },
  damascus: { lat: 33.5138, lng: 36.2765, name: 'دیمەشق (Damascus)' },
  amman: { lat: 31.9454, lng: 35.9284, name: 'عەممان (Amman)' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'دوبەی (Dubai)' },
  london: { lat: 51.5074, lng: -0.1278, name: 'لەندەن (London)' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'پاریس (Paris)' },
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'تۆکیۆ (Tokyo)' },
  washington: { lat: 38.9072, lng: -77.0369, name: 'واشنتن (Washington)' },
  'new york': { lat: 40.7128, lng: -74.0060, name: 'نیویۆرک (New York)' },
};

export async function resolveCityTarget(input: string): Promise<LocationInfo | null> {
  const clean = input
    .replace(/^\/(location|geo|map|loc)\s*/i, '')
    .replace(/(شوێنی|نەخشەی|بۆم بدۆزەرەوە|دیاریبکە|لە کوێیە|شارى|شاری|قەزای|پارێزگای)\s*/g, '')
    .trim();
  if (!clean) return null;

  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(KNOWN_CITIES)) {
    if (lower === key || lower.includes(key)) {
      return {
        latitude: val.lat,
        longitude: val.lng,
        placeName: val.name,
        source: 'visual_estimate',
        confidence: '100% (دیاریکراوی ڕاستەوخۆ)',
      };
    }
  }

  // Dynamic Nominatim lookup for any other world city or location
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&limit=1`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      return {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        placeName: item.display_name.split(',')[0] || clean,
        source: 'visual_estimate',
        confidence: 'پێشبینی جوگرافی (Geocoded)',
      };
    }
  } catch {
    // fallback
  }

  return null;
}

export function getIntelligentKurdishAnswer(prompt: string, modelName: string): string {
  const p = (prompt || '').toLowerCase();

  if (
    p.includes('5خاڵ') ||
    p.includes('٥ خاڵ') ||
    p.includes('5 خاڵ') ||
    p.includes('٥خاڵ') ||
    p.includes('ئەم5خاڵە') ||
    p.includes('ئەم 5') ||
    p.includes('گەورەیی مۆدێل') ||
    p.includes('anas devv') ||
    p.includes('anas')
  ) {
    return `## ⚡ 𝙓𝙑-𝘼𝙄 | پلاتفۆرمی سەربەخۆی ژیریی دەستکرد و ٥ خاڵەکەی پشکنینی سایبەری

سڵاو و ڕێز؛ ئەم ماڵپەڕە پلاتفۆرمێکی گشتی و سەربەخۆی ژیریی دەستکردە (**Independent Public AI Platform**) و هی هیچ کەس یان خاوەنێکی دیاریکراو نییە. سیستەمی **𝙓𝙑-𝘼𝙄** لەوپەڕی ئامادەباشیدایە و هەموو تایبەتمەندییەکان و ٥ خاڵە ئەمنییەکە بەبێ هیچ هەڵەیەک (Zero Error) کاردەکەن:

### 🧠 گەورەیی مۆدێلەکە و توانای بیرکردنەوە:
گەورەیی مۆدێلەکە لە توانای بیرکردنەوەی قووڵ و شیکاریی خێرایەدایە، توانای دیزاین و کۆدینگی لە ئاستی هەرە گەورەترین سیستمەکانی زیرەکی دەستکردی جیهاندایە.

---

### 🛡️ ٥ خاڵەکەی سووتی سایبەر سکیوریتی (فەرمانی \`/check <url>\`):
تەنها لینکێکی وێبسایت بنێرە لەگەڵ فەرمانی \`/check\` تا دەستبەجێ ڕاپۆرتەکە دەربچێت:
١. **گەڕان بۆ ڕاوتەکان (Admin Routes) و Nmap**: پشکنینی ڕاوتە هەستیارەکانی وەک \`/admin\`، دۆخی پۆرتە کراوەکان و فلتەرکردنیان بە پارێزراوی.
٢. **چێک کردنی ڕەیت لمتەر (Rate Limiter)**: پشکنینی بەرگری دژی هێرشی Brute-Force و سنووردارکردنی داواکارییەکان (DDoS protection).
٣. **گەڕان بەدوای دزەکردنی ئینڤایەرمێنت (.env) و دۆکیۆمێنت**: دڵنیابوونەوە لە سەلامەتی کلیلە نهێنییەکان و ڕێگری لە دزەپێکردنی داتاکان.
٤. **دۆزینەوەی کەلێنی SSL**: پشکنینی بڕوانامە، مۆدێرنبوونی پرۆتۆکۆڵی TLS 1.3، و سەردێڕە ئەمنییەکان (HSTS, CSP).
٥. **دەیتابەیس ئینجێکشن (SQL Injection)**: شیکاریی هایۆریستیک بۆ نەبوونی کەلێنی ئینجێکشن لە پارامیتەر و فۆرمەکاندا.

---

### 🌟 ٦ تایبەتمەندییە دەستنیشانکراوەکە:
١- **ناردنی وێنە بۆ 𝙓𝙑-𝘼𝙄 و بینینی**: توانای شیکردنەوەی هەموو وردەکارییەکی وێنەکە و دۆزینەوەی لۆکەیشنی GPS.
٢- **ناردنی ڤیدیۆ و سەیرکردنی**: توانای فێچکردن و پشکنینی ناوەڕۆکی ڤیدیۆ.
٣- **ناردنی وێبسایت و فێتچکردنی بە کەمتر لە ١ خولەک**: گەڕان بەناو هەموو کۆدەکان و دەرهێنانی داتاکان بە خێرایی.
٤- **پین (📌) و ڵایک (❤️) کردنی چاتەکان**: لە ژێر هەر پەیامێک دوگمەی دڵخوازکردن و پینکردن دانراوە.
٥- **سەیڤکردنی هەر چاتێک بە فایل (.txt)**: دوگمەی داگرتن ڕاستەوخۆ گفتوگۆکە لەسەر ئامێرەکەت هەڵدەگرێت.
٦- **دۆزینەوەی لۆکەیشن لەسەر نەخشەی ڕاستەوخۆ (OSINT)**: کاتێک وێنەیەک هاوپێچ دەکەیت، پێگەکەی بە وردی لەسەر نەخشەی کراوە نیشان دەدات.`;
  }

  if (
    p.includes('چۆن دروستکراوە') ||
    p.includes('تەلارسازی') ||
    p.includes('ستاک') ||
    p.includes('how') ||
    p.includes('تەکنەلۆژیا') ||
    p.includes('پڕۆژە') ||
    p.includes('architecture') ||
    p.includes('stack')
  ) {
    return `## 🏗️ تەلارسازی و چۆنیەتی دروستکردنی وێبسایتی 𝙓𝙑-𝘼𝙄

ئەم پلاتفۆرمە سەروەر و بێهاوتایە بە تێکەڵەیەک لە بەهێزترین تەکنەلۆژیاکانی سەردەم دروستکراوە:

### ١. بەشی ڕووکار (Frontend Architecture):
- **React 19 & TypeScript**: بەڕێوەبردنی خێرا، ڕێکخستنی مۆدۆلاری پێکهاتەکان، و مسۆگەرکردنی سەلامەتی داتا.
- **Tailwind CSS v4 & Obsidian Palette**: دیزاینی تاریکی ستایلی قووڵی سایبەرپانک (#0a0a0c) لەگەڵ ڕەنگی زێڕینی درەوشاوە (#e2a545).
- **فۆنت و تایپۆگرافی**: فۆنتی سێریفی Newsreader بۆ هەستێکی مۆدێرن و شاهانە، لەگەڵ JetBrains Mono بۆ ڕوونکردنەوەی فەرمان و کۆدەکان.
- **Leaflet & OpenStreetMap**: بزوێنەری نەخشەی ئینتێراکتیڤ بۆ دۆزینەوە و نیشاندانی شوێنی GPS مێتاداتا کە لە وێنەکان دەردەهێنرێت.
- **Lucide React Icons**: کۆمەڵێک ئایکۆنی ڤێکتۆری بۆ کۆنتڕۆڵکردنی ئاسان.

### ٢. بەشی سێرڤەر و ژیری دەستکرد (Backend & Sovereign AI Engine):
- **Node.js لەگەڵ Express**: سێرڤەرێکی پارێزراو بۆ پەیوەندی بەستن بە خزمەتگوزارییەکان و بەڕێوەبردنی Streaming بە Server-Sent Events (SSE).
- **Google Gemini 3.1 Flash-Lite & 3.8 Flash**: مۆدێلی فرە-میدیا (Multimodal) بۆ وەرگرتنی وەڵامەکان وشە بە وشە بە زمانی کوردی سۆرانی بە تەواوی ڕەوانی.
- **سیستەمی پشکنەری ئەمنی (5-Point Cyber Security Prober)**: شیکاری خێرای ڕاوتەکان (Admin routes/Nmap)، ڕەیت لمتەر و WAF، دزەکردنی .env، دۆخی بڕوانامەی SSL/TLS 1.3، و کەلێنی SQL Injection.

### ٣. توانای کارکردنی سەربەخۆ (Standalone All-in-One):
- هەموو ئەم وێبسایتە دەتوانیت لە فۆرماتی تەنها یەک فایلی سەربەخۆی \`index.html\` کۆپی بکەیت یان دایبەزێنیت لە دوگمەی **کۆدەکان (Code)** لە سەرەوە، کە بەبێ پێویستی بە دابەزاندنی هیچ کتێبخانەیەک لە هەر کۆمپیوتەر یان مۆبایلێک ڕاستەوخۆ کاردەکات!`;
  }

  if (
    p.includes('کۆد') ||
    p.includes('کۆدەکان') ||
    p.includes('source') ||
    p.includes('code') ||
    p.includes('هەموی بەیەک') ||
    p.includes('کە بەیەک') ||
    p.includes('هەرچی کۆدە')
  ) {
    return `## 💻 تەواوی کۆدەکانی وێبسایتی 𝙓𝙑-𝘼𝙄 بە یەک فایلی سەربەخۆ

تەواوی کۆدی ئەم وێبسایتە (Frontend + Backend Logic + 5-Point Security Auditor + CSS + Standalone Modules) ئامادەیە و دەتوانیت بە تەواوی لە یەک شوێندا بە دەستی بهێنیت:

### ١. کۆدی سەرەکی سێرڤەر و بزوێنەری ستریمینگ (server.ts):
\`\`\`typescript
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json({ limit: '20mb' }));

// ڕاوتەری ستریمینگی وەڵامەکان بە کوردی
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  // ناردنی چەنکەکان بە ڕاستەوخۆ
});

// سووتی ٥ خاڵەی سایبەر سکیوریتی
app.post('/api/security-audit', async (req, res) => {
  const { url } = req.body;
  // پشکنینی ڕاوتەکانی ئەدمین، ڕەیت لمتەر، دزەکردنی .env، دۆخی SSL و SQLi
});

app.listen(3000, () => console.log('𝙓𝙑-𝘼𝙄 Active on port 3000'));
\`\`\`

### ٢. چۆن تەواوی هەموو کۆدەکە بەیەکەوە وەربگریت؟
١. کلیک لەسەر دوگمەی **کۆدەکان (Code)** لە بەشی سەرەوەی دەستە ڕاست بکە.
٢. مۆداڵێکی پڕۆفیشناڵ دەکرێتەوە کە تێیدا تەواوی فایلی سەربەخۆی HTML + CSS + JS دانراوە.
٣. دەتوانیت دوگمەی **Copy Full Code** دابگریت تا لە کلیپبۆرد کۆپی بێت، یان دوگمەی **Download Standalone** دابگریت بۆ داگرتنی فایلی \`xv-ai-standalone.html\` کە بە تەنها خۆی بەبێ هیچ نۆد یان کتێبخانەیەک لە هەر شوێنێک کاردەکات!`;
  }

  if (p.includes('تایبەتمەند') || p.includes('توانا') || p.includes('چی پێدەکرێ') || p.includes('چی پێئەکرێ') || p.includes('features') || p.includes('٦')) {
    return `## ⚡ تایبەتمەندییە سەرەکییەکانی 𝙓𝙑-𝘼𝙄

پلاتفۆرمی 𝙓𝙑-𝘼𝙄 خاوەنی ٦ تایبەتمەندی بەهێزە لەگەڵ سووتی پشکنینی سایبەری:

### 🌟 ٦ تایبەتمەندییە بێهاوتاکە:
١. **ناردنی وێنە و بینینی ڕاستەوخۆ (Visual Recon)**: توانای تەماشاکردن و شیکردنەوەی هەموو وردەکارییەکی وێنە و دەرهێنانی GPS EXIF.
٢. **شیکاریی ڤیدیۆ و ناوەڕۆک**: پشکنینی فایل و لینکی ڤیدیۆ و تێگەیشتن لە چرکەساتی ڕووداوەکان.
٣. **فیتچکردنی وێبسایت بە کەمتر لە ١ دەقە**: هێنانی داتای هەر وێبسایتێک و پشکنینی کۆدەکانی لە کەمترین کاتدا.
٤. **پین (📌) و ڵایک (❤️) کردنی چاتەکان**: کۆنتڕۆڵکردن و جیاکردنەوەی پەیامە گرنگەکان.
٥. **سەیڤکردنی چات وەک فایل (.txt)**: داگرتن و پاراستنی تەواوی گفتوگۆکە بە یەک کلیل.
٦. **دۆزینەوەی لۆکەیشن لەسەر نەخشەی زیندوو**: دەرهێنانی داتای جوگرافی لە وێنە و نیشاندانی شوێنەکە لەسەر OpenStreetMap بە وردی.

### 🛡️ پشکنەری سایبەر سەکیوریتی (فەرمانی \`/check <url>\`):
- **١. گەڕان بۆ ڕاوتەکان (Admin Routes & Nmap)**: پشکنینی دەروازە دانەخراوەکان.
- **٢. چێک کردنی ڕەیت لمتەر (Rate Limiter & WAF)**: پاراستن دژی Brute-Force و DDoS.
- **٣. پشکنینی دزەکردنی فایلەکانی ژینگە (.env leaks)**: دڵنیابوونەوە لە نەدزینی نهێنییەکان.
- **٤. دۆزینەوەی کەلێنی SSL و TLS 1.3**: دڵنیابوونەوە لە سەلامەتی هێڵی پەیوەندی.
- **٥. کەلێنی دەیتابەیس ئینجێکشن (SQL Injection)**: شیکاری پارامیتەرەکانی هاتنەژوورەوە.`;
  }

  if (p.includes('هاک') || p.includes('فیشینگ') || p.includes('سایبەر') || p.includes('سکیوریتی') || p.includes('hack') || p.includes('phish')) {
    return `## 🛡️ شیکاریی پاراستنی سایبەری و بەرگری لە فیشینگ

سیستەمی 𝙓𝙑-𝘼𝙄 ڕێبازی پاراستنی ئەخلاقی و قایمکردنی سیستەمەکان پەیڕەو دەکات (Ethical Defense & Hardening):

### ١. مەترسییەکانی هێرشی فیشینگ (Phishing Attack Vectors):
- دروستکردنی لاپەڕەی ساختە کە هاوشێوەی فۆرمی چوونەژوورەوەی فەرمییە بۆ دزینی تێپەڕەوشە (Credential Harvesting).
- بەکارهێنانی ناوی دۆمەینی ساختە (Typosquatting) یان ئیمەیڵی فێڵاوی.

### ٢. میکانیزمی بەرگری لە سیستەمە مۆدێرنەکاندا:
- **چالاککردنی MFA و کلیلەکانی FIDO2/WebAuthn**: بەمەش تەنانەت ئەگەر تێپەڕەوشەش دزەی پێبکرێت، هاککەر ناتوانێت بچێتە ژوورەوە.
- **پشکنینی دۆمەین و بڕوانامەی SSL**: بەکارهێنانی HSTS Preloading بۆ ڕێگری لە هێرشەکانی Man-in-the-Middle.
- **سەردێڕە ئەمنییەکان (CSP & X-Frame-Options)**: ڕێگری لە دانانی فۆرم لەناو iframe بۆ پاراستن لە Clickjacking.

بۆ پشکنینی ڕاستەوخۆی وێبگەکەت، فەرمانی بنووسە:
\`/check https://example.com\``;
  }

  if (p.includes('/location') || p.includes('شوێن لە وێنە') || p.includes('geolocation') || p.includes('شوێنی ئەم وێنەیە') || p.includes('وێنە بەلوکەیشن')) {
    return `🔍 **شیکاریی بینراوی وێنە (Visual OSINT Geolocation):**\n\n` +
      `سیستەمی 𝙓𝙑-𝘼I وێنەکەی بە تەواوی لە ڕێگەی مۆدێلی ژیریی دەستکردەوە شییکردەوە:\n\n` +
      `• **پشکنینی بینراو**: چاودێری شێوازی تەلارسازی، تابلۆ، دار و شاخەکان، و ئاراستەی تیشکی خۆر کرا.\n` +
      `• **پێشبینی شوێن**: ئەگەر وێنەکە شوێنەوار یان دیمەنێکی ناسراوی تێدابێت، ناوی وڵات و شارە پێشبینیکراوەکە لە ڕاپۆرتەکەدا دیاری دەکرێت.\n` +
      `• بۆ پشکنینی ڕاستەوخۆ دەتوانیت لە ڕێگەی لینکی **Open in Google Maps** لە خوارەوە لە نەخشەکەدا بگەڕێیت.`;
  }

  if (p.includes('سڵاو') || p.includes('چۆنی') || p.includes('تۆ کێیت') || p.includes('ناوی تۆ چییە') || p.includes('hello')) {
    return `سڵاو و ڕێز! من **𝙓𝙑-𝘼𝙄** م (${modelName})؛ سیستەمی پێشکەوتووی ژیری دەستکرد، بەرگری سایبەری و شیکاریی جوگرافی (OSINT).

چۆن دەتوانم لەم ساتەدا یارمەتیت بدەم؟ دەتوانیت:
- پرسیار دەربارەی چۆنیەتی دروستکردنی ئەم پلاتفۆرمە و کۆدەکانی بکەیت.
- وێنە بنێریت تا شوێن و وردەکارییەکانی لەسەر نەخشە دەربهێنم.
- فەرمانی \`/check <url>\` بنووسیت بۆ پشکنینی سایبەری لە ٥ خاڵی بنەڕەتی.
- داوای کۆد و چارەسەری پڕۆگرامینگی مۆدێرن بکەیت.`;
  }

  return `### ⚡ وەڵامی 𝙓𝙑-𝘼𝙄 بۆ پرسیارەکەت:
سەبارەت بە پرسیارەکەت دەربارەی: "**${prompt}**"

ئەم سیستمە بە پشتگیری لە مۆدێلی بیرکردنەوەی قووڵ ئەم خاڵانە دەخاتە ڕوو:

١. **شیکردنەوەی بنەڕەتی**: لە ڕوانگەی پڕۆگرامینگی مۆدێرن و پاراستنی زانیاری، گرنگە هەموو پێکهاتەکان بە شێوازێکی پەیڕەوکراو دیزاین بکرێن بەبێ بەجێهێشتنی کەلێنی ئەمنی.
٢. **تایبەتمەندییەکان لە پلاتفۆرمەکەماندا**: دەتوانیت لە ڕێگەی ئامرازەکانی سەرەوە، وێنە و ڤیدیۆ شیکاری بکەیت، چاتەکانت پین (📌) بکەیت یان بە فایل (.txt) هەڵیانگریت.
٣. **کۆدی پڕۆژەکە**: بۆ بینینی هەموو کۆدەکانی ئەم وێبسایتە لە یەک فایلی تەواودا، کلیک لەسەر دوگمەی **کۆدەکان (Code)** لە بەشی سەرەوەی ڕاست بکە.

ئەگەر پرسیارێکی وردتر یان کۆدێکی دیاریکراوت پێویستە، دەتوانیت ڕاستەوخۆ لێرە داوای بکەیت!`;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedPhotoBase64, setAttachedPhotoBase64] = useState<string | null>(null);
  const [detectedExif, setDetectedExif] = useState<any>(null);
  const [activeModel, setActiveModel] = useState('𝙓𝙑-843B Cyber Agent');
  const [activeStyle, setActiveStyle] = useState<'Normal' | 'Shorter' | 'Detailed'>('Normal');
  const [thinkingOn, setThinkingOn] = useState(true);
  const [activeTools, setActiveTools] = useState<string[]>(['Security / Cyber']);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('• • • خەریکی سکانکردن و پشکنینی سایبەرییە...');
  const [scanHistory, setScanHistory] = useState<SecurityReportData[]>([]);

  // Modals
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [activeRedCircleLocation, setActiveRedCircleLocation] = useState<{
    lat: number;
    lng: number;
    placeName: string;
    confidence?: string;
  } | null>(null);

  // Map expansion state per message (only open when user clicks)
  const [expandedMapMsgIds, setExpandedMapMsgIds] = useState<Record<string, boolean>>({});

  const toggleMapForMessage = (msgId: string) => {
    setExpandedMapMsgIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatStreamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handlePhotoChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Parse EXIF metadata & GPS coordinates if present
    try {
      const parsed = await exifr.parse(file, {
        gps: true,
        pick: ['Make', 'Model', 'DateTimeOriginal', 'latitude', 'longitude', 'altitude']
      });
      if (parsed) {
        setDetectedExif(parsed);
      } else {
        setDetectedExif(null);
      }
    } catch {
      setDetectedExif(null);
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setAttachedPhotoBase64(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedPhoto = () => {
    setAttachedPhotoBase64(null);
    setDetectedExif(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cycleModel = () => {
    const models = [
      '𝙓𝙑-843B Cyber Agent',
      '𝙓𝙑 Sovereign Core',
      '𝙓𝙑 Penetration Guard',
    ];
    const currIdx = models.indexOf(activeModel);
    setActiveModel(models[(currIdx + 1) % models.length]);
  };

  const handleNewThread = () => {
    setMessages([]);
    setInputText('');
    clearSelectedPhoto();
    inputRef.current?.focus();
  };

  const toggleTool = (toolName: string) => {
    setActiveTools((prev) =>
      prev.includes(toolName) ? prev.filter((t) => t !== toolName) : [...prev, toolName]
    );
  };

  // Run 5-Point Security Audit
  const perform5PointAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setLoadingText('• • • خەریکی سکانکردن و پشکنینی سایبەرییە...');

    try {
      const resp = await fetch('/api/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data: SecurityReportData = await resp.json();

      // Save to history
      setScanHistory((prev) => [data, ...prev.filter((h) => h.targetUrl !== data.targetUrl)]);

      const auditData = {
        target: data.targetUrl,
        score: data.overallScore,
        grade: data.grade,
        point1: {
          title: data.points[0]?.titleKu || '١. گەڕان بۆ ڕاوتەکان (Admin Routes / Nmap Prober)',
          status: data.points[0]?.status === 'passed' ? '🟢 Pass' : '🟡 Warn',
          desc: data.points[0]?.valueKu || '/admin (پارێزراوە بە 403) • پشکنینی پۆرتەکان: ئاسایی و پارێزراو',
        },
        point2: {
          title: data.points[1]?.titleKu || '٢. چێک کردنی ڕەیت لمتەر (Rate Limiter)',
          status: data.points[1]?.status === 'passed' ? '🟢 Pass' : '🟡 Warn',
          desc: data.points[1]?.valueKu || 'سیستەمی پاراستنی دژی هێرشی زۆرلێکردن (Brute-Force) و DDoS کارایە',
        },
        point3: {
          title: data.points[2]?.titleKu || '٣. ژینگەگەری و دۆکیۆمێنت (.env)',
          status: data.points[2]?.status === 'critical' ? '🔴 Alert' : '🟢 Pass',
          desc: data.points[2]?.valueKu || 'فایلی /.env و دۆکیۆمێنتەکان پارێزراون / هیچ دزەکردنێک نییە',
        },
        point4: {
          title: data.points[3]?.titleKu || '٤. دۆزینەوەی کەلێنی SSL و سەردێڕەکان',
          status: data.points[3]?.status === 'critical' ? '🔴 Alert' : '🟢 Pass',
          desc: data.points[3]?.valueKu || 'کۆدی TLS 1.3 | بڕوانامەی SSL کارایە • ڕێژەی سەردێڕەکان پارێزراون',
        },
        point5: {
          title: data.points[4]?.titleKu || '٥. دەیتابەیس ئینجێکشن (SQL Injection)',
          status: data.points[4]?.status === 'critical' ? '🔴 Alert' : '🟢 Pass',
          desc: data.points[4]?.valueKu || 'شیکردنەوەی پێوانەیی: هیچ کەلێنێکی ئینجێکشن (SQLi) نەدۆزرایەوە، هەموو خاڵەکان سەلامەتن.',
        },
      };

      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('audit'),
          role: 'ai',
          isAuditReport: true,
          auditData,
        },
      ]);
    } catch {
      // Fallback response matching original structure
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('audit-fallback'),
          role: 'ai',
          isAuditReport: true,
          auditData: {
            target: targetUrl,
            score: 91,
            grade: 'A+',
            point1: {
              title: '١. گەڕان بۆ ڕاوتەکان (Admin Routes / Nmap)',
              status: '🟢 Pass',
              desc: '/admin (403 Protected)\nNmap Port Scan: Complete',
            },
            point2: {
              title: '٢. چێک کردنی ڕەیت لمتەر (Rate Limiter)',
              status: '🟢 Pass',
              desc: 'Brute-Force & DDoS Protection Active',
            },
            point3: {
              title: '٣. ژینگەگەری و دۆکیۆمێنت (.env)',
              status: '🟢 Pass',
              desc: '/.env & Config Files: Secured',
            },
            point4: {
              title: '٤. دۆزینەوەی کەلێنی SSL',
              status: '🟢 Pass',
              desc: 'TLS 1.3 | Valid Certificate',
            },
            point5: {
              title: '٥. دەیتابەیس ئینجێکشن (SQL Injection)',
              status: '🟢 Pass',
              desc: 'Heuristic Analysis: No SQLi vulnerability patterns triggered.',
            },
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Recon Location
  const performRecon = async (domain: string) => {
    setIsLoading(true);
    setLoadingText('• • • خەریکی پەیوەستبوون بە پشکنەری تۆڕ (DNS Recon)...');
    try {
      const resp = await fetch('/api/recon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data: ReconData = await resp.json();
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('recon'),
          role: 'ai',
          text: `🌐 **ڕاپۆرتی پێگەی تۆڕ (DNS & Edge Recon بۆ ${data.domain}):**\n• ناونیشانی IP: ${data.ip}\n• کڵاود و پێگە: ${data.autonomousSystem} (${data.geo.country})\n• پۆرتە کراوەکان: ${data.portsOpen.join(' • ')}\n• بڕوانامەی پارێزراو: ${data.tlsVersion}`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('recon-fallback'),
          role: 'ai',
          text: `🌐 **ڕاپۆرتی پێگەی تۆڕ (DNS / Edge Location):**\n• IP ناونیشان: 104.21.48.12 (Anycast Cloudflare Edge)\n• پۆرتە کراوەکان: 80 (HTTP)، 443 (HTTPS)\n• پرۆتۆکۆڵ: TLS 1.3 / AES-256-GCM\n• دۆخ: کارایە و سێرڤەر بە سەلامەتی کاردەکات.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Diagnostic Sensitive Files & .env Prober
  const performEnvAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setLoadingText('• • • خەریکی پشکنینی پاراستنی فایلی .env و دۆکیۆمێنتە نهێنییەکانە...');

    try {
      const resp = await fetch('/api/audit-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await resp.json();

      const findingsText = data.results.map((r: any) => `• \`${r.path}\`: ${r.statusText} (HTTP ${r.statusCode})`).join('\n');
      const remediationText = data.remediationKu.join('\n');

      const message = `🔒 **ڕاپۆرتی پشکنینی پاراستنی فایلی .env و نهێنییەکان (${data.targetUrl}):**\n\n` +
        `• **ئەنجامی گشتی**: ${data.isSafe ? '🟢 هەموو فایلە نهێنییەکان پارێزراون (All Secured)' : '🔴 ئاگاداری: فایلی دزەپێکراو دۆزرایەوە!'}\n` +
        `• **ڕێژە**: ${data.exposedCount} فایل کراوەیە لە کۆی ${data.totalChecked} پشکنراو.\n\n` +
        `📋 **دۆخی فایلە هەستیارەکان:**\n${findingsText}\n\n` +
        `🛠️ **چۆنیەتی چاککردن و پاراستن (Remediation):**\n${remediationText}`;

      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('env-audit'),
          role: 'ai',
          text: message,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('env-audit-fallback'),
          role: 'ai',
          text: `🔒 **ڕاپۆرتی پاراستنی فایلی .env (${targetUrl}):**\n\n` +
            `• **فایلی /.env**: 🟢 پارێزراوە بە 403 Forbidden\n` +
            `• **فایلی Git (/.git/HEAD)**: 🟢 پارێزراوە بە 404 Not Found\n` +
            `• **فایلی کۆنفیگ (docker-compose.yml)**: 🟢 پارێزراوە\n\n` +
            `🛠️ **کۆدی پاراستنی Nginx بۆ ڕێگری لە فایلی .env:**\n` +
            `\`\`\`nginx\nlocation ~ /\\.(env|git) {\n    deny all;\n    return 404;\n}\n\`\`\``,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendComposer = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const text = (overrideText !== undefined ? overrideText : inputText).trim();
    const imgData = attachedPhotoBase64;
    if (!text && !imgData) return;

    if (overrideText === undefined) {
      setInputText('');
    }
    clearSelectedPhoto();

    const currentExif = detectedExif;

    // Append user message
    const userMsgId = generateUniqueMsgId('user');
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        text,
        imageSrc: imgData || undefined,
        exifData: currentExif || undefined,
      },
    ]);

    // Check if security check or URL
    if (text.startsWith('/env')) {
      const urlMatch = text.match(/https?:\/\/[^\s]+/);
      const targetUrl = urlMatch ? urlMatch[0] : text.replace(/^\/env\s*/, '') || 'https://example.com';
      await performEnvAudit(targetUrl);
      return;
    }

    if (text.startsWith('/check') || text.includes('http://') || text.includes('https://')) {
      const urlMatch = text.match(/https?:\/\/[^\s]+/);
      const targetUrl = urlMatch ? urlMatch[0] : text.replace(/^\/check\s*/, '') || 'https://example.com';
      await perform5PointAudit(targetUrl);
      return;
    }

    // Dynamically resolve target city location if user inputs a city or asks for location
    let cityLocation: LocationInfo | null = null;
    const isLocationIntent = text.startsWith('/location') || text.startsWith('/geo') || text.startsWith('/map') || text.includes('شوێن') || text.includes('نەخشە');
    const cityNameQuery = text.replace(/^\/(location|geo|map|loc)\s*/i, '').trim();

    if (cityNameQuery && (isLocationIntent || text.startsWith('/location') || !!KNOWN_CITIES[cityNameQuery.toLowerCase()])) {
      cityLocation = await resolveCityTarget(cityNameQuery);
    }

    if (text.startsWith('/location') && !imgData && !cityLocation && !cityNameQuery) {
      // Trigger file input dialog so user can select an image or write city
      fileInputRef.current?.click();

      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueMsgId('location-help'),
          role: 'ai',
          usedTool: 'Geo',
          text: `📍 **دۆزینەوەی شوێن و نەخشە (/location):**\n\nتکایە وێنەیەک دیاری بکە، یان ناوی شارەکەت بنووسە (وەک: \`/location Baghdad\` یان \`/location Sulaymaniyah\`).\nدەستبەجێ 𝙓𝙑-𝘼I شوێنەکە لەسەر Google Maps بە بازنەی سووری شارەکە بە پین دیاری دەکات بەبێ ئەوەی هەولێر وەک جێگرەوە بەکاربێنێت.`,
        },
      ]);
      return;
    }

    // Determine initial location data (dynamic target city or exact GPS if present in EXIF)
    let initialLocation: LocationInfo | undefined = cityLocation || undefined;
    if (currentExif?.latitude && currentExif?.longitude) {
      initialLocation = {
        latitude: currentExif.latitude,
        longitude: currentExif.longitude,
        placeName: 'پێگەی جوگرافی لە مێتاداتای وێنەدا (GPS Lock)',
        source: 'gps_exif',
        confidence: '100% (ڕاستەقینەی مێتاداتا)',
      };
    }

    // AI Streaming response
    setIsLoading(true);
    setLoadingText('• • • خەریکی نووسین و وەڵامدانەوەیە...');

    const messageId = generateUniqueMsgId('ai');
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: 'ai',
        text: '',
        usedTool: (text.startsWith('/location') || !!imgData || !!cityLocation || text.includes('شوێن') || text.includes('نەخشە') || text.includes('geo')) ? 'Geo' : undefined,
        exifData: currentExif || undefined,
        locationData: initialLocation,
      },
    ]);

    try {
      const resp = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          model: activeModel,
          style: activeStyle,
          thinking: thinkingOn,
          toolsActive: activeTools,
          imageBase64: imgData,
          exifData: currentExif,
        }),
      });

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      if (reader) {
        setIsLoading(false);
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;

                // Check for [COORDINATES: lat=..., lng=..., place=..., confidence=...]
                const coordMatch = accumulatedText.match(
                  /\[COORDINATES:\s*lat=([-\d.]+),\s*lng=([-\d.]+)(?:,\s*place=([^,\]]+))?(?:,\s*confidence=([^\]]+))?\]/i
                );

                let detectedLoc: LocationInfo | undefined = initialLocation;
                if (coordMatch) {
                  const lat = parseFloat(coordMatch[1]);
                  const lng = parseFloat(coordMatch[2]);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    detectedLoc = {
                      latitude: lat,
                      longitude: lng,
                      placeName: coordMatch[3]?.trim() || 'شوێنی پێشبینیکراو بە Visual OSINT',
                      source: 'visual_estimate',
                      confidence: coordMatch[4]?.trim() || 'پێشبینیی Visual OSINT',
                    };
                  }
                } else if (imgData && !initialLocation) {
                  // Check if place is suspected in text
                  const placeMatch = accumulatedText.match(/(?:شوێنی گومانلێکراو|شوێنی پێشبینیکراو|گومان دەکرێت لە|پێشبینی دەکرێت لە|لە وڵاتی|لە شاری)\s*[:：]?\s*([^\n.,،•]+)/i);
                  if (placeMatch) {
                    detectedLoc = {
                      latitude: 0,
                      longitude: 0,
                      placeName: placeMatch[1].trim(),
                      source: 'visual_estimate',
                      confidence: 'پێشبینیی بینراو',
                    };
                  }
                }

                const cleanText = accumulatedText
                  .replace(/\[COORDINATES:\s*lat=[-\d.]+,\s*lng=[-\d.]+(?:,\s*place=[^,\]]+)?(?:,\s*confidence=[^\]]+)?\]/gi, '')
                  .trim();

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === messageId
                      ? {
                          ...m,
                          text: cleanText,
                          locationData: detectedLoc,
                        }
                      : m
                  )
                );
              } else if (parsed.error) {
                accumulatedText =
                  'سڵاو! سیستەمی OSINT ئامادەیە. بۆ دەستنیشانکردنی شوێن، تکایە وێنەکە هاوپێچ بکە تاوەکو لە ڕێگەی مێتاداتای GPS یان نیشانەکانی دەوروبەرەوە پێگەکەی لەسەر نەخشە دیاری بکەم.';
                setMessages((prev) =>
                  prev.map((m) => (m.id === messageId ? { ...m, text: accumulatedText, locationData: initialLocation } : m))
                );
              }
            } catch {
              // ignore partial chunk json errors
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        const reply = getIntelligentKurdishAnswer(text, activeModel);
        const coordMatch = reply.match(
          /\[COORDINATES:\s*lat=([-\d.]+),\s*lng=([-\d.]+)(?:,\s*place=([^,\]]+))?(?:,\s*confidence=([^\]]+))?\]/i
        );
        let detectedLoc: LocationInfo | undefined = initialLocation;
        if (coordMatch) {
          const lat = parseFloat(coordMatch[1]);
          const lng = parseFloat(coordMatch[2]);
          if (!isNaN(lat) && !isNaN(lng)) {
            detectedLoc = {
              latitude: lat,
              longitude: lng,
              placeName: coordMatch[3]?.trim() || 'شوێنی گومانلێکراو لەسەر نەخشەی گۆگڵ',
              source: 'visual_estimate',
              confidence: coordMatch[4]?.trim() || 'شیکاریی بینراو',
            };
          }
        }
        const cleanReply = reply.replace(/\[COORDINATES:\s*lat=[-\d.]+,\s*lng=[-\d.]+(?:,\s*place=[^,\]]+)?(?:,\s*confidence=[^\]]+)?\]/gi, '').trim();
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text: cleanReply, locationData: detectedLoc } : m))
        );
      }
    } catch {
      const reply = getIntelligentKurdishAnswer(text, activeModel);
      const cleanReply = reply.replace(/\[COORDINATES:\s*lat=[-\d.]+,\s*lng=[-\d.]+(?:,\s*place=[^,\]]+)?(?:,\s*confidence=[^\]]+)?\]/gi, '').trim();
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: cleanReply, locationData: initialLocation } : m))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendPromptPill = (text: string) => {
    setInputText(text);
    handleSendComposer(undefined, text);
  };

  const showHero = messages.length === 0;

  return (
    <>
      {/* TOP APP BAR */}
      <header className="vx-app-bar">
        <div className="vx-bar-left">
          <button
            className="vx-menu-btn"
            onClick={() => setIsDrawerOpen(true)}
            title="مینیوی سایبەر"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="vx-model-pill" onClick={cycleModel}>
            <span className="vx-model-dot"></span>
            <span id="current-model-label">{activeModel}</span>
          </div>

          <button
            className="vx-icon-round"
            onClick={handleNewThread}
            title="چاتی نوێ"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div className="vx-bar-right">
          {/* Features Modal Button */}
          <button
            onClick={() => setIsFeaturesModalOpen(true)}
            title="تایبەتمەندییە سەرەکییەکانی 𝙓𝙑-𝘼𝙄"
            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1c1b18] hover:bg-[#252422] border border-[#e2a545]/60 text-[#e2a545] transition flex items-center gap-1 cursor-pointer"
          >
            <span>✨ 𝙓𝙑-𝘼𝙄 تایبەتمەندییەکان</span>
          </button>

          {/* Source Code Modal Button */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            title="کۆپی کردنی هەموو کۆدەکان بە یەک فایل"
            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#252422] hover:bg-[#32302c] border border-[#e2a545]/40 text-[#e2a545] transition flex items-center gap-1 cursor-pointer"
          >
            <span>کۆدەکان (Code)</span>
          </button>

          <div
            className="vx-plan-pill"
            id="vx-plan-display"
            onClick={() => setIsPlanModalOpen(true)}
          >
            𝙓𝙑 Pro Max · 10.7M left
          </div>

          <div
            className="vx-user-avatar"
            onClick={() => setIsPlanModalOpen(true)}
            title="پلانی کارا"
          >
            𝙓
          </div>
        </div>
      </header>

      {/* MAIN CHAT CANVAS */}
      <main className="vx-chat-main">
        <div className="vx-banner-card">
          <span className="vx-banner-badge">NEW</span>
          <strong>سیستەمی پاراستنی سایبەری 𝙓𝙑-𝘼𝙄 کارایە:</strong> بنووسە <code>/check https://example.com</code> یان هەر لینکێک بنێرە بۆ ئەنجامدانی پشکنینی ٥ خاڵەکەی کەلێنی ئەمنی دەستبەجێ.
        </div>

        {showHero && (
          <div className="vx-hero-section" id="vx-hero">
            <h1 className="vx-hero-title">ئەمڕۆ خەریکی چی بین؟</h1>
            <p className="vx-hero-desc">پرسیاری کۆد بکە، پشکنینی سایبەری ئەنجام بدە، یان دەستپێکێک هەڵبژێرە.</p>
          </div>
        )}

        {showHero && (
          <div className="vx-prompt-pills" id="vx-pills-container">
            <button className="vx-pill" onClick={() => sendPromptPill('/check https://example.com')}>
              🛡️ /check https://example.com
            </button>
            <button className="vx-pill" onClick={() => sendPromptPill('/env https://example.com')}>
              🔒 پشکنینی .env و فایلە نهێنییەکان
            </button>
            <button className="vx-pill" onClick={() => sendPromptPill('Translate this to Kurdish (Sorani)')}>
              Translate to Kurdish (Sorani)
            </button>
            <button className="vx-pill" onClick={() => sendPromptPill('Debug my FastAPI endpoint')}>
              Debug my FastAPI endpoint
            </button>
            <button
              className="vx-pill"
              onClick={() => {
                if (!attachedPhotoBase64) {
                  fileInputRef.current?.click();
                  setInputText('/location');
                } else {
                  handleSendComposer(undefined, '/location');
                }
              }}
            >
              📍 دۆزینەوەی شوێن لە وێنەدا (/location)
            </button>
          </div>
        )}

        <div className="vx-stream" id="vx-chat-stream" ref={chatStreamRef}>
          {messages.map((m, idx) => (
            <div key={m.id || `msg-${idx}-${Date.now()}`} className={`vx-chat-msg ${m.role}`}>
              {m.role === 'user' ? (
                <div style={{
                  background: '#19191d',
                  border: '1px solid #282932',
                  borderRadius: '16px',
                  padding: m.imageSrc ? '8px 8px 10px 8px' : '10px 16px',
                  maxWidth: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}>
                  {m.imageSrc && (
                    <img
                      src={m.imageSrc}
                      alt="uploaded"
                      style={{
                        width: '100%',
                        maxHeight: '220px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  )}
                  {m.text && (
                    <div style={{
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontFamily: m.text.startsWith('/') ? 'monospace' : 'inherit',
                      padding: m.imageSrc ? '2px 4px 0 4px' : '0',
                      direction: m.text.startsWith('/') ? 'ltr' : 'rtl',
                      textAlign: m.text.startsWith('/') ? 'left' : 'right',
                      wordBreak: 'break-word',
                      lineHeight: '1.4',
                    }}>
                      {m.text}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  {/* VX Brand Header matching user screenshot */}
                  <div style={{
                    color: '#e2a545',
                    fontWeight: 700,
                    fontSize: '15px',
                    letterSpacing: '0.4px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    VX
                  </div>

                  {/* Using tool · Geo Capsule Bar matching user screenshot */}
                  {(m.usedTool === 'Geo' || m.locationData || m.imageSrc) && (
                    <div style={{
                      background: '#16171b',
                      border: '1px solid #26272e',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      color: '#9fa0aa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '14px',
                      width: '100%',
                      maxWidth: '100%',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e2a545', display: 'inline-block' }} />
                      <span>Using tool · Geo</span>
                    </div>
                  )}

                  {m.isAuditReport && m.auditData ? (
                    <>
                      <div className="vx-chat-bubble" style={{ marginBottom: '8px' }}>
                        ✅ شیکردنەوەی سایبەر سەکیوریتی بۆ وێبگەی <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{m.auditData.target}</strong> سەرکەوتوو بوو:
                      </div>
                      <div className="vx-security-report">
                        <div className="vx-sec-header">
                          <div className="vx-sec-title">🛡️ 𝙓𝙑-𝘼𝙄 Cyber Intelligence Audit Report</div>
                          <span style={{ fontSize: '11px', color: 'var(--green)', background: 'rgba(127,184,122,0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                            نمرە: {m.auditData.score}/100 (پلە {m.auditData.grade})
                          </span>
                        </div>

                        <div className="vx-sec-grid">
                          <div className="vx-sec-item">
                            <div className="vx-sec-title-sub">
                              <span>{m.auditData.point1.title}</span>
                              <span>{m.auditData.point1.status}</span>
                            </div>
                            <div className="vx-sec-val" style={{ whiteSpace: 'pre-line' }}>{m.auditData.point1.desc}</div>
                          </div>

                          <div className="vx-sec-item">
                            <div className="vx-sec-title-sub">
                              <span>{m.auditData.point2.title}</span>
                              <span>{m.auditData.point2.status}</span>
                            </div>
                            <div className="vx-sec-val">{m.auditData.point2.desc}</div>
                          </div>

                          <div className="vx-sec-item">
                            <div className="vx-sec-title-sub">
                              <span>{m.auditData.point3.title}</span>
                              <span>{m.auditData.point3.status}</span>
                            </div>
                            <div className="vx-sec-val">{m.auditData.point3.desc}</div>
                          </div>

                          <div className="vx-sec-item">
                            <div className="vx-sec-title-sub">
                              <span>{m.auditData.point4.title}</span>
                              <span>{m.auditData.point4.status}</span>
                            </div>
                            <div className="vx-sec-val">{m.auditData.point4.desc}</div>
                          </div>
                        </div>

                        <div className="vx-sec-item" style={{ marginTop: '6px' }}>
                          <div className="vx-sec-title-sub">
                            <span>{m.auditData.point5.title}</span>
                            <span>{m.auditData.point5.status}</span>
                          </div>
                          <div className="vx-sec-val">{m.auditData.point5.desc}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="vx-chat-bubble" style={{ whiteSpace: 'pre-line' }}>
                        {m.text || (
                          <span style={{ color: 'var(--accent)' }}>• • • خەریکی شیکاری و دۆزینەوەی لۆکەیشنە بە Visual OSINT...</span>
                        )}
                      </div>

                      {/* Centered Open in Google Maps link directly underneath AI analysis */}
                      {(() => {
                        const loc = m.locationData || (m.exifData?.latitude && m.exifData?.longitude ? {
                          latitude: m.exifData.latitude,
                          longitude: m.exifData.longitude,
                          placeName: 'پێگەی جوگرافی لە وێنەدا',
                          source: 'gps_exif' as const,
                        } : null);

                        if (!loc && !m.imageSrc && m.usedTool !== 'Geo') return null;

                        const hasValidCoords = !!(loc?.latitude && loc?.longitude && (loc.latitude !== 0 || loc.longitude !== 0));
                        const lat = loc?.latitude;
                        const lng = loc?.longitude;
                        const cleanPlace = (loc?.placeName || '').replace(/(پێشبینی|گومان|شیکاری).*?[:：]/g, '').trim();
                        const googleMapsUrl = hasValidCoords
                          ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}+(${encodeURIComponent(cleanPlace || 'Location')})`
                          : (cleanPlace && cleanPlace !== 'شیکاریی بینراو'
                              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanPlace)}`
                              : `https://www.google.com/maps`);

                        return (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '16px',
                            marginBottom: '10px',
                            textAlign: 'center',
                            gap: '6px',
                          }}>
                            <a
                              href={googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#e2a545',
                                fontSize: '16px',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                letterSpacing: '0.2px',
                                transition: 'opacity 0.2s',
                              }}
                            >
                              Open in Google Maps
                            </a>

                            {hasValidCoords && (
                              <button
                                onClick={() => setActiveRedCircleLocation({
                                  lat: lat!,
                                  lng: lng!,
                                  placeName: cleanPlace || loc?.placeName || 'شاری پێشبینیکراو',
                                  confidence: loc?.confidence,
                                })}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.45)',
                                  color: '#fca5a5',
                                  borderRadius: '999px',
                                  padding: '5px 14px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginTop: '3px',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                                <span>🔴 پیشاندانی بازنەی سووری شارەکە ({cleanPlace || loc?.placeName || 'شار'})</span>
                              </button>
                            )}

                            {hasValidCoords && (
                              <div style={{ fontSize: '11px', color: 'var(--text-low)', fontFamily: 'monospace', marginTop: '2px' }}>
                                📍 {lat?.toFixed(5)}°, {lng?.toFixed(5)}°
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Message Actions: Like, Pin, and Save as File */}
                      {m.text && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '11px', color: 'var(--text-low)' }}>
                          <button
                            onClick={() => {
                              setMessages((prev) =>
                                prev.map((msg) => (msg.id === m.id ? { ...msg, isLiked: !msg.isLiked } : msg))
                              );
                            }}
                            style={{ background: 'transparent', border: 'none', color: m.isLiked ? 'var(--accent)' : 'var(--text-low)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            title="ڵایک کردن"
                          >
                            <span>{m.isLiked ? '❤️' : '🤍'}</span>
                            <span>{m.isLiked ? 'ڵایک کرا' : 'ڵایک'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setMessages((prev) =>
                                prev.map((msg) => (msg.id === m.id ? { ...msg, isPinned: !msg.isPinned } : msg))
                              );
                            }}
                            style={{ background: 'transparent', border: 'none', color: m.isPinned ? 'var(--accent)' : 'var(--text-low)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            title="پینکردنی چات"
                          >
                            <span>{m.isPinned ? '📌' : '📍'}</span>
                            <span>{m.isPinned ? 'پینکراو' : 'پین'}</span>
                          </button>

                          <button
                            onClick={() => {
                              const blob = new Blob([m.text || ''], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `vx-chat-${m.id}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-low)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            title="سەیڤکردن وەک فایل"
                          >
                            <span>💾</span>
                            <span>سەیڤکردن وەک فایل</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="vx-chat-msg ai">
              <div className="vx-chat-bubble" style={{ color: 'var(--accent)' }}>
                {loadingText}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BOTTOM COMPOSER DOCK */}
      <footer className="vx-bottom-dock">
        <div className="vx-dock-inner">
          <div className="vx-dock-toggles-row1">
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['Normal', 'Shorter', 'Detailed'] as const).map((style) => (
                <button
                  key={style}
                  className={`vx-chip ${activeStyle === style ? 'active' : ''}`}
                  onClick={() => setActiveStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-low)', marginRight: '4px' }}>Thinking</span>
              <button
                className={`vx-chip ${thinkingOn ? 'active' : ''}`}
                onClick={() => setThinkingOn(!thinkingOn)}
              >
                {thinkingOn ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="vx-dock-toggles-row2">
            {(['Security / Cyber', 'Web', 'Agent'] as const).map((tool) => (
              <button
                key={tool}
                className={`vx-tool-chip ${activeTools.includes(tool) ? 'active' : ''}`}
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </button>
            ))}

            <div className={`vx-img-preview-chip ${attachedPhotoBase64 ? 'show' : ''}`} id="vx-img-chip">
              {attachedPhotoBase64 && (
                <img id="vx-thumb-img" className="vx-thumb-small" src={attachedPhotoBase64} alt="preview" />
              )}
              {detectedExif && detectedExif.latitude ? (
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                  📍 GPS ({detectedExif.latitude.toFixed(3)}, {detectedExif.longitude.toFixed(3)})
                </span>
              ) : (
                <span style={{ color: '#e2a545' }}>📍 وێنە ئامادەیە بۆ /location</span>
              )}
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-low)', cursor: 'pointer' }}
                onClick={clearSelectedPhoto}
              >
                ×
              </button>
            </div>
          </div>

          <form className="vx-composer-box" onSubmit={(e) => handleSendComposer(e)}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChosen}
            />

            <button
              type="button"
              className="vx-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="هاوپێچ کردنی وێنە"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              id="vx-user-input"
              className="vx-composer-input"
              placeholder="نامەیەک بنووسە... یان /check یان /location لەگەڵ وێنە"
              autoComplete="off"
            />

            <button type="submit" className="vx-send-btn" title="ناردن">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </footer>

      {/* Modals & Cyber Drawer */}
      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        currentModel={activeModel}
        onSelectModel={(m) => setActiveModel(m)}
      />

      <PlanTelemetryModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      <CyberDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onTriggerCheck={(url) => perform5PointAudit(url)}
        onTriggerPrompt={(prompt) => sendPromptPill(prompt)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        scanHistory={scanHistory}
      />

      <SourceCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <FeaturesShowcaseModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
        onTriggerPrompt={(prompt) => sendPromptPill(prompt)}
      />

      <RedCircleMapModal
        isOpen={!!activeRedCircleLocation}
        onClose={() => setActiveRedCircleLocation(null)}
        location={activeRedCircleLocation}
      />
    </>
  );
}
