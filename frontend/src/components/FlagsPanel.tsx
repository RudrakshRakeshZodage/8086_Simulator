import React from 'react';
import { Flags } from '../types';

interface FlagsPanelProps {
  flags: Flags;
}

export const FlagsPanel: React.FC<FlagsPanelProps> = ({ flags }) => {
  const flagList = [
    { name: 'CF', label: 'Carry', value: flags.CF },
    { name: 'PF', label: 'Parity', value: flags.PF },
    { name: 'AF', label: 'Aux Carry', value: flags.AF },
    { name: 'ZF', label: 'Zero', value: flags.ZF },
    { name: 'SF', label: 'Sign', value: flags.SF },
    { name: 'TF', label: 'Trap', value: flags.TF },
    { name: 'IF', label: 'Interrupt', value: flags.IF },
    { name: 'DF', label: 'Direction', value: flags.DF },
    { name: 'OF', label: 'Overflow', value: flags.OF },
  ];

  return (
    <div className="glass-panel p-4 flex flex-col gap-4">
      <h2 className="text-white font-bold text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex justify-between">
        <span>Status Flags</span>
        <span className="text-cyan-500 font-black">PSW</span>
      </h2>
      
      <div className="grid grid-cols-3 gap-2">
        {flagList.map((flag) => (
          <div key={flag.name} className={`glass-card p-2 flex flex-col items-center justify-center gap-1 transition-all duration-500 ${
            flag.value ? 'bg-cyan-500/10 border-cyan-500/30' : 'opacity-40 grayscale'
          }`}>
             <span className={`text-[10px] font-black tracking-tighter ${flag.value ? 'text-cyan-400' : 'text-white/20'}`}>{flag.name}</span>
             <div className={`w-1.5 h-1.5 rounded-full ${flag.value ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]' : 'bg-white/10'}`} />
             <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{flag.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};