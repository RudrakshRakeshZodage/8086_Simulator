import React from 'react';
import { ExecutionMode } from '../types';

interface ControlsProps {
  mode: ExecutionMode;
  speed: number;
  onLoad: () => void;
  onStep: () => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  mode,
  speed,
  onLoad,
  onStep,
  onRun,
  onPause,
  onReset,
  onSpeedChange,
}) => {
  const isIdle = mode === 'idle';
  const isRunning = mode === 'running';

  const Button = ({ onClick, disabled, className, children, title }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group border ${
        disabled 
          ? 'opacity-20 cursor-not-allowed border-white/5' 
          : `${className} hover:scale-105 active:scale-95`
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Button 
          onClick={onLoad} 
          disabled={isRunning}
          className="bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20 shadow-[0_4px_12px_rgba(37,99,235,0.1)]"
          title="Compile and Load Assembly"
        >
          <span className="text-base group-hover:rotate-12 transition-transform">💾</span>
          Load Program
        </Button>

        <div className="w-[1px] h-8 bg-white/5 mx-2" />

        <Button 
          onClick={onStep} 
          disabled={isIdle || isRunning}
          className="bg-cyan-600/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-600/20 shadow-[0_4px_12px_rgba(8,145,178,0.1)]"
          title="Execute Single Instruction"
        >
          <span className="text-base group-hover:translate-x-1 transition-transform">👣</span>
          Step
        </Button>

        <Button 
          onClick={isRunning ? onPause : onRun} 
          disabled={isIdle}
          className={`${isRunning 
            ? 'bg-yellow-600/10 text-yellow-400 border-yellow-500/20' 
            : 'bg-green-600/10 text-green-400 border-green-500/20'
          } hover:bg-opacity-20 shadow-[0_4px_12px_rgba(22,163,74,0.1)]`}
          title={isRunning ? 'Pause Execution' : 'Run Program'}
        >
          <span className="text-base group-hover:scale-125 transition-transform">{isRunning ? '⏸️' : '▶️'}</span>
          {isRunning ? 'Pause' : 'Run'}
        </Button>

        <Button 
          onClick={onReset}
          className="bg-red-600/10 text-red-400 border-red-500/20 hover:bg-red-600/20 shadow-[0_4px_12px_rgba(220,38,38,0.1)]"
          title="Reset CPU State"
        >
          <span className="text-base group-hover:rotate-180 transition-transform duration-500">🔄</span>
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-tighter text-white/30">Execution Speed</span>
          <span className="text-[9px] font-mono text-blue-400">{speed}ms per instruction</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-32 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-all accent-blue-500"
        />
      </div>
    </div>
  );
};