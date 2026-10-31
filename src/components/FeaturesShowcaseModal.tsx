import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, Eye, Video, Globe, Bookmark, Download, MapPin, Terminal, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrompt: (prompt: string) => void;
}

export const FeaturesShowcaseModal: React.FC<Props> = ({ isOpen, onClose, onTriggerPrompt }) => {
  if (!isOpen) return null;

  const features = [
    {
      num: '١',
      icon: <Eye className="w-4 h-4 text-[#e2a545]" />,
      title: 'ناردنی وێنە بۆ 𝙓𝙑-𝘼𝙄',
      desc: 'سیستەمی ژیریی بینین توانای هەیە وێنەکان، نەخشەی تۆڕ و دایەگرامەکان بە قووڵی شیبکاتەوە.',
      action: 'showImagePrompt'
    },
    {
      num: '٢',
      icon: <Video className="w-4 h-4 text-purple-400" />,
      title: 'شیکردنەوەی ڤیدیۆ و کۆنتێنت',
      desc: 'پشکنینی ناوەڕۆکی ڤیدیۆ، لینکی ڤیدیۆ، و دەرهێنانی تێگەیشتن و کورتە لە چەند چرکەیەکدا.',
      action: 'analyzeVideo'
    },
    {
      num: '٣',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      title: 'فێتچکردنی وێبسایت و گەڕان لە ناویاندا',
      desc: 'ناردنی هەر وێبسایتێک بۆ فێتچکردن، گەڕان بەناو کۆدەکانیدا و تێگەیشتن لە ستراکچەرەکەی بە کەمتر لە ١ خولەک.',
      action: 'fetchWebsite'
    },
    {
      num: '٤',
      icon: <Bookmark className="w-4 h-4 text-emerald-400" />,
      title: 'پینکردنی چاتەکان و دڵخوازکردن',
      desc: 'ئەتوانیت گفتوگۆ گرنگەکانت پین بکەیت یان لایکی بکەیت بۆ گەڕانەوەی ئاسان لە هەر کاتێکدا.',
      action: 'pinChat'
    },
    {
      num: '٥',
      icon: <Download className="w-4 h-4 text-amber-400" />,
      title: 'سەیڤکردنی چات وەک فایل',
      desc: 'داگرتن و هەڵگرتنی تەواوی گفتوگۆکە و ڕاپۆرتەکان وەک فایلی دەقی یان JSON بۆ ئەرشیف.',
      action: 'exportChat'
    },
    {
      num: '٦',
      icon: <MapPin className="w-4 h-4 text-rose-400" />,
      title: 'دۆزینەوەی لۆکەیشن و پێگە (OSINT)',
      desc: 'دەرهێنانی داتای جوگرافی لە وێنەدا لە ڕێگەی GPS EXIF و شیکاری ژینگەیی لەسەر نەخشەی ماپ.',
      action: 'osintLocation'
    },
  ];

  const cyberPoints = [
    { id: '١', title: 'گەڕان بۆ ڕاوتەکان (Admin Routes & Nmap)', desc: 'پشکنینی ڕاوتە هەستیارەکان و دەروازە دانەخراوەکان.' },
    { id: '٢', title: 'چێک کردنی ڕەیت لمتەر (Rate Limiter & WAF)', desc: 'پاراستن دژی هێرشی زۆرلێکردن (Brute-Force) و DDoS.' },
    { id: '٣', title: 'گەڕان بەدوای ئینڤایەرمێنت (.env & Configs)', desc: 'دڵنیابوونەوە لە نەبوونی دزەکردنی فایلە نهێنییەکان.' },
    { id: '٤', title: 'دۆزینەوەی کەلێنی SSL و سەردێڕەکان', desc: 'پشکنینی TLS 1.3 و سەردێڕە ئەمنییەکانی HSTS و CSP.' },
    { id: '٥', title: 'دەیتابەیس ئینجێکشن (SQL Injection Heuristics)', desc: 'پشکنینی پارامیتەرەکان بۆ ڕێگری لە دزەکردنی داتا.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-[#f2ede4]">
      <div className="bg-[#111216] border border-[#e2a545]/40 w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2b2a26] flex items-center justify-between bg-[#17171c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2a545]/20 border border-[#e2a545]/30 flex items-center justify-center text-[#e2a545]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#f2ede4] flex items-center gap-2">
                <span>تایبەتمەندییە سەرەکییەکانی 𝙓𝙑-𝘼𝙄 Showcase</span>
              </h3>
              <p className="text-[11px] text-[#9e978c]">توانای بیرکردنەوەی پێشکەوتوو و سووتی پاراستنی سایبەری</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e978c] hover:text-[#f2ede4] hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Main Statement Card */}
          <div className="bg-[#181920] border border-[#e2a545]/30 rounded-xl p-3.5 text-xs sm:text-[13px] leading-relaxed">
            <div className="text-[#e2a545] font-bold mb-1 flex items-center gap-1.5">
              <span>⚡</span>
              <span>گەورەیی مۆدێلەکە و توانای ژیریی دەستکرد</span>
            </div>
            <p className="text-[#9e978c] leading-relaxed">
              گەورەیی مۆدێلەکە لە توانای بیرکردنەوە و شییکردنەوەی خێرادایە، کە توانای دیزاین و کۆدینگی لە ئاستی هەرە گەورەترین سیستمەکانی زیرەکی دەستکردی جیهاندایە، هاوکات سیستەمێکی تایبەتی بۆ پشکنینی کەلێنە ئەمنییەکان و شیکردنەوەی خێرای بەرگری ئەلیکترۆنی بۆ ئامادە کراوە.
            </p>
          </div>

          {/* 6 Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-[#e2a545] mb-2 uppercase tracking-wider">
              ٦ توانای تایبەتی 𝙓𝙑-𝘼𝙄 (Core Features)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((f, i) => (
                <div key={i} className="bg-[#161619] border border-[#2b2a26] hover:border-[#382c19] p-3 rounded-xl flex items-start gap-2.5 transition">
                  <div className="p-1.5 rounded-lg bg-[#22211e] shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#f2ede4] mb-0.5">{f.num}. {f.title}</div>
                    <p className="text-[11px] text-[#9e978c] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Point Cyber Security Section */}
          <div className="bg-[#14151a] border border-[#2b2a26] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#2b2a26]">
              <span className="font-bold text-xs text-[#e2a545] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>پشکنینی سایبەر سەکیوریتی بە ٥ خاڵەکە (بە کەمتر لە ١ خولەک)</span>
              </span>
              <span className="text-[10px] font-mono bg-[#e2a545]/15 text-[#e2a545] px-2 py-0.5 rounded">/check</span>
            </div>
            <div className="space-y-1.5">
              {cyberPoints.map((pt) => (
                <div key={pt.id} className="text-xs flex items-start gap-2 text-[#9e978c]">
                  <span className="text-emerald-400 font-bold shrink-0">{pt.id}</span>
                  <div>
                    <strong className="text-[#f2ede4]">{pt.title}:</strong> {pt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2b2a26] bg-[#141418] flex items-center justify-between text-xs">
          <span className="text-[#9e978c]">بۆ ئەنجامدانی پشکنین بنووسە: <code className="text-[#e2a545] font-mono">/check https://domain.com</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#e2a545] text-[#111110] font-bold hover:bg-[#f0c37c] transition"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
