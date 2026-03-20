import React from 'react';
import { Registers } from '../types';

interface RegisterPanelProps {
  registers: Registers;
}

export const RegisterPanel: React.FC<RegisterPanelProps> = ({ registers }) => {
  const allRegs = [
    { label: 'AX', val: registers.AX },
    { label: 'BX', val: registers.BX },
    { label: 'CX', val: registers.CX },
    { label: 'DX', val: registers.DX },
    { label: 'SP', val: registers.SP },
    { label: 'BP', val: registers.BP },
    { label: 'SI', val: registers.SI },
    { label: 'DI', val: registers.DI },
    { label: 'CS', val: registers.CS },
    { label: 'DS', val: registers.DS },
    { label: 'ES', val: registers.ES },
    { label: 'SS', val: registers.SS },
  ];

  return (
    <div className="glass-panel p-3 hardware-depth">
      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Registers</h3>
      <div className="grid grid-cols-4 gap-2">
        {allRegs.map((reg) => (
          <div key={reg.label} className="bg-white/5 border border-white/5 rounded p-2 text-center transition-colors hover:border-white/20">
            <div className="text-[9px] font-black text-white/30 tracking-tighter mb-1">{reg.label}</div>
            <div className="text-[11px] font-mono font-bold text-white/90">
              {reg.val.toString(16).toUpperCase().padStart(4, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};