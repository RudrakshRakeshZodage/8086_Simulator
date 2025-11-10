import React from 'react';
import { Flags } from '../types';

interface FlagsPanelProps {
  flags: Flags;
}

export const FlagsPanel: React.FC<FlagsPanelProps> = ({ flags }) => {
  const flagDescriptions: Record<keyof Flags, string> = {
    CF: 'Carry',
    PF: 'Parity',
    AF: 'Auxiliary Carry',
    ZF: 'Zero',
    SF: 'Sign',
    TF: 'Trap',
    IF: 'Interrupt Enable',
    DF: 'Direction',
    OF: 'Overflow',
  };

  const renderFlag = (name: keyof Flags) => {
    const value = flags[name];
    const description = flagDescriptions[name];

    return (
      <div
        key={name}
        className={`flex flex-col items-center p-3 rounded-lg transition-all ${
          value === 1 
            ? 'bg-green-600 shadow-lg shadow-green-500/50' 
            : 'bg-gray-700'
        }`}
      >
        <span className={`font-bold text-lg ${value === 1 ? 'text-white' : 'text-gray-400'}`}>
          {name}
        </span>
        <span className={`text-2xl font-mono ${value === 1 ? 'text-white' : 'text-gray-500'}`}>
          {value}
        </span>
        <span className={`text-xs mt-1 ${value === 1 ? 'text-green-200' : 'text-gray-500'}`}>
          {description}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-600 pb-2">
        🚩 Flags Register
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(flags) as Array<keyof Flags>).map(renderFlag)}
      </div>
    </div>
  );
};