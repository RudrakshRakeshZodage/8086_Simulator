import React from 'react';
import { CPUState } from '../types';

interface PinsPanelProps {
  cpuState: CPUState | null;
}

export const PinsPanel: React.FC<PinsPanelProps> = ({ cpuState }) => {
  const isRead = cpuState?.memory_access?.type === 'read';
  const isWrite = cpuState?.memory_access?.type === 'write';
  const hasAccess = !!cpuState?.memory_access;
  const address = cpuState?.memory_access?.address || 0;

  const leftPins = [
    { num: 1, label: 'GND', value: 0 },
    { num: 2, label: 'AD14', active: hasAccess && (address & (1 << 14)) },
    { num: 3, label: 'AD13', active: hasAccess && (address & (1 << 13)) },
    { num: 4, label: 'AD12', active: hasAccess && (address & (1 << 12)) },
    { num: 5, label: 'AD11', active: hasAccess && (address & (1 << 11)) },
    { num: 6, label: 'AD10', active: hasAccess && (address & (1 << 10)) },
    { num: 7, label: 'AD9', active: hasAccess && (address & (1 << 9)) },
    { num: 8, label: 'AD8', active: hasAccess && (address & (1 << 8)) },
    { num: 9, label: 'AD7', active: hasAccess && (address & (1 << 7)) },
    { num: 10, label: 'AD6', active: hasAccess && (address & (1 << 6)) },
    { num: 11, label: 'AD5', active: hasAccess && (address & (1 << 5)) },
    { num: 12, label: 'AD4', active: hasAccess && (address & (1 << 4)) },
    { num: 13, label: 'AD3', active: hasAccess && (address & (1 << 3)) },
    { num: 14, label: 'AD2', active: hasAccess && (address & (1 << 2)) },
    { num: 15, label: 'AD1', active: hasAccess && (address & (1 << 1)) },
    { num: 16, label: 'AD0', active: hasAccess && (address & (1 << 0)) },
    { num: 17, label: 'NMI', active: false },
    { num: 18, label: 'INTR', active: false },
    { num: 19, label: 'CLK', active: true },
    { num: 20, label: 'GND', value: 0 },
  ];

  const rightPins = [
    { num: 40, label: 'VCC', active: true },
    { num: 39, label: 'AD15', active: hasAccess && (address & (1 << 15)) },
    { num: 38, label: 'A16/S3', active: hasAccess && (address & (1 << 16)) },
    { num: 37, label: 'A17/S4', active: hasAccess && (address & (1 << 17)) },
    { num: 36, label: 'A18/S5', active: hasAccess && (address & (1 << 18)) },
    { num: 35, label: 'A19/S6', active: hasAccess && (address & (1 << 19)) },
    { num: 34, label: 'BHE/S7', active: false },
    { num: 33, label: 'MN/MX', active: true },
    { num: 32, label: 'RD', active: isRead },
    { num: 31, label: 'HOLD', active: false },
    { num: 30, label: 'HLDA', active: false },
    { num: 29, label: 'WR', active: isWrite },
    { num: 28, label: 'M/IO', active: hasAccess },
    { num: 27, label: 'DT/R', active: isWrite },
    { num: 26, label: 'DEN', active: hasAccess },
    { num: 25, label: 'ALE', active: hasAccess },
    { num: 24, label: 'INTA', active: false },
    { num: 23, label: 'TEST', active: true },
    { num: 22, label: 'READY', active: true },
    { num: 21, label: 'RESET', active: false },
  ];

  const Pin = ({ label, num, active, side }: any) => (
    <div className={`flex items-center gap-2 group min-h-[14px] ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="text-[7px] text-white/10 w-3 text-center">{num}</span>
      {/* 3D Pin Lead */}
      <div className="relative w-8 h-[6px] transform-style-3d">
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          active ? 'bg-blue-400 shadow-[0_0_5px_rgba(30,144,255,0.5)]' : 'bg-white/10'
        }`} />
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 ${active ? 'bg-blue-300' : 'bg-white/5'}`} />
      </div>
      <span className={`text-[7px] font-black min-w-8 uppercase tracking-tighter ${
        active ? 'text-blue-400' : 'text-white/20'
      }`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="p-3 h-full flex flex-col min-h-0 perspective-[1000px] bg-[#0c0d12]/50 rounded-2xl hardware-depth border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <h2 className="px-4 text-white/20 font-black text-[8px] uppercase tracking-[0.3em] whitespace-nowrap">
           Hardware Socket Trace
        </h2>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="flex-1 flex justify-center items-center gap-8 animate-plug-in chip-3d-model">
        {/* Left Side Pins */}
        <div className="flex flex-col gap-0.5">
          {leftPins.map(pin => <Pin key={pin.num} {...pin} side="left" />)}
        </div>

        {/* The 3D "Chip" Body */}
        <div className="relative w-20 h-[320px] transform-style-3d">
          {/* Main Body */}
          <div className="absolute inset-0 bg-[#0a0a0c] hardware-depth border border-white/10 flex flex-col items-center justify-center">
             <div className="w-6 h-0.5 bg-black rounded-full absolute top-4 opacity-50" />
             <div className="rotate-90 text-[10px] font-black text-white/5 uppercase tracking-[0.4em] select-none whitespace-nowrap translate-y-4">
                INTEL I8086
             </div>
             <div className="absolute bottom-4 text-[6px] text-white/10 font-bold tracking-widest uppercase">MCS-86 SERIES</div>
          </div>
          
          {/* 3D Edge Detail (Right side depth) */}
          <div className="absolute top-0 right-0 w-2 h-full bg-black translate-x-1 origin-left rotate-y-90 shadow-2xl" />
          
          {/* 3D Top Detail (Top side depth) */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#1a1a1c] -translate-y-1 origin-bottom rotate-x-90" />
        </div>

        {/* Right Side Pins */}
        <div className="flex flex-col gap-0.5">
          {rightPins.map(pin => <Pin key={pin.num} {...pin} side="right" />)}
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-white/5 flex justify-center">
         <div className="text-[7px] text-white/10 font-black tracking-widest uppercase select-none flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
            VCC BUS ACTIVE
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
         </div>
      </div>
    </div>
  );
};
