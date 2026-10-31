import React from 'react';
import { X, Check, Cpu, ShieldAlert, Sparkles, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (modelName: string) => void;
}

export const ModelSelectorModal: React.FC<Props> = ({ isOpen, onClose, currentModel, onSelectModel }) => {
  if (!isOpen) return null;

  const models = [
    {
      id: 'VX-843B Cyber Agent',
      name: 'VX-843B Cyber Agent',
      badge: 'Active Defense',
      desc: 'Sovereign cybersecurity auditor, OWASP vulnerability scanner, and defensive penetration testing engine.',
      icon: <ShieldAlert className="w-5 h-5 text-[#e2a545]" />,
    },
    {
      id: 'VX Sovereign Core (gemini-3.8-flash)',
      name: 'VX Sovereign Core (gemini-3.8-flash)',
      badge: 'Ultra Velocity',
      desc: 'State-of-the-art general intelligence, complex coding, and fluent Sorani Kurdish bilingual reasoning.',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
    },
    {
      id: 'VX Penetration Guard',
      name: 'VX Penetration Guard',
      badge: 'Hardening & Audit',
      desc: 'Specialized in server headers, rate limiting, SQL injection defense, and infrastructure hardening.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'VX Multimodal Vision Recon',
      name: 'VX Multimodal Vision Recon',
      badge: 'Visual Recon',
      desc: 'Analyzes attached screenshots, network topologies, firewall rule tables, and UI security flaws.',
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121214] border border-[#2b2a26] w-full max-w-lg rounded-2xl p-5 shadow-2xl relative text-[#f2ede4]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2b2a26]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2a545] shadow-[0_0_8px_rgba(226,165,69,0.8)]" />
            <h3 className="font-bold text-[15px] text-[#f2ede4]">Select VX Neural Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9e978c] hover:text-[#f2ede4] p-1 rounded-lg hover:bg-[#1f1e1a] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {models.map((m) => {
            const isSelected = currentModel === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  onSelectModel(m.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#1e1c17] border-[#e2a545] shadow-[0_0_15px_rgba(226,165,69,0.15)]'
                    : 'bg-[#171715] border-[#2b2a26] hover:border-[#382c19] hover:bg-[#1b1a18]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#252422] border border-[#2b2a26] shrink-0 mt-0.5">
                    {m.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#f2ede4]">{m.name}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#252422] text-[#e2a545] border border-[#382c19]">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#9e978c] leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#e2a545] text-[#111110] flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#2b2a26] flex items-center justify-between text-xs text-[#656056]">
          <span>Server-side sovereign execution via Gemini</span>
          <span className="font-mono text-[#e2a545]">Encrypted Endpoint</span>
        </div>
      </div>
    </div>
  );
};
