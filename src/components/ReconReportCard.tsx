import React, { useState } from 'react';
import { MapPin, Server, Shield, Radio, Copy, Check } from 'lucide-react';
import { ReconData } from '../types';

interface Props {
  data: ReconData;
  onAuditDomain?: (domain: string) => void;
}

export const ReconReportCard: React.FC<Props> = ({ data, onAuditDomain }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`IP: ${data.ip} | Domain: ${data.domain} | ASN: ${data.autonomousSystem}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="bg-[#151513] border border-[#2b2a26] text-[#f2ede4] text-[13.5px] p-3.5 rounded-2xl rounded-bl-sm mb-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#e2a545] text-base">🌐</span>
          <span>
            Reconnaissance telemetry resolved for <strong className="text-[#e2a545] font-mono">{data.domain}</strong>:
          </span>
        </div>
      </div>

      <div className="bg-[#111318] border border-[#e2a545]/30 rounded-2xl p-4 sm:p-5 shadow-2xl font-sans relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2b2a26] flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2a545]/15 border border-[#e2a545]/30 flex items-center justify-center text-[#e2a545]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#e2a545]">VX Node & Edge Geolocation Prober</h3>
              <p className="text-[11px] text-[#9e978c] font-mono">BGP / DNS-over-HTTPS Anycast Mapping</p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            Node Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-[#181920] border border-[#1d1c1a] rounded-xl p-3 text-[12.5px]">
            <div className="flex items-center gap-1.5 text-[#9e978c] font-medium mb-1">
              <Server className="w-3.5 h-3.5 text-[#e2a545]" />
              <span>Resolved IPv4 Address</span>
            </div>
            <div className="font-mono text-[13px] text-[#f2ede4] font-semibold">{data.ip}</div>
            <div className="text-[11px] text-[#656056] font-mono mt-0.5">{data.autonomousSystem}</div>
          </div>

          <div className="bg-[#181920] border border-[#1d1c1a] rounded-xl p-3 text-[12.5px]">
            <div className="flex items-center gap-1.5 text-[#9e978c] font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edge Geolocation</span>
            </div>
            <div className="text-[13px] text-[#f2ede4] font-semibold">{data.geo.country}</div>
            <div className="text-[11px] text-[#656056] font-mono mt-0.5">Region: {data.geo.city} ({data.geo.timezone})</div>
          </div>

          <div className="bg-[#181920] border border-[#1d1c1a] rounded-xl p-3 text-[12.5px]">
            <div className="flex items-center gap-1.5 text-[#9e978c] font-medium mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>TLS Cipher & Layer</span>
            </div>
            <div className="font-mono text-[12px] text-[#f2ede4]">{data.tlsVersion}</div>
          </div>

          <div className="bg-[#181920] border border-[#1d1c1a] rounded-xl p-3 text-[12.5px]">
            <div className="flex items-center gap-1.5 text-[#9e978c] font-medium mb-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Edge Ports</span>
            </div>
            <div className="font-mono text-[12px] text-emerald-400">{data.portsOpen.join(' • ')}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1d1c1a] text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191816] hover:bg-[#252422] text-[#9e978c] hover:text-[#f2ede4] border border-[#2b2a26] transition font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Recon Data'}</span>
          </button>

          {onAuditDomain && (
            <button
              onClick={() => onAuditDomain(`https://${data.domain}`)}
              className="px-3 py-1.5 rounded-lg bg-[#e2a545] text-[#111110] hover:bg-[#f0c37c] font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Run 5-Point /check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
