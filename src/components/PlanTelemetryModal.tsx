import React from 'react';
import { X, ShieldCheck, Zap, Server, Award, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanTelemetryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121214] border border-[#2b2a26] w-full max-w-md rounded-2xl p-5 shadow-2xl relative text-[#f2ede4]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2b2a26]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#e2a545]" />
            <h3 className="font-bold text-[15px]">VX Pro Max Subscription</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9e978c] hover:text-[#f2ede4] p-1 rounded-lg hover:bg-[#1f1e1a] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quota Progress */}
        <div className="bg-[#171715] border border-[#2b2a26] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#9e978c] font-medium">Neural Inference Quota</span>
            <span className="font-mono text-[#e2a545] font-bold">10.7M / 12.0M tokens</span>
          </div>
          <div className="w-full bg-[#252422] h-2 rounded-full overflow-hidden">
            <div className="bg-[#e2a545] h-full rounded-full w-[89%]" />
          </div>
          <p className="text-[11px] text-[#656056] mt-2">
            Reset cycle: Daily sovereign auto-replenish active.
          </p>
        </div>

        {/* Included Features */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="flex items-center gap-2.5 text-[#9e978c]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unlimited Live 5-Point Cyber Security Audits (/check)</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#9e978c]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>High-Velocity Gemini 3.8 Flash Neural Core</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#9e978c]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sorani Kurdish & English Multilingual Defensive Engine</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#9e978c]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multimodal Vision (Network Diagrams & Code Screenshots)</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#9e978c]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sub-50ms Edge Telemetry & Real-Time Header Analysis</span>
          </div>
        </div>

        <div className="bg-[#181920] border border-[#2b2a26] rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-[#f2ede4]">Firewall & Armor</span>
          </div>
          <span className="font-mono text-emerald-400 text-[11px]">Enforced 24/7</span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-[#e2a545] text-[#111110] font-bold text-xs hover:bg-[#f0c37c] transition shadow-md"
        >
          Close Telemetry
        </button>
      </div>
    </div>
  );
};
