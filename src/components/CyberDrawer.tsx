import React, { useState } from 'react';
import { X, Shield, Globe, Terminal, History, ExternalLink, Zap, Lock, Cpu, Sparkles } from 'lucide-react';
import { SecurityReportData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTriggerCheck: (url: string) => void;
  onTriggerPrompt: (prompt: string) => void;
  onOpenCodeModal?: () => void;
  scanHistory: SecurityReportData[];
}

export const CyberDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onTriggerCheck,
  onTriggerPrompt,
  onOpenCodeModal,
  scanHistory,
}) => {
  const [quickUrl, setQuickUrl] = useState('');

  if (!isOpen) return null;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    onTriggerCheck(quickUrl.trim());
    setQuickUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-sm bg-[#111114] border-r border-[#2b2a26] h-full flex flex-col p-5 shadow-2xl z-10 text-[#f2ede4] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2b2a26]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2a545]/15 border border-[#e2a545]/30 flex items-center justify-center text-[#e2a545]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-[#f2ede4] leading-tight">𝙓𝙑-𝘼𝙄 Cyber Suite</h2>
              <p className="text-[11px] text-[#9e978c]">Sovereign Defensive Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9e978c] hover:text-[#f2ede4] p-1.5 rounded-lg hover:bg-[#1f1e1a] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick URL Scanner Bar */}
        <div className="my-4">
          <label className="text-[11px] font-semibold text-[#9e978c] uppercase tracking-wider block mb-1.5">
            Quick 5-Point URL Scan
          </label>
          <form onSubmit={handleQuickSubmit} className="flex items-center gap-1.5">
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-[#181920] border border-[#2b2a26] focus:border-[#e2a545] text-xs px-3 py-2 rounded-xl text-[#f2ede4] outline-none font-mono"
            />
            <button
              type="submit"
              className="bg-[#e2a545] hover:bg-[#f0c37c] text-[#111110] font-bold text-xs px-3 py-2 rounded-xl transition"
            >
              Scan
            </button>
          </form>
        </div>

        {/* Built-in Cyber Modules */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#9e978c] uppercase tracking-wider block mb-2">
            Cyber Operations & Tools
          </label>
          <div className="space-y-1.5">
            <button
              onClick={() => {
                onTriggerCheck('https://example.com');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#e2a545]" />
                <span className="font-medium">5-Point Vulnerability Auditor</span>
              </div>
              <span className="text-[10px] text-[#656056] font-mono">/check</span>
            </button>

            <button
              onClick={() => {
                onTriggerPrompt('/env https://example.com');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">.env & Secrets Exposure Prober</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">/env</span>
            </button>

            <button
              onClick={() => {
                onTriggerPrompt('/location');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">دۆزینەوەی شوێن لە وێنەدا (Photo Location)</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">/location</span>
            </button>

            <button
              onClick={() => {
                onTriggerPrompt('Translate this to Kurdish (Sorani): "Security headers like Content-Security-Policy and HSTS protect users against cross-site scripting."');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">Kurdish Sorani Cyber Translator</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">سۆرانی</span>
            </button>

            <button
              onClick={() => {
                onTriggerPrompt('Debug my FastAPI endpoint with CORS, Rate Limiting, and JWT token validation.');
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] flex items-center justify-between text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-medium">FastAPI Security Debugger</span>
              </div>
              <span className="text-[10px] text-[#656056] font-mono">Python</span>
            </button>

            {onOpenCodeModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCodeModal();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-[#221f18] hover:bg-[#2b261c] border border-[#e2a545]/40 flex items-center justify-between text-xs transition text-[#e2a545]"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-[#e2a545]" />
                  <span className="font-semibold">کۆپی کردنی تەواوی کۆدەکان (Single File)</span>
                </div>
                <span className="text-[10px] bg-[#e2a545] text-[#111110] px-1.5 py-0.5 rounded font-bold">Copy</span>
              </button>
            )}
          </div>
        </div>

        {/* Scan History in Current Session */}
        <div className="flex-1 overflow-y-auto mb-4">
          <label className="text-[11px] font-semibold text-[#9e978c] uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <History className="w-3 h-3 text-[#e2a545]" />
              <span>Session Audit History</span>
            </span>
            <span className="font-mono text-[10px] text-[#656056]">{scanHistory.length} audited</span>
          </label>

          {scanHistory.length === 0 ? (
            <div className="text-center py-6 px-3 bg-[#151517] rounded-xl border border-[#22211e] text-xs text-[#656056]">
              No scans run yet in this session. Run <code className="text-[#e2a545]">/check &lt;url&gt;</code> to begin.
            </div>
          ) : (
            <div className="space-y-2">
              {scanHistory.map((item, idx) => (
                <div
                  key={`${item.targetUrl}-${item.scannedAt || idx}-${idx}`}
                  onClick={() => {
                    onTriggerCheck(item.targetUrl);
                    onClose();
                  }}
                  className="p-2.5 bg-[#171715] hover:bg-[#1f1e1a] border border-[#2b2a26] rounded-xl cursor-pointer transition text-xs flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <div className="font-mono text-[#f2ede4] font-medium truncate">{item.host}</div>
                    <div className="text-[10px] text-[#656056]">{new Date(item.scannedAt).toLocaleTimeString()}</div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      item.grade === 'A+' || item.grade === 'A'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    Grade {item.grade}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System telemetry footer */}
        <div className="pt-3 border-t border-[#2b2a26] text-[11px] text-[#656056] space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <span>Kernel Status</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Model Core</span>
            <span className="text-[#f2ede4]">Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Threat Telemetry</span>
            <span className="text-[#e2a545]">Live Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};
