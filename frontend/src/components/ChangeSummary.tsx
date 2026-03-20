import React from 'react';
import { CPUState } from '../types';

interface ChangeSummaryProps {
  prevCpuState: CPUState | null;
  currentCpuState: CPUState | null;
}

export const ChangeSummary: React.FC<ChangeSummaryProps> = ({ prevCpuState, currentCpuState }) => {
  if (!currentCpuState) return null;

  const changes: string[] = [];
  const pinExplanations: string[] = [];

  const instruction = currentCpuState.current_instruction?.toUpperCase() || '';

  // 1. Direct Pin Explanation Logic
  if (instruction.includes('MOV')) {
    if (instruction.includes('[')) {
      const isRead = instruction.indexOf('[') > instruction.indexOf(',');
      pinExplanations.push(`ALE (Address Latch Enable) pulses to catch the memory address.`);
      pinExplanations.push(`${isRead ? 'RD (Read)' : 'WR (Write)'} pin is pulled LOW to ${isRead ? 'fetch data from' : 'send data to'} memory.`);
    } else {
      pinExplanations.push("Internal Transfer: No RD/WR pins needed for CPU-only moves.");
    }
  } else if (instruction.includes('PUSH') || instruction.includes('POP')) {
    const isPop = instruction.includes('POP');
    pinExplanations.push(`Stack Pointer (SP) used. ALE pulses for stack address.`);
    pinExplanations.push(`${isPop ? 'RD' : 'WR'} pin used for stack ${isPop ? 'POP' : 'PUSH'} cycle.`);
  } else if (instruction.startsWith('ADD') || instruction.startsWith('SUB') || instruction.startsWith('INC')) {
    pinExplanations.push("ALU Cycle: Operation internal to CPU. Static bus status.");
  }

  // 2. State Changes (Deltas)
  if (prevCpuState) {
    Object.keys(currentCpuState.registers).forEach((reg) => {
      const prevVal = (prevCpuState.registers as any)[reg];
      const currVal = (currentCpuState.registers as any)[reg];
      if (prevVal !== currVal) {
        changes.push(`${reg}: 0x${prevVal.toString(16).toUpperCase()} → 0x${currVal.toString(16).toUpperCase()}`);
      }
    });

    Object.keys(currentCpuState.flags).forEach((flag) => {
      const prevVal = (prevCpuState.flags as any)[flag];
      const currVal = (currentCpuState.flags as any)[flag];
      if (prevVal !== currVal) {
        changes.push(`Flag ${flag} changed`);
      }
    });
  }

  return (
    <div className="glass-panel p-3 h-full flex flex-col min-h-0 hardware-depth">
      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
        Execution Dashboard
      </h3>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {/* Pin Explanation Section */}
        <div className="space-y-1">
          <h4 className="text-[8px] font-black text-blue-400/50 uppercase tracking-tighter px-1 italic">Why these pins?</h4>
          {pinExplanations.map((exp, i) => (
            <div key={`exp-${i}`} className="text-[10px] font-bold text-white/80 leading-relaxed px-1">
              • {exp}
            </div>
          ))}
          {pinExplanations.length === 0 && (
             <div className="text-[10px] text-white/30 px-1 italic">Waiting for instruction...</div>
          )}
        </div>

        {/* Changes Section */}
        {changes.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-[8px] font-black text-green-400/50 uppercase tracking-tighter px-1 italic">State Changes</h4>
            {changes.map((change, i) => (
              <div key={`ch-${i}`} className="text-[10px] font-mono text-white/70 px-1">
                 → {change}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 text-[9px] font-black text-white/40 uppercase border-t border-white/5 pt-2">
        {instruction || 'IDLE'}
      </div>
    </div>
  );
};
