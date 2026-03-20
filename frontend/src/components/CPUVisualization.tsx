import React from 'react';
import { CPUState } from '../types';

interface CPUVisualizationProps {
  cpuState: CPUState;
}

export const CPUVisualization: React.FC<CPUVisualizationProps> = ({ cpuState }) => {
  const aluActive = cpuState.current_instruction?.includes('ADD') || 
                   cpuState.current_instruction?.includes('SUB') ||
                   cpuState.current_instruction?.includes('INC') ||
                   cpuState.current_instruction?.includes('DEC') ||
                   cpuState.current_instruction?.includes('CMP');

  return (
    <div className="glass-panel p-3 border-none bg-white/[0.02] flex flex-col justify-center items-center h-full relative overflow-hidden">
      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 w-full text-left">ALU Engine</div>
      
      <div className="relative flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl bg-white/[0.01]">
        {/* Simplified ALU Icon */}
        <div className={`text-4xl transition-all duration-500 mb-2 ${aluActive ? 'scale-110 opacity-100' : 'opacity-20 translate-y-2'}`}>
           ⚙️
        </div>
        
        <div className="text-center">
          <div className={`text-[10px] font-black uppercase tracking-tighter mb-1 transition-colors ${aluActive ? 'text-blue-400' : 'text-white/20'}`}>
            {aluActive ? 'ALU Active' : 'Bus Idle'}
          </div>
          <div className="text-[8px] font-mono text-white/40 italic">
            {cpuState.current_instruction || 'NOP'}
          </div>
        </div>
      </div>

      {/* Connection lines (simplified) */}
      <div className="mt-4 flex gap-4 opacity-10">
         <div className="w-8 h-[1px] bg-white" />
         <div className="w-8 h-[1px] bg-white" />
         <div className="w-8 h-[1px] bg-white" />
      </div>
    </div>
  );
};