import React from 'react';
import { ExecutionMode } from '../types';

interface ProcessFlowProps {
  mode: ExecutionMode;
  isConnected: boolean;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ mode, isConnected }) => {
  const steps = [
    { 
      id: 'connect', 
      label: 'Connect', 
      icon: '🔌', 
      isActive: isConnected,
      isCompleted: isConnected 
    },
    { 
      id: 'code', 
      label: 'Write Code', 
      icon: '📝', 
      isActive: isConnected && mode === 'idle',
      isCompleted: mode !== 'idle' 
    },
    { 
      id: 'execute', 
      label: 'Execute', 
      icon: '⚡', 
      isActive: mode === 'running' || mode === 'stepping',
      isCompleted: mode === 'paused' || mode === 'idle' && isConnected // Added a bit more logic
    },
    { 
      id: 'output', 
      label: 'Pins & Output', 
      icon: '🎯', 
      isActive: mode !== 'idle',
      isCompleted: false 
    },
  ];

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 px-4 hardware-depth rounded-xl bg-white/[0.02]">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
              step.isActive 
                ? 'bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-110' 
                : step.isCompleted 
                  ? 'bg-green-600 shadow-[0_0_5px_rgba(34,197,94,0.3)]' 
                  : 'bg-gray-800 opacity-50'
            }`}>
              {step.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${
              step.isActive ? 'text-blue-400 text-glow-blue' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-[1px] min-w-[20px] transition-all duration-1000 ${
              step.isCompleted ? 'bg-green-600' : 'bg-gray-800'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
