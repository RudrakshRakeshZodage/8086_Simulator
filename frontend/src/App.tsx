import React, { useState, useEffect } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { Controls } from './components/Controls';
import { RegisterPanel } from './components/RegisterPanel';
import { FlagsPanel } from './components/FlagsPanel';
import { MemoryViewer } from './components/MemoryViewer';
import { CPUVisualization } from './components/CPUVisualization';
import { useWebSocket } from './hooks/useWebSocket';
import { ExecutionMode } from './types';

const DEFAULT_CODE = `; 8086 Assembly Example
; Simple arithmetic program

MOV AX, 5      ; Load 5 into AX
MOV BX, 3      ; Load 3 into BX
ADD AX, BX     ; AX = AX + BX (5 + 3 = 8)
MOV CX, AX     ; Copy result to CX
INC CX         ; Increment CX (8 + 1 = 9)
SUB CX, 2      ; Subtract 2 from CX (9 - 2 = 7)

; Stack operations
PUSH AX        ; Push AX onto stack
PUSH BX        ; Push BX onto stack
POP DX         ; Pop into DX (gets BX value)
POP SI         ; Pop into SI (gets AX value)`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [mode, setMode] = useState<ExecutionMode>('idle');
  const [speed, setSpeed] = useState(500);
  const [memory, setMemory] = useState<number[]>([]);

  const { isConnected, cpuState, error, sendMessage, registerHandler, clearError } = 
    useWebSocket('ws://localhost:8000/ws');

  // Register event handlers once on mount
  useEffect(() => {
    const handlers = {
      program_loaded: () => setMode('paused'),
      step_complete: () => {}, // CPU state updated automatically
      execution_complete: () => setMode('paused'),
      paused: () => setMode('paused'),
      reset_complete: () => setMode('idle'),
      memory_data: (data: any) => setMemory(data.data),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      registerHandler(event, handler);
    });
  }, [registerHandler]);

  // Request memory data when CPU state changes
  useEffect(() => {
    if (cpuState && isConnected) {
      sendMessage({ command: 'get_memory', start: 0, length: 512 });
    }
  }, [cpuState, isConnected, sendMessage]);

  const handleLoad = () => {
    sendMessage({ command: 'load', code });
  };

  const handleStep = () => {
    setMode('stepping');
    sendMessage({ command: 'step' });
  };

  const handleRun = () => {
    setMode('running');
    sendMessage({ command: 'run', speed });
  };

  const handlePause = () => {
    sendMessage({ command: 'pause' });
  };

  const handleReset = () => {
    sendMessage({ command: 'reset' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">🖥️ Visual 8086 Assembly Simulator</h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time CPU visualization and step-by-step execution
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isConnected ? 'bg-green-900' : 'bg-red-900'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mx-6 mt-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 py-4">
        <Controls
          mode={mode}
          speed={speed}
          onLoad={handleLoad}
          onStep={handleStep}
          onRun={handleRun}
          onPause={handlePause}
          onReset={handleReset}
          onSpeedChange={setSpeed}
        />
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6 grid grid-cols-12 gap-4" style={{ height: 'calc(100vh - 240px)' }}>
        {/* Left Column - Code Editor */}
        <div className="col-span-5">
          <CodeEditor
            code={code}
            onChange={setCode}
            currentLine={cpuState?.ip}
          />
        </div>

        {/* Middle Column - CPU Visualization */}
        <div className="col-span-3 space-y-4 overflow-auto">
          <CPUVisualization cpuState={cpuState} />
        </div>

        {/* Right Column - Registers & Flags */}
        <div className="col-span-4 space-y-4 overflow-auto">
          {cpuState ? (
            <>
              <RegisterPanel registers={cpuState.registers} ip={cpuState.ip} />
              <FlagsPanel flags={cpuState.flags} />
              <MemoryViewer
                memory={memory}
                startAddress={0}
                highlightAddress={cpuState.memory_access?.address}
              />
            </>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400">Load a program to see CPU state</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;