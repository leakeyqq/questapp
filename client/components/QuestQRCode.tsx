'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { CopyButton } from "@/components/copyButton";

interface QuestQRCodeProps {
  questId: string;
  className?: string;
}

export default function QuestQRCode({questId,  className = "" }: QuestQRCodeProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const questUrl = `https://app.questpanda.xyz/quests/${questId}`;


  return (
    <div className={`bg-gradient-to-br from-white to-brand-purple/5 rounded-xl p-6 border border-brand-purple/20 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Gradient border effect */}
        <div className="p-1 bg-gradient-to-r from-brand-purple to-brand-pink rounded-lg">
          <div className="bg-white p-3 rounded-md">
            <QRCodeCanvas 
              value={questUrl} 
              size={150}
              level="M"
              includeMargin={true}
              fgColor="#7e22ce" // brand-purple
            />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-brand-dark mb-2">
            Share this <span className="text-brand-purple">Quest</span>
          </h3>
          
          <p className="text-gray-700 mb-4">
            Invite people by sharing this QR code - <span className="text-brand-pink font-semibold">Scan to join instantly</span>
          </p>
          
          <CopyButton text={questUrl} />
        </div>
      </div>
    </div>
  );
}