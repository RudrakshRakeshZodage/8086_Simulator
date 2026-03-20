import { useState, useEffect, useRef } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { Controls } from './components/Controls';
import { RegisterPanel } from './components/RegisterPanel';
import { FlagsPanel } from './components/FlagsPanel';
import { MemoryViewer } from './components/MemoryViewer';
import { CPUVisualization } from './components/CPUVisualization';
import { PinsPanel } from './components/PinsPanel';
import { ProcessFlow } from './components/ProcessFlow';
import { ChangeSummary } from './components/ChangeSummary';
import { useWebSocket } from './hooks/useWebSocket';
import { ExecutionMode, CPUState } from './types';

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
  const [prevCpuState, setPrevCpuState] = useState<CPUState | null>(null);
  
  const { isConnected, cpuState, error, sendMessage, registerHandler, clearError } = 
    useWebSocket('ws://localhost:8000/ws');

  // Track state changes
  const lastStateRef = useRef<CPUState | null>(null);
  useEffect(() => {
    if (cpuState !== lastStateRef.current) {
      setPrevCpuState(lastStateRef.current);
      lastStateRef.current = cpuState;
    }
  }, [cpuState]);

  useEffect(() => {
    const handlers = {
      program_loaded: () => setMode('paused'),
      execution_complete: () => setMode('paused'),
      paused: () => setMode('paused'),
      reset_complete: () => {
        setMode('idle');
        setPrevCpuState(null);
        lastStateRef.current = null;
      },
      memory_data: (data: any) => setMemory(data.data),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      registerHandler(event, handler);
    });
  }, [registerHandler]);

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
    <div className="h-screen p-4 overflow-hidden flex flex-col bg-[#0a0c12]">
      {/* Header & Flow & Controls - COMBINED for space */}
      <div className="flex justify-between items-center mb-4 glass-panel px-4 py-2 border-none bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 glow-text-blue tracking-tighter">
              8086 <span className="text-white opacity-50 font-light">VISUAL</span>
            </h1>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="w-96">
            <ProcessFlow isConnected={isConnected} mode={mode} />
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
              isConnected 
                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {isConnected ? '● Online' : '○ Offline'}
            </div>
        </div>
      </div>

      {/* Controls Bar - More Compact */}
      <div className="glass-panel px-4 py-2 mb-4 bg-white/[0.01]">
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

      {/* Error Display - Floating Bottom Right to save space */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-xl flex justify-between items-center shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-xs font-medium">{error}</p>
          </div>
          <button onClick={clearError} className="ml-4 p-1 hover:bg-white/10 rounded-full">✕</button>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="main-grid flex-1 overflow-hidden">
        {/* Editor Column */}
        <div className="flex flex-col min-h-0 hardware-depth rounded-2xl">
          <CodeEditor
            code={code}
            onChange={setCode}
            currentLine={cpuState?.ip}
          />
        </div>

        {/* Central Viz Column */}
        <div className="flex flex-col gap-4 min-h-0 hardware-depth rounded-2xl">
          <div className="flex-1 overflow-hidden">
            <PinsPanel cpuState={cpuState} />
          </div>
          <div className="h-44">
            <ChangeSummary prevCpuState={prevCpuState} currentCpuState={cpuState} />
          </div>
        </div>

        {/* Status Panels Column */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 flex-1 custom-scrollbar hardware-depth rounded-2xl p-2 bg-[#000]/10">
          {cpuState ? (
            <>
              <RegisterPanel registers={cpuState.registers} />
              <div className="grid grid-cols-2 gap-3 min-h-[160px]">
                <FlagsPanel flags={cpuState.flags} />
                <CPUVisualization cpuState={cpuState} />
              </div>
              <MemoryViewer
                memory={memory}
                startAddress={0}
                highlightAddress={cpuState.memory_access?.address}
              />
            </>
          ) : (
            <div className="glass-panel flex-1 flex flex-col items-center justify-center text-center opacity-50 grayscale">
               <div className="text-6xl mb-4">⚙️</div>
               <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                 Waiting for instruction load...
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
