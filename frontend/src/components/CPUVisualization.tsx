import React from 'react';
import { CPUState } from '../types';

interface CPUVisualizationProps {
  cpuState: CPUState | null;
}

export const CPUVisualization: React.FC<CPUVisualizationProps> = ({ cpuState }) => {
  if (!cpuState) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🖥️</div>
          <p className="text-gray-400 text-lg">Load a program to start visualization</p>
        </div>
      </div>
    );
  }

  const { current_instruction, memory_access, alu_operation, halted } = cpuState;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
      <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-600 pb-2">
        🎯 CPU Visualization
      </h2>

      <div className="space-y-4">
        {/* Current Instruction */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2 text-sm">Current Instruction</h3>
          <div className="bg-blue-900 p-3 rounded-md border-2 border-blue-500">
            <code className="text-blue-200 font-mono text-lg">
              {current_instruction || 'None'}
            </code>
          </div>
        </div>

        {/* Execution Status */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2 text-sm">Status</h3>
          <div className={`p-3 rounded-md text-center font-bold ${
            halted 
              ? 'bg-red-900 text-red-200' 
              : 'bg-green-900 text-green-200'
          }`}>
            {halted ? '⏹️ HALTED' : '▶️ RUNNING'}
          </div>
        </div>

        {/* ALU Visualization */}
        <div className={`bg-gray-900 p-4 rounded-lg ${
          alu_operation ? 'border-2 border-purple-500' : ''
        }`}>
          <h3 className="text-white font-semibold mb-3 text-sm">ALU (Arithmetic Logic Unit)</h3>
          {alu_operation ? (
            <div className="space-y-3">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-3xl">⚙️</span>
                </div>
                <div className="mt-2 px-3 py-1 bg-purple-600 rounded-full">
                  <span className="text-white font-bold text-sm">{alu_operation.operation}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">Input 1:</span>
                  <span className="text-cyan-400 font-mono">
                    0x{alu_operation.operand1.toString(16).toUpperCase().padStart(4, '0')}
                  </span>
                </div>
                
                {alu_operation.operand2 !== undefined && (
                  <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                    <span className="text-gray-400">Input 2:</span>
                    <span className="text-cyan-400 font-mono">
                      0x{alu_operation.operand2.toString(16).toUpperCase().padStart(4, '0')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center bg-purple-900 p-2 rounded border-2 border-purple-500">
                  <span className="text-gray-300 font-semibold">Result:</span>
                  <span className="text-green-400 font-mono font-bold">
                    0x{alu_operation.result.toString(16).toUpperCase().padStart(4, '0')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center shadow-lg opacity-50">
                <span className="text-3xl">⚙️</span>
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">Idle - No ALU operation</p>
            </div>
          )}
        </div>

        {/* Memory Access */}
        {memory_access && (
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-yellow-500">
            <h3 className="text-white font-semibold mb-2 text-sm">Memory Access</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className={`font-bold ${
                  memory_access.type === 'read' ? 'text-blue-400' : 'text-red-400'
                }`}>
                  {memory_access.type.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-yellow-400 font-mono">
                  0x{memory_access.address.toString(16).toUpperCase().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Data Bus Visualization */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-3 text-sm">System Buses</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Data Bus (16-bit)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Address Bus (20-bit)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Control Bus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};