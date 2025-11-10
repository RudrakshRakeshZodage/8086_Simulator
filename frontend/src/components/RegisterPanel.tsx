import React from 'react';
import { Registers } from '../types';

interface RegisterPanelProps {
  registers: Registers;
  ip: number;
}

export const RegisterPanel: React.FC<RegisterPanelProps> = ({ registers, ip }) => {
  const formatHex = (value: number) => `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;

  const generalPurposeRegs = ['AX', 'BX', 'CX', 'DX'];
  const indexPointerRegs = ['SI', 'DI', 'BP', 'SP'];
  const segmentRegs = ['CS', 'DS', 'SS', 'ES'];

  const renderRegister = (name: string, value: number) => (
    <div key={name} className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded-md">
      <span className="font-bold text-blue-300">{name}</span>
      <span className="font-mono text-green-400">{formatHex(value)}</span>
    </div>
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-600 pb-2">
        📊 CPU Registers
      </h2>

      <div className="space-y-4">
        {/* Instruction Pointer */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Instruction Pointer</h3>
          <div className="flex justify-between items-center py-2 px-3 bg-purple-900 rounded-md">
            <span className="font-bold text-purple-300">IP</span>
            <span className="font-mono text-purple-200">{formatHex(ip)}</span>
          </div>
        </div>

        {/* General Purpose Registers */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-white font-semibold mb-2">General Purpose</h3>
          <div className="grid grid-cols-2 gap-2">
            {generalPurposeRegs.map(reg => renderRegister(reg, registers[reg as keyof Registers]))}
          </div>
        </div>

        {/* Index and Pointer Registers */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Index & Pointer</h3>
          <div className="grid grid-cols-2 gap-2">
            {indexPointerRegs.map(reg => renderRegister(reg, registers[reg as keyof Registers]))}
          </div>
        </div>

        {/* Segment Registers */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Segment</h3>
          <div className="grid grid-cols-2 gap-2">
            {segmentRegs.map(reg => renderRegister(reg, registers[reg as keyof Registers]))}
          </div>
        </div>
      </div>
    </div>
  );
};