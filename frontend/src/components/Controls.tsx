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
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onLoad}
          disabled={mode === 'running'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
        >
          📥 Load
        </button>

        <button
          onClick={onStep}
          disabled={mode === 'running' || mode === 'idle'}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
        >
          ⏭️ Step
        </button>

        {mode === 'running' ? (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium transition-colors"
          >
            ⏸️ Pause
          </button>
        ) : (
          <button
            onClick={onRun}
            disabled={mode === 'idle'}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
          >
            ▶️ Run
          </button>
        )}

        <button
          onClick={onReset}
          disabled={mode === 'running'}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
        >
          🔄 Reset
        </button>

        <div className="flex items-center gap-2 ml-4">
          <label className="text-white font-medium">Speed:</label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            disabled={mode === 'running'}
            className="w-32"
          />
          <span className="text-white text-sm">{speed}ms</span>
        </div>

        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            mode === 'running' ? 'bg-green-500 text-white' :
            mode === 'stepping' ? 'bg-blue-500 text-white' :
            mode === 'paused' ? 'bg-yellow-500 text-black' :
            'bg-gray-600 text-white'
          }`}>
            {mode.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};