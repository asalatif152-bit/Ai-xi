import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Globe, Clock, Download, Copy, Check, Sparkles } from 'lucide-react';
import { SecurityReportData } from '../types';

interface Props {
  data: SecurityReportData;
  onAskHardening?: (url: string) => void;
  onRescan?: (url: string) => void;
}

export const SecurityReportCard: React.FC<Props> = ({ data, onAskHardening, onRescan }) => {
  const [lang, setLang] = useState<'ku' | 'en'>('ku');
  const [copied, setCopied] = useState(false);

  const getStatusIcon = (status: 'passed' | 'warning' | 'critical') => {
    switch (status) {
      case 'passed':
        return <span className="inline-flex items-center text-emerald-400 font-bold text-xs">🟢 Pass</span>;
      case 'warning':
        return <span className="inline-flex items-center text-amber-400 font-bold text-xs">🟡 Warn</span>;
      case 'critical':
        return <span className="inline-flex items-center text-rose-400 font-bold text-xs">🔴 Alert</span>;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'B':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'C':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  const handleCopy = () => {
    const text = `VX Cyber Security Audit Report: ${data.targetUrl}
Score: ${data.overallScore}/100 (Grade ${data.grade}) | Risk: ${data.riskLevel}
1. Admin Routes: ${data.points[0]?.valueEn}
2. Rate Limiting: ${data.points[1]?.valueEn}
3. Env Leaks: ${data.points[2]?.valueEn}
4. SSL/Headers: ${data.points[3]?.valueEn}
5. Database/SQLi: ${data.points[4]?.valueEn}
Scanned: ${new Date(data.scannedAt).toLocaleString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vx-audit-${data.host}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {/* Intro bubble */}
      <div className="bg-[#151513] border border-[#2b2a26] text-[#f2ede4] text-[13.5px] p-3.5 rounded-2xl rounded-bl-sm mb-3 shadow-md flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-base">✅</span>
          <span>
            {lang === 'ku' ? (
              <>
                شیکردنەوەی سایبەر سەکیوریتی بۆ وێبگەی{' '}
                <strong className="text-[#e2a545] font-mono break-all">{data.targetUrl}</strong> سەرکەوتوو بوو:
              </>
            ) : (
              <>
                Cyber Security Audit completed successfully for{' '}
                <strong className="text-[#e2a545] font-mono break-all">{data.targetUrl}</strong>:
              </>
            )}
          </span>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-1 bg-[#1e1d1a] border border-[#2b2a26] rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setLang('ku')}
            className={`px-2 py-0.5 rounded transition ${lang === 'ku' ? 'bg-[#e2a545] text-[#111110] font-bold' : 'text-[#9e978c] hover:text-[#f2ede4]'}`}
          >
            کوردی
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded transition ${lang === 'en' ? 'bg-[#e2a545] text-[#111110] font-bold' : 'text-[#9e978c] hover:text-[#f2ede4]'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Security Report Card Container */}
      <div className="bg-[#111318] border border-[#e2a545]/30 rounded-2xl p-4 sm:p-5 shadow-2xl font-sans relative overflow-hidden backdrop-blur-sm">
        {/* Subtle accent corner glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#e2a545]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 mb-4 border-b border-[#2b2a26]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2a545]/15 border border-[#e2a545]/30 flex items-center justify-center text-[#e2a545]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-bold text-[#e2a545] tracking-wide flex items-center gap-2">
                VX Cyber Intelligence Audit Report
              </h3>
              <div className="text-[11px] text-[#9e978c] flex items-center gap-2 font-mono">
                <Globe className="w-3 h-3 text-[#9e978c]" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">{data.host}</span>
                <span>•</span>
                <Clock className="w-3 h-3 text-[#9e978c]" />
                <span>{data.latencyMs}ms</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getGradeColor(
                data.grade
              )} flex items-center gap-1.5 font-mono`}
            >
              Grade {data.grade} ({data.overallScore}/100)
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {data.isReachable ? 'Target Active' : 'Unreachable'}
            </span>
          </div>
        </div>

        {/* 5-Point Audit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {data.points.slice(0, 4).map((pt) => (
            <div
              key={pt.id}
              className="bg-[#181920] border border-[#1d1c1a] hover:border-[#2b2a26] transition rounded-xl p-3 text-[12.5px] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 text-[#9e978c] font-semibold">
                <span className="text-[12px] leading-snug">{lang === 'ku' ? pt.titleKu : pt.titleEn}</span>
                {getStatusIcon(pt.status)}
              </div>
              <div className="text-[#f2ede4] font-mono text-[12px] leading-relaxed bg-[#101115] p-2 rounded-lg border border-[#2b2a26]/40">
                {lang === 'ku' ? pt.valueKu : pt.valueEn}
              </div>
            </div>
          ))}
        </div>

        {/* Point 5: Full Width for Database / SQLi */}
        {data.points[4] && (
          <div className="bg-[#181920] border border-[#1d1c1a] hover:border-[#2b2a26] transition rounded-xl p-3 text-[12.5px] mb-3.5">
            <div className="flex items-center justify-between gap-2 mb-1.5 text-[#9e978c] font-semibold">
              <span className="text-[12px]">
                {lang === 'ku' ? data.points[4].titleKu : data.points[4].titleEn}
              </span>
              {getStatusIcon(data.points[4].status)}
            </div>
            <div className="text-[#f2ede4] font-mono text-[12px] leading-relaxed bg-[#101115] p-2 rounded-lg border border-[#2b2a26]/40">
              {lang === 'ku' ? data.points[4].valueKu : data.points[4].valueEn}
            </div>
          </div>
        )}

        {/* AI Hardening Insight if present */}
        {data.aiInsight && (
          <div className="bg-[#15161f] border border-[#e2a545]/20 rounded-xl p-3.5 text-xs text-[#f2ede4] mb-3.5">
            <div className="flex items-center gap-1.5 text-[#e2a545] font-semibold mb-1.5 text-[12px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ku' ? 'شیکاریی هوشەکی VX Sovereign' : 'VX Sovereign AI Synthesis'}</span>
            </div>
            <p className="text-[#9e978c] leading-relaxed whitespace-pre-line text-[11.5px]">
              {data.aiInsight}
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#1d1c1a] text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191816] hover:bg-[#252422] text-[#9e978c] hover:text-[#f2ede4] border border-[#2b2a26] transition font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ku' ? 'کۆپیکرا!' : 'Copied!') : lang === 'ku' ? 'کۆپیکردنی ڕاپۆرت' : 'Copy Report'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191816] hover:bg-[#252422] text-[#9e978c] hover:text-[#f2ede4] border border-[#2b2a26] transition font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ku' ? 'داگرتن (JSON)' : 'Export JSON'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onRescan && (
              <button
                onClick={() => onRescan(data.targetUrl)}
                className="px-3 py-1.5 rounded-lg bg-[#191816] hover:bg-[#252422] text-[#e2a545] border border-[#e2a545]/30 hover:border-[#e2a545] transition font-medium"
              >
                {lang === 'ku' ? '🔄 دووبارە پشکنین' : '🔄 Re-scan'}
              </button>
            )}
            {onAskHardening && (
              <button
                onClick={() => onAskHardening(data.targetUrl)}
                className="px-3 py-1.5 rounded-lg bg-[#e2a545] text-[#111110] hover:bg-[#f0c37c] font-semibold transition shadow-sm"
              >
                {lang === 'ku' ? '🛡️ ڕێنمایی بەهێزکردن' : '🛡️ Hardening Plan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
